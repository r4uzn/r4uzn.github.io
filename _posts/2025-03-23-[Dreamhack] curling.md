![Image](https://github.com/user-attachments/assets/2a06cdd3-591f-4bef-9dc8-fe66c5de5029)

![Image](https://github.com/user-attachments/assets/fba01ca5-a162-4b3f-b17f-40c8d10c3689)
문제 페이지에 접속하면 404 NOT Found가 뜬다

```python
from flask import Flask, request
from os import urandom
from subprocess import run, TimeoutExpired

app = Flask(__name__)
app.secret_key = urandom(32)

try:
    FLAG = open("/flag", "r").read().strip()
except:
    FLAG = "[**FLAG**]"

ALLOWED_HOSTS = ['dreamhack.io', 'tools.dreamhack.io']

@app.route("/api/v1/test/curl", methods=["POST"])
def admin():
    url = request.form["url"].strip()
    for host in ALLOWED_HOSTS:
        if url.startswith('http://' + host):
            break

        return {'result': False, 'msg': 'Not Allowed host'}
    
    if url.endswith('/test/internal'):
        return {'result': False, 'msg': 'Not Allowed endpoint'}

    try:
        response = run(
            ["curl", f"{url}"], capture_output=True, text=True, timeout=1
        )
        return {'result': True, 'msg': response.stdout}

    except TimeoutExpired:
        return {'result': False, 'msg': 'Timeout'}

@app.route('/api/v1/test/internal', methods=["GET"])
def test():
    ip = request.remote_addr
    if not ip == '127.0.0.1':
        return {'result': False, 'msg': 'Only local access is allowed'}
    return {'result': True, 'msg': FLAG}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='8000')
```

`/api/v1/test/curl` 엔드포인트 분석

1. `url` 값이 `dreamhack.io` 또는 `tools.dreamhack.io`로 시작하면 허용
2. `url`이 `/test/internal`로 끝나면 차단
3. `curl` 명령어를 실행하여 `url`의 데이터를 가져옴
4. 결과를 반환 (`response.stdout`)
5. POST 요청만 허용

`/api/v1/test/internal` 엔드포인트

1. FLAG를 출력하는 엔드포인트
2. 로컬(127.0.0.1)에서만 접근 가능
3. 외부에서 직접 접근하면 차단됨.

→ `/api/v1/test/curl` 엔드포인트에서 **`curl`을 실행하여 서버 내부 요청이 가능하다는 것을 알 수 있다**

현재 코드에서는 `startswtich()`를 사용하여 도메인을 검사하는데,

이것을 우회하기 위해 먼저 URL의 구조를 알아야 한다.

URL은 다음과 같은 구조를 가진다.

```c
scheme://[userinfo@]host[:port]/path[?query][#fragment]
```

- `scheme`: `http`, `https`, `ftp` 등 프로토콜
- `userinfo@`: **사용자 인증 정보** (보통 `user:password@` 형태)
- `host`: 도메인 또는 IP 주소
- `port`: 포트 번호 (기본적으로 `http=80`, `https=443`)
- `path`: 요청 경로
- `query`: `?key=value` 형식의 추가 데이터
- `fragment`: `#` 이후의 부분

여기서, 웹 브라우저와 `curl` 같은 도구는 `@` 기호가 포함된 경우, `@` 오른쪽을 최종 목적지(host)로 인식하기 때문에 @를 이용해 URL 호스트를 우회할 수 있다.

->

```c
http://username:password@example.com/path
```

이런 것들을 종합해서 CURL을 이용해 요청을 보냈더니

![Image](https://github.com/user-attachments/assets/9db5de14-6441-47d0-8293-a4a4371588d2)

false가 반환됐다.

이유는 `endswitch` 로 인해 **`/test/internal`**로 끝나면 차단되기 때문이다.

그러나 정확히 **`/test/internal`** 로 끝날때만 차단되기 때문에

경로 끝에 더미 파라미터를 추가하면 우회할 수 있다.

따라서 끝에 `?dummy=1`  를 추가해서 요청하면


![Image](https://github.com/user-attachments/assets/482c21dd-a6f8-465e-9f1a-9ab58a14b8c6)

플래그 값을 얻을 수 있다.
