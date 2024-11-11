directory word list를 찾아보던 중 owasp에서 제작한 dirbuster라는 툴을 발견했다.

해당 툴에서 사용되는 word list를 이용해야할 것 같다. 

대소문자알파벳+숫자 조합의 big과 소문자알파벳+숫자 조합의 small 까지 있는데,

![image](https://github.com/user-attachments/assets/91476285-6fea-4b2e-8931-99a00252064b)

가장 많은 wordlist파일은 무려 14,802,867자나 있다 ㄷㄷ

나는 일단 기능 구현이 목적이니까

![image](https://github.com/user-attachments/assets/212a297a-a181-40c6-8e07-2d5519720e97)

가장 작은 small을 선택하였다.

![image](https://github.com/user-attachments/assets/69f1e436-91e0-4ede-a3b4-66a31c168c36)

알파벳과 숫자가 뒤죽박죽 되어있는데, 

알파벳 먼저 탐색한 후에 숫자를 탐색하는 게 더 효율적일 것 같기도 하고,

옵션으로 선택할 수 있도록 구현하고 싶어서 간단한 파이썬 코드로 분리하였다.

![image](https://github.com/user-attachments/assets/1cfbdc5b-a800-44ef-9a16-57c720c5848d)

![image](https://github.com/user-attachments/assets/838f51e2-c4f9-48be-8725-df2400f89bca)

그리고 문자열 탐색을 체크박스를 통해 선택할 수 있도록 옵션으로 넣었다.

<현재 모습>

![image](https://github.com/user-attachments/assets/165ee811-cae3-4314-affd-79631a40e95a)

문제가 있는데, 디렉터리 스캔이 지금 

하나 탐색하고, 출력하고, 하나 탐색하고, 출력하는 방식이어서 너무 느리다. 

그래서 찾아보니 비동기 프로그래밍이라는 방법이 있다고 한다.

비동기 프로그래밍 구현에 대해서는 다음 글에서 포스팅해야겠다.