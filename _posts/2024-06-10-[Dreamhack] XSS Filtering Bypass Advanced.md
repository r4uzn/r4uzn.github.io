![image](https://github.com/user-attachments/assets/a48b8e23-7f2b-46c9-b172-136736e70b3f)

문제는 vuln(xss) page , memo , flag 페이지로 나눠져 있다.

페이지 확인하고 순서대로 해당되는 코드들을 살펴보자.

![image](https://github.com/user-attachments/assets/fe5046fe-2f61-4816-8a82-c1e381d801c2)

/vuln 페이지이다. <img src> 스크립트가 가능하다는 것을 확인할 수 있다.

![image](https://github.com/user-attachments/assets/671b202b-622e-4953-835d-7fa306430981)

xss_filter 함수이다. 문제를 푸는 데 필요한 주요 단어들을 필터링하고 있다. 해당 단어가 포함되면 "filtered"를 return 한다.

![image](https://github.com/user-attachments/assets/1d7e61cb-2728-4b45-af91-2b1bec2af738)

xss_filter 함수를 통해 파라미터를 필터링하고 return 한다.

![image](https://github.com/user-attachments/assets/aca4a2ee-2682-434d-8947-5d22b28440d3)

/memo 페이지이다.

![image](https://github.com/user-attachments/assets/0f7a0007-586b-4832-93f8-f79f6a7c0b40)

request.args.get을 통해 memo 파라미터를 얻어 render_template으로 출력한다.

![image](https://github.com/user-attachments/assets/4c8633fd-cdf7-493c-a6bd-2a2581f70c7e)

/flag 페이지이다. 

![image](https://github.com/user-attachments/assets/02e8dc13-868b-41dc-bf03-f5b6ddb6e3a6)

GET 요청이 올 때는 flag.html 가 띄워진다.

POST 요청이 올 때는 파라미터 값을 가져와서 변수 param 에 저장하고,

check_xss 함수에 name이 flag이고, value가 FLAG.strip()인 값을 전달한다. 

![image](https://github.com/user-attachments/assets/0adf3ab3-8bac-4d06-b595-640631cba930)

check_xss 함수이다.

전달 받은 param값을 urllib.parse.quote() 함수를 통해 인코딩 한 뒤 url 변수에 넣고 read_url로 전달한다.

![image](https://github.com/user-attachments/assets/62f5d5be-4106-4e04-9ebb-9bcf97a3ee37)

read_url 함수이다.

driver.get("http://127.0.0.1:8000/")을 호출해 로컬 서버에 접속한 후,

driver.add_cookie(cookie)을 통해 설정된 쿠키를 추가하고, 

driver.get(url)을 호출해 전달된 URL에 접속한다.

flag 값을 얻기 위해 해야하는 것은, xss_filter를 우회하는 것이다.

코드 해석대로면, /flag 페이지에서 쿠키 값(flag)을 셋팅한 후 /vuln 페이지에 접속하기 때문에

/vuln 페이지에서 /memo를 접속하게한 후 쿠키 값(flag)을 memo 파라미터로 넘기면 /memo 페이지에 flag가 보일 것이다.

먼저, 우회하기 전에 만약 필터링 함수가 없었다면 어떤 값을 입력해야 하는지 생각해보자.

<script>location.href="/memo?memo="+document.cookie</script> 정도로 작성해볼 수 있겠다.

시도해보자.

![image](https://github.com/user-attachments/assets/d0580ac0-8bac-479b-8220-b0012db66268)

당연히 안된다.

%09(tab)을 이용해 우회해보자. 값이 출력되는지 확인하기 위해 alert 를 사용했다.

![image](https://github.com/user-attachments/assets/23cd28b1-e648-4bde-baee-c7004be470ae)

아. "("와 ")" 도 필터링된다는 걸 깜빡했다.

![image](https://github.com/user-attachments/assets/1f2e301a-830e-48b5-80ed-42634c18e1fd)

우회는 된 거 같은데, 실행여부를 확인할 수 없다. 

<script>가 아닌 다른 방법을 사용해야할 것 같다.

<iframe>을 사용해보자.

%09를 이용해서 <iframe src = javascript : alert(1)>을 전달해보자.

![image](https://github.com/user-attachments/assets/af1711d7-7c6c-41b8-b220-8b2c216a08aa)

성공했다! alert(1)이 아닌 alert`1'를 사용했다.

이제 이걸 이용해서 /flag에 입력해보자.

<iframe src = "javasc\tript:locatio\tn.href='/memo?memo='+docu\tment.cookie">

post 방식이기 때문에 \t부분은 실제로 탭을 해서 입력한다.

![image](https://github.com/user-attachments/assets/97b32d78-2849-4c99-b4b9-30e26f87322a)

![image](https://github.com/user-attachments/assets/246b8ab1-b22b-4deb-b0e5-3a34517ba156)

flag가 나왔다!

