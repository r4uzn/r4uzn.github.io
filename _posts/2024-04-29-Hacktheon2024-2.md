문제를 보고 가장 먼저 HxD로 열어보았다.

![image](https://github.com/user-attachments/assets/5f93ce13-a4bc-4734-9626-dacd065dd07c)

푸터 시그니처 뒤에 (X, Y) (2, 5)라는 임의의 데이터가 있는 것을 발견하였다.

openstego를 이용해야하나 싶었지만 비밀번호에 관한 정보도 없기 때문에 시도할 수 없었다.

bit단위로 이미지에 변화를 주는 사이트도 이용해 보았지만

![image](https://github.com/user-attachments/assets/c9149429-bc6b-4daa-8efb-509c02b59972)

의미 있는 결과를 얻지 못했다.

그러던 중 LSB / MSB Stegano 라는 데이터 은닉 기법에 대해 알게되었는데,

LSB / MSB 를 1~2 bit 만큼 변경하여도 사람들이 인식하는 색상의 차이는 거의 없기 때문에

값을 변경하여 데이터를 은닉할 수 있는 것이다.

우분투에서 zsteg라는 스테가노그래피 도구를 사용해서 이미지 분석을 시도해 보았다.

#link : https://github.com/zed-0xff/zsteg

![image](https://github.com/user-attachments/assets/cb88aa56-c9c2-465d-a945-0b8c44f73393)

zsteg -a (파일) 

명령어를 입력하면 lsb, msb 값을 여러 방법으로 시도하며 의심 되는 데이터를 보여준다.

![image](https://github.com/user-attachments/assets/05ed374e-9366-420b-b6b4-0ce83325d9e4)

아까 HxD로 발견했던 (X,Y) (2,5)도 나오고,

그 밑에 좌표로된 데이터들이 나오는 것을 확인할 수 있었다.

파이썬 코드를 작성해 해당 좌표의 값들로 이미지 파일을 생성해 보았다.

![image](https://github.com/user-attachments/assets/3aec7e6b-b516-45f9-8f34-2df5448fddcc)

확대 해보면,

![image](https://github.com/user-attachments/assets/d9b69dc7-6922-45a9-93e0-6d2d116c9b22)

이런 그림인데, 좌표에 대한 정보가 턱 없이 부족한 것을 알 수 있었다.

다시 zsteg 결과로 가서,

![image](https://github.com/user-attachments/assets/d7d4f680-b42c-4b73-b50d-58db27c51d09)

해당 데이터가 추출된 것은 b1, g, lsb, xy 라는 정보를 알 수 있다.

b1은 첫번째 비트를 의미하고, g는 rgb에서 green, lsb는 최하위 비트를 의미한다.

xy는 데이터가 발견된 좌표를 의미하는 것이고 이 문제를 풀기 위해선 이 좌표를 알아내야 한다.

stegosolve라는 툴은 직접 이미지 파일을 원하는 형태로 조작하여 값을 얻어낼 수 있다.

#link : http://www.caesum.com/handbook/Stegsolve.jar

(stegosolve는 jar파일이기 때문에 java가 설치되어있어야 한다.)

stegosolve에 present.png 파일을 넣고 Extract Preview를 누른 후

![image](https://github.com/user-attachments/assets/3ecc32aa-b629-4763-a3c9-d60833ad30e9)

Green의 최하위 비트인 0을 체크한 후 Preview를 눌렀다.

![image](https://github.com/user-attachments/assets/a7901d77-5c66-422f-9cc1-451098a5f382)

좌표값들이 나온 것을 확인했고, Save Bin을 눌러서 저장해준다.

![image](https://github.com/user-attachments/assets/70296b78-ccb5-4274-b76b-23cd5396d5a4)

좌표가 굉장히 많기 때문에 

파이썬으로 파일을 읽은 후 좌표 값에 따른 이미지를 생성하는 코드를 작성해준다.

![image](https://github.com/user-attachments/assets/a3963497-243f-4338-8f68-81135fcc4326)

코드 구현은 이런식으로 했다.

![image](https://github.com/user-attachments/assets/a3f81420-5fdd-4698-b046-411e23ec06f2)

코드가 실행되다가 종료되면, 바탕화면에 만들어진 이미지 파일을 열어준다.

![image](https://github.com/user-attachments/assets/52029bf2-7c92-4abf-b15a-1ef4508a40c8)

생성된 글자를 반전시키면 FLAG값인 I_LOVE_XY 가 나온다.