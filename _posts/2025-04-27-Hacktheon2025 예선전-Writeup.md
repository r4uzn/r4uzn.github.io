# **Forgotten Past**

![Image](/assets/img/hacktheon2025/image1.png)

주소에 접속 시 메인화면에 robots라는 글자가 보인다.

![Image](/assets/img/hacktheon2025/image2.png)

robots.txt에 접속해보면 `/old_site/` 경로에 대해 `Disallow` 하고 있다.

![Image](/assets/img/hacktheon2025/image3.png)

해당 경로에 접속해 보았더니 CSS가 적용되지 않은 html 페이지가 노출되어 있었다.

![Image](/assets/img/hacktheon2025/image4.png)

Login 버튼을 누르면 로그인 페이지가 나온다.

![Image](/assets/img/hacktheon2025/image5.png)

개발자 도구를 통해 해당 페이지를 확인해보면 

```nasm
<script>
    function checkLogin(id, pw) {
        if (id === "admin" && pw === "letmein123") {
            window.location.href = "a6b49f3b955fef1ee136033a83382e6c.html";
        } else {
            alert("Invalid credentials. Please try again.");
        }
    }
</script>
```

이라는 JS코드를 확인할 수 있다.
![Image](/assets/img/hacktheon2025/image6.png)

해당 값을 넣고 로그인하면

![Image](/assets/img/hacktheon2025/image7.png)

FLAG값이 있는 페이지가 나온다.

FLAG{d0n'7_f0rg37_7h3_0ld_r0807}

---

# I love reversing

![Image](/assets/img/hacktheon2025/image8.png)

![Image](/assets/img/hacktheon2025/image9.png)

제공되는 파일은 exe 파일 하나다.

![Image](/assets/img/hacktheon2025/image10.png)

해당 파일을 실행 시 이미지와 같이 4653 포트로 서버가 실행되는 것을 알 수 있다.

![Image](/assets/img/hacktheon2025/image11.png)

해당 페이지로 접속해보면 Not Found 페이지가 나온다.

![Image](/assets/img/hacktheon2025/image12.png)

IDA를 통해 infect.exe 파일을 열어보면, 여러 요소들을 통해 PyInstaller로 패키징된 파일이라는 것을 알 수 있다.

따라서 이 파일이 내부에 파이썬 코드를 압축해서 담고 있는 실행 파일이라는 것을 알 수 있다.

![Image](/assets/img/hacktheon2025/image13.png)

pyinstxtractor를 통해  .pyc 파일들을 추출할 수 있다.

![Image](/assets/img/hacktheon2025/image14.png)

추출된 .pyc 파일들 중 핵심 로직이 들어있을 것으로 추정되는 [infect.py](http://infect.py)c 를 발견하였다.

 

![Image](/assets/img/hacktheon2025/image15png)

uncompyle6를 통해 해당 파일을 디컴파일 시도했지만, infect.pyc는 python 3.12 버전으로 생성된 파일이었고 지원되지 않는 버전이었다.

![Image](/assets/img/hacktheon2025/image16.png)

decompyle3도 마찬가지로 지원되지 않았다.

![Image](/assets/img/hacktheon2025/image17.png)

pycdas를 이용해 디컴파일 해보니 latitude와 longitude에 각각 “2.59363” 이라는 값이 더해지는 것이 보였다. 그래서 해당 값을 플래그로 입력해보니 정답이 아니었다.

그래서 `.pyc` 파일 안에 있는 바이트코드가 약간 꼬였거나 PyInstaller 빌드시 특수하게 패킹된 코드라서 `dis` 표준 모듈이 정상적으로 처리하지 못한다고 추측을 하고, 직접 상수 테이블 (`co_consts`)을 보는 것으로 시도를 했다.

![Image](/assets/img/hacktheon2025/image18.png)

해당 코드를 작성한 후 실행시켜보면,

![Image](/assets/img/hacktheon2025/image19.png)

해당 값들이 들어있는 것을 볼 수 있다. 

이 중 “2.593627” 이라는 값을 입력하면 정답이다.

![Image](/assets/img/hacktheon2025/image20.png)

FLAG{2.593627}