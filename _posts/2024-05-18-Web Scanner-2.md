기존에는 Tkinter를 사용하여 GUI를 구현하고 있었는데,

좀 더 섬세하게 구현을 하려면 pyqt를 사용하는 것이 맞는 것 같아서 

코드가 더 복잡해지기 전에 GUI를 다시 구현하였다.

---

![image](https://github.com/user-attachments/assets/262ffff8-81ac-4211-85b8-9fcbbd780adb)

결과물은 이런 느낌.

아직 허전한 것 같아 pyqt에 대해 좀 더 알아봐야 될 것 같다 !

directory scan 함수 테스트를 위해 /blo 뒤의 한 글자만 브루트 포스 하는 것으로 구현했었는데,

테스트는 완료했으나 무작정 대입하는 것 보다 list를 만들어서 스캔을 하는 것이 효율적이라고 생각해서

![image](https://github.com/user-attachments/assets/d05f7dca-ac25-40be-8f98-c308523543f3)

gpt의 추천 list에 몇 개 추가하여 작성한 list..

dir wordlist로 구글링을 해보니 github 자료들이 나오기는 하는데 

제 생각에는 필요없는 키워드들이 너무 많아서 실행 시간이 길어질 것 같아 

조금 고민을 해봐야 될 것 같다.

list가 너무 많으면 txt 파일을 읽어들이도록 구현해야할 것 같다.

몇몇 웹사이트 대상으로 dir scan 테스트를 해보았는데, 다른 사이트는 다 잘 되는데

![image](https://github.com/user-attachments/assets/6c3109a7-4b9c-40d2-93c5-97bb278e620b)

nate는 왜 없는 디렉터리도 있다고 뜨는지 모르겠다.

있다고 감지된 디렉터리와 없다고 감지된 디렉터리 둘 다 같은 페이지가 뜨는데,,