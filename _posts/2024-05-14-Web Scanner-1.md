블로그 글 적는 걸 깜빡해서 중간부터 적어보는 개발 일지

---

1. webscan 기능 구현

![image](https://github.com/user-attachments/assets/7c41fe2a-97a7-45bd-81ec-c70328d5c3a4)

해당 웹사이트의 http 통신 정보를 스캔하는 기능

requests 모듈을 통해 구현 했다.

![image](https://github.com/user-attachments/assets/49bafc2c-69be-47aa-bd0d-0c959d9925fd)

burp suite와 비교했을 때 뭔가 부족한 정보들이지만 그래도 일단은 킵,,

---

2. directory scan 기능 구현

![image](https://github.com/user-attachments/assets/330dba15-05ce-4c93-b233-7653273dff2e)

알파벳 소문자 + 숫자 조합으로 브루트포스를 시도 했었는데, 너무 느려서 작동 여부를 판단하기 어려워

일단은 끝에 한 글자만 시도해 보았다.

![image](https://github.com/user-attachments/assets/02aeb919-fc7e-419b-b2d2-bb181c2900f0)

정상 작동되는 것 확인.

실사용 하기엔 속도가 너무 느린데, 빠르게 동작 되도록하는 방법을 알아봐야겠다.

아니면 자주 사용되는 디렉터리 이름을 스캔하는 식으로 구현해야할듯 하다.

---

함수 중단 버튼을 만들고 있는데,,,

![image](https://github.com/user-attachments/assets/33270677-3228-4784-afb7-a9e59ff6adf7)

왜 이건 되고

![image](https://github.com/user-attachments/assets/d31ab4ec-24a0-4f89-95ad-fc76df6dafe3)

이건 안되는거지??

![image](https://github.com/user-attachments/assets/86fcb51e-4ac8-4ddc-b83f-81de6d8b2fbc)

---

![image](https://github.com/user-attachments/assets/2c81d763-54b3-4322-a85e-a6a83f823869)

False를 빠트린 것이었다!

---

Tkinter 버튼 구현

![image](https://github.com/user-attachments/assets/2bd09268-6aee-4146-a135-df9b2ace4aec)

인자가 있는 함수에 lambda를 사용하지 않는 경우에는 버튼 생성과 동시에 함수가 실행되어 버린다.

![image](https://github.com/user-attachments/assets/a57ef74c-b6e9-4229-a66e-ddc561df1e30)

인자가 없는 함수에 lambda를 사용할 시에는 오류가 발생한다.

---

![image](https://github.com/user-attachments/assets/9a81e228-9d45-4a2c-9aef-dd47d2e11d2a)

Tkinter에는 하이퍼링크 기능이 없다고한다….

그래서 그냥 텍스트 박스에 출력을 했는데

지금이라도 PyQt5를 사용해야 하나..?