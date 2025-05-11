---
tags: [ctf, write-up]
---

pdf로 제공된 문제 파일을 열어보면 다음과 같은 내용을 볼 수 있다.

![image](https://github.com/user-attachments/assets/1e5afea8-6052-4a65-9051-29ff4144640c)

이 내용에는 flag와 관련해서 얻을 수 있는 게 없다. (아마도)

HxD를 이용해서 열어보면
![image](https://github.com/user-attachments/assets/c1601c9b-27c7-4660-a138-ba88e0364e34)


JavaScript로 된 코드가 숨겨져 있는 것을 확인할 수 있지만,

16진수로 난독화되어 있어 알아볼 수 없다.

16진수 -> 문자열 변환 후 확인해보면

![image](https://github.com/user-attachments/assets/c0f9ee4c-aa2c-4aa9-babd-df1ac01bd0c5)
![image](https://github.com/user-attachments/assets/18c18d89-63f5-46fe-9a7e-d3a3e68b2bd3)
 base64로 인코딩되어 있는 데이터를 확인할 수 있다.

인코딩된 부분을 txt파일로 생성한 후
![image](https://github.com/user-attachments/assets/2ce73b79-a9c2-43d9-b9f3-8140a8747594)

https://www.base64decode.org/ko 에 넣어주면,
![image](https://github.com/user-attachments/assets/a57b2af3-c488-4ebf-92a0-d024333edbc2)
![image](https://github.com/user-attachments/assets/8f8c9c88-08e0-4de7-b0ba-a5cf70a34bc8)

디코딩된 파일을 얻게 된다.
![image](https://github.com/user-attachments/assets/8c9143c8-17fe-488b-8371-2f0a7cf52ce2)
열어보면 flag가 있다.