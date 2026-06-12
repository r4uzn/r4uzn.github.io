export const posts = [
    {
        "slug": "cve-2023-21768-1-day",
        "title": "CVE-2023-21768 1-day 분석",
        "date": "2026-06-11",
        "category": "Notes",
        "tags": [
            "Notes"
        ],
        "summary": "CVE 2023 21768 CVE 2023 21768은 Windows의 AFD, 즉 Ancillary Function Driver for WinSock에서 발생한 로컬 권한 상승 취약점이다. 중요한 부분은 AFD 내부의 NotifySock 관련 처리 경로에서 유저가 전...",
        "file": "2026-06-11-CVE-2023-21768 1-day 분석.md"
    },
    {
        "slug": "poc-ctf-2025-writeup",
        "title": "POC-CTF 2025 Writeup",
        "date": "2025-10-14",
        "category": "CTF",
        "tags": [
            "CTF"
        ],
        "summary": "포너블 문제가 총 3개 나왔는데 3번째 문제는 12시에 추가되어서 한 시간정도 보다가 못 풀었다.. fsop 이용하는 문제였던 거 같은데 한동안 안했더니 다시 공부해봐야 할 것 같다. PWN 1 PWN 2",
        "file": "2025-10-14-POC-CTF 2025 Writeup.md"
    },
    {
        "slug": "dreamhack-note",
        "title": "[Dreamhack] note",
        "date": "2025-08-01",
        "category": "Notes",
        "tags": [
            "Dreamhack"
        ],
        "summary": "PIE가 비활성화 되어있어서 GOT 주소가 고정되어있음 GOT overwrite 가능 구조체 1 : create idx (0 9) 노트 선택 size 0 0x70, calloc 청크 할당 data 해당 청크에 size만큼 입력 2 : read idx (0 9) 노트 선...",
        "file": "2025-08-01-[Dreamhack] note.md"
    },
    {
        "slug": "l3akctf-2025-writeup",
        "title": "l3akcTF 2025 Writeup",
        "date": "2025-07-15",
        "category": "CTF",
        "tags": [
            "CTF"
        ],
        "summary": "문제 설명 이 문제는 일단 처음 출력되는 ‘hook’이라는 문자가 랜덤한 개수로 출력되고, 이 개수가 몇개인지를 입력해야 다음으로 넘어갈 수 있다. 개수가 일치하면 ‘highscore()’라는 함수 안으로 이동되는데, 출력에서 ‘printf(s)’를 사용하고 있어 fo...",
        "file": "2025-07-15-l3akcTF 2025 Writeup.md"
    },
    {
        "slug": "srop",
        "title": "srop",
        "date": "2025-07-03",
        "category": "Pwn",
        "tags": [
            "Pwn",
            "System"
        ],
        "summary": "운영 체제는 User Mode와 Kernel Mode로 나뉜다. 실제로 파일을 생성하고, 프로그램을 실행하는 모든 작업은 이 두개의 모드가 서로 상호 작용하면서 이뤄진다. Signal : 프로세스에 특정 정보를 전달하는 매개체 운영체제는 자원관리를 위해 일반적으로는 유...",
        "file": "2025-07-03-srop.md"
    },
    {
        "slug": "greyctf-2025-writeup",
        "title": "greyCTF 2025 Writeup",
        "date": "2025-06-04",
        "category": "Pwn",
        "tags": [
            "CTF",
            "Write-up",
            "Pwn",
            "System"
        ],
        "summary": "해당 프로그램은 사용자의 입력을 받아 Connect 4 보드 게임을 시뮬레이션하는 콘솔 기반 프로그램이다. 플레이어는 8칸짜리 열(column)에 돌을 떨어뜨릴 수 있으며, 각 열은 최대 8개의 돌을 담을 수 있다. 이 제한을 초과하면 가장 아래의 돌이 제거되고 위의...",
        "file": "2025-06-04-greyCTF 2025 Writeup.md"
    },
    {
        "slug": "post-2",
        "title": "메모리 구조",
        "date": "2025-05-31",
        "category": "Pwn",
        "tags": [
            "Pwn",
            "System"
        ],
        "summary": "프로그램의 실행은 먼저 그 프로그램이 메인 메모리에 로드되는 과정으로 시작된다. 이후 운영체제는 코드, 데이터, 스택, 힙 등 역할에 따라 구분된 메모리 영역을 구성하고, 각 영역은 상호작용을 통해 전체 프로그램의 실행 흐름을 담당한다. 1. 코드 영역 (Code Se...",
        "file": "2025-05-31-메모리 구조.md"
    },
    {
        "slug": "byuctf-2025-writeup",
        "title": "BYUCTF 2025 Writeup",
        "date": "2025-05-21",
        "category": "Pwn",
        "tags": [
            "CTF",
            "Write-up",
            "Pwn",
            "System"
        ],
        "summary": "서버에 접속하면 먼저 register user()가 실행되며 username을 입력받는다. 그 후 메인 루프에서 print menu() 함수가 호출되어 선택 가능한 메뉴가 출력된다. 각 기능은 다음과 같다. 1. Register a new user → 새로운 유저를 등...",
        "file": "2025-05-21-BYUCTF 2025 Writeup.md"
    },
    {
        "slug": "dreamhack-p-rho",
        "title": "[Dreamhack] p_rho",
        "date": "2025-05-20",
        "category": "Notes",
        "tags": [
            "Dreamhack",
            "Wargame",
            "Write-up"
        ],
        "summary": "printf@GOT = 0x404008 buf 시작 주소 = 0x404080 buf = 0x404080 printf@GOT = 0x404008 차이: 0x404080 0x404008 = 0x78 = 120 bytes 배열 인덱싱은 타입 크기 단위로 계산됨 buf[0]의...",
        "file": "2025-05-20-[Dreamhack] p_rho.md"
    },
    {
        "slug": "dreamhack-oneshot",
        "title": "[Dreamhack] oneshot",
        "date": "2025-05-09",
        "category": "Notes",
        "tags": [
            "Dreamhack",
            "Wargame",
            "Write-up"
        ],
        "summary": "onesoht gadget이란 oneshot gadget은 해당 가젯의 주소로 점프하여 호출하는 것만으로 /bin/sh이 실행되는 가젯이다. 그저 ret 영역에 oneshot gadget의 주소를 덮어씌워줌으로써 exploit 된다. 프로그램을 실행하면 printf를...",
        "file": "2025-05-09-[Dreamhack] oneshot.md"
    },
    {
        "slug": "dreamhack-basic-exploitation-002",
        "title": "[Dreamhack] basic_exploitation_002",
        "date": "2025-05-02",
        "category": "Notes",
        "tags": [
            "Dreamhack",
            "Wargame",
            "Write-up"
        ],
        "summary": "Format String Bug (FSB) GOT overwrite(공격 방법) format string 이란? %d, %s, %x, %c 등 %n(4byte), %hn(2byte) : store the length of print (지금까지 입력된 문자열의 개수 출력...",
        "file": "2025-05-02-[Dreamhack] basic_exploitation_002.md"
    },
    {
        "slug": "dreamhack-return-to-library",
        "title": "[Dreamhack] Return to Library",
        "date": "2025-05-01",
        "category": "Pwn",
        "tags": [
            "Dreamhack",
            "Wargame",
            "Write-up",
            "Pwn"
        ],
        "summary": "@PLT ELF 바이너리에서 외부 바이너리 함수(system, puts, printf 등)은 실행파일 안에 실제 코드가 없고, glibc 같은 외부에서 제공된다. 근데 어디 있는지는 런타임에만 알 수 있어서 아래와 같이 동작한다. 1. PLT : 실행파일에 고정된 점프...",
        "file": "2025-05-01-[Dreamhack] Return to Library.md"
    },
    {
        "slug": "dreamhack-pwn-library",
        "title": "[Dreamhack] pwn-library",
        "date": "2025-04-30",
        "category": "Pwn",
        "tags": [
            "Dreamhack",
            "Wargame",
            "Write-up",
            "Pwn"
        ],
        "summary": "해당 프로그램은 책 빌리기, 읽기, 반납이 가능한 프로그램이다. borrow book() 책을 선택하게 되면 해당 책마다 할당된 크기(각각 0x100, 0x200, 0x300)만큼을 할당하고 memset을 통해 해당 메모리 공간을 0으로 초기화한 후, listbook[...",
        "file": "2025-04-30-[Dreamhack] pwn-library.md"
    },
    {
        "slug": "hacktheon2025-writeup",
        "title": "Hacktheon2025 예선전-Writeup",
        "date": "2025-04-27",
        "category": "CTF",
        "tags": [
            "CTF",
            "Write-up",
            "HackTheon"
        ],
        "summary": "Forgotten Past 주소에 접속 시 메인화면에 robots라는 글자가 보인다. robots.txt에 접속해보면 /old site/ 경로에 대해 Disallow 하고 있다. 해당 경로에 접속해 보았더니 CSS가 적용되지 않은 html 페이지가 노출되어 있었다. L...",
        "file": "2025-04-27-Hacktheon2025 예선전-Writeup.md"
    },
    {
        "slug": "chirpy",
        "title": "chirpy",
        "date": "2025-04-22",
        "category": "Blog",
        "tags": [
            "Blog"
        ],
        "summary": "Setup Ruby 오류 ubuntu latest로 되어있었는데 ubuntu 버전 24.04 업데이트로 인해 지정한 Ruby의 버전과 호환되지 않아서 발생하는 문제 jekyll.yml 파일에서 ubuntu 버전 지정하여 해결 이미지 삽입 오류 이미지 렌더링을 시킬 때...",
        "file": "2025-04-22-chirpy.md"
    },
    {
        "slug": "dreamhack-curling",
        "title": "[Dreamhack] curling",
        "date": "2025-03-23",
        "category": "Web Security",
        "tags": [
            "Dreamhack",
            "Wargame",
            "Write-up",
            "Web"
        ],
        "summary": "문제 페이지에 접속하면 404 NOT Found가 뜬다 /api/v1/test/curl 엔드포인트 분석 1. url 값이 dreamhack.io 또는 tools.dreamhack.io 로 시작하면 허용 2. url 이 /test/internal 로 끝나면 차단 3. c...",
        "file": "2025-03-23-[Dreamhack] curling.md"
    },
    {
        "slug": "post",
        "title": "리버싱 핵심원리",
        "date": "2024-11-18",
        "category": "Reversing",
        "tags": [
            "Reversing"
        ],
        "summary": "리버싱 핵심원리 공부하면서 궁금했던 책에는 없는 질문들 직접 찾아보고 생각해보며 적은거라 틀렸을 수도 있다. p. 168 Q. notepad.exe에서 kernel32.dll의 CreateFileW의 함수를 호출할 때 CALL 01001104이라고 한다면 PE로더는 이...",
        "file": "2024-11-18-리버싱 핵심원리.md"
    },
    {
        "slug": "snort",
        "title": "웹 스캐너 감지 SNORT 설정 트러블 슈팅",
        "date": "2024-06-30",
        "category": "Tooling",
        "tags": [
            "SNORT",
            "Tooling"
        ],
        "summary": "snort 실행 rules 설정하는 경로 기본 룰은 아래와 같이 작성했다. $HOME NET 가 의미하는 IP 찾기 sudo vi /etc/snort/snort.conf 에서 var HOME NET 에 적혀있는 IP 서버(라즈베리)에 모니터를 연결하고 snort를 킨...",
        "file": "2024-06-30-웹 스캐너 감지 SNORT 설정 트러블 슈팅.md"
    },
    {
        "slug": "dreamhack-xss-filtering-bypass-advanced",
        "title": "[Dreamhack] XSS Filtering Bypass Advanced",
        "date": "2024-06-10",
        "category": "Web Security",
        "tags": [
            "Dreamhack",
            "Wargame",
            "Write-up",
            "Web"
        ],
        "summary": "문제는 vuln(xss) page , memo , flag 페이지로 나눠져 있다. 페이지 확인하고 순서대로 해당되는 코드들을 살펴보자. /vuln 페이지이다. 스크립트가 가능하다는 것을 확인할 수 있다. xss filter 함수이다. 문제를 푸는 데 필요한 주요 단어들...",
        "file": "2024-06-10-[Dreamhack] XSS Filtering Bypass Advanced.md"
    },
    {
        "slug": "web-scanner-4",
        "title": "Web Scanner-4",
        "date": "2024-05-22",
        "category": "Tooling",
        "tags": [
            "Dev",
            "Tooling"
        ],
        "summary": "디렉터리 스캔 기능을 구현하면서 스캔 속도가 너무 느린 문제를 해결하기 위해 찾아 보던 중 비동기 방식에 대해 알게되었다. 절차적 언어인 파이썬은 작업이 순차적으로 실행되는 방식이다. 즉, 한 작업이 끝나야 다음 작업이 실행되고 이러한 동작 방식은 직관적이고 이해하기...",
        "file": "2024-05-22-Web Scanner-4.md"
    },
    {
        "slug": "web-scanner-3",
        "title": "Web Scanner-3",
        "date": "2024-05-20",
        "category": "Tooling",
        "tags": [
            "Dev",
            "Tooling"
        ],
        "summary": "directory word list를 찾아보던 중 owasp에서 제작한 dirbuster라는 툴을 발견했다. 해당 툴에서 사용되는 word list를 이용해야할 것 같다. 대소문자알파벳+숫자 조합의 big과 소문자알파벳+숫자 조합의 small 까지 있는데, 가장 많은...",
        "file": "2024-05-20-Web Scanner-3.md"
    },
    {
        "slug": "web-scanner-2",
        "title": "Web Scanner-2",
        "date": "2024-05-18",
        "category": "Tooling",
        "tags": [
            "Dev",
            "Tooling"
        ],
        "summary": "기존에는 Tkinter를 사용하여 GUI를 구현하고 있었는데, 좀 더 섬세하게 구현을 하려면 pyqt를 사용하는 것이 맞는 것 같아서 코드가 더 복잡해지기 전에 GUI를 다시 구현하였다. 결과물은 이런 느낌. 아직 허전한 것 같아 pyqt에 대해 좀 더 알아봐야 될 것...",
        "file": "2024-05-18-Web Scanner-2.md"
    },
    {
        "slug": "web-scanner-1",
        "title": "Web Scanner-1",
        "date": "2024-05-14",
        "category": "Tooling",
        "tags": [
            "Dev",
            "Tooling"
        ],
        "summary": "블로그 글 적는 걸 깜빡해서 중간부터 적어보는 개발 일지 1. webscan 기능 구현 해당 웹사이트의 http 통신 정보를 스캔하는 기능 requests 모듈을 통해 구현 했다. burp suite와 비교했을 때 뭔가 부족한 정보들이지만 그래도 일단은 킵,, 2. d...",
        "file": "2024-05-14-Web Scanner-1.md"
    },
    {
        "slug": "hacktheon2024-confidential",
        "title": "Hacktheon2024-Confidential",
        "date": "2024-04-29",
        "category": "CTF",
        "tags": [
            "CTF",
            "Write-up",
            "HackTheon"
        ],
        "summary": "pdf로 제공된 문제 파일을 열어보면 다음과 같은 내용을 볼 수 있다. 이 내용에는 flag와 관련해서 얻을 수 있는 게 없다. (아마도) HxD를 이용해서 열어보면 JavaScript로 된 코드가 숨겨져 있는 것을 확인할 수 있지만, 16진수로 난독화되어 있어 알아볼...",
        "file": "2024-04-29-Hacktheon2024-Confidential.md"
    },
    {
        "slug": "hacktheon2024-stegoart",
        "title": "Hacktheon2024-stegoART",
        "date": "2024-04-29",
        "category": "CTF",
        "tags": [
            "CTF",
            "Write-up",
            "HackTheon"
        ],
        "summary": "문제를 보고 가장 먼저 HxD로 열어보았다. 푸터 시그니처 뒤에 (X, Y) (2, 5)라는 임의의 데이터가 있는 것을 발견하였다. openstego를 이용해야하나 싶었지만 비밀번호에 관한 정보도 없기 때문에 시도할 수 없었다. bit단위로 이미지에 변화를 주는 사이트...",
        "file": "2024-04-29-Hacktheon2024-stegoART.md"
    }
];
export const categories = [
    "Notes",
    "CTF",
    "Pwn",
    "Blog",
    "Web Security",
    "Reversing",
    "Tooling"
];
