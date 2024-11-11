디렉터리 스캔 기능을 구현하면서 스캔 속도가 너무 느린 문제를 해결하기 위해 찾아 보던 중

비동기 방식에 대해 알게되었다.

절차적 언어인 파이썬은 작업이 순차적으로 실행되는 방식이다. 

즉, 한 작업이 끝나야 다음 작업이 실행되고 이러한 동작 방식은 직관적이고 이해하기 쉬운 장점이 있다.

동기 프로그래밍은 일반적으로 순차적인 작업을 수행하는 경우에 적합하다

-

비동기 프로그래밍은 작업이 독립적으로 실행되는 방식으로,

단일 스레드 작업을 병렬로 처리하도록 만들어 상당한 속도 향상을 이끌어낼 수 있다.

주로 I/O 작업이나 네트워크 요청과 같이 시간이 오래 걸리는 작업에 적합하다.

-

파이썬에서는 asyncio 라이브러리를 사용하여 구현할 수 있다.

-

다음과 같이 동기 함수를 구현했을 때,

```python
def do_test():
    return 'example'
```
def 키워드 앞에 async 키워드를 붙이면 비동기 함수가 되며, 이러한 함수를 코루틴(coroutine)이라고 한다.

```python
async def do_test():
    return 'example'
```

비동기 함수는 async로 선언된 다른 비동기 함수 내에서 await 키워드를 붙여서 호출해야 한다.

```python
async def main_test():
    await do_test()
```
async로 선언되지 않은 일반 동기 함수 내에서 비동기 함수를 호출하려면 이벤트 루프를 이용하거나 asyncio.run을 이용한다.

```python
loop = asyncio.get_event_loop()
loop.run_until_complete(main_test())
loop.close()
```
```python
asyncio.run(main_test())
```

이렇게 해서 일단 구현된 상태를 깃헙에 올렸다.

Link : https://github.com/clevflo/clevsca

앞으로 천천히 개선할 사항

스캔 기능 멈춤 - 스캔 목록이 너무 많아서 오래 걸리기 때문에 멈추는 기능이 필요함

스캔 상황 표시 - progressbar로 진행 상황을 표시할 필요가 있음

리눅스 CLI로 사용 가능하도록 구현