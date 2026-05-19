export type TimelineItem = {
  period: string;
  title: string;
  body: string;
  tags: string[];
};

export type HomeItem = {
  label: string;
  title: string;
  body?: string;
  meta: string;
  tags?: string[];
  details?: string[];
};

export const profile = {
  name: 'rauzn',
  mainName: 'Sungmin Kang | rauzn',
  role: 'Security Researcher',
  headline: 'Research Team : Jeroscope | CTF Team : Fermion',
  intro: '',
  focus: ['Pwnable', 'Reversing', 'Web', 'Kernel', 'Fuzzing'],
  links: [
    { label: 'GitHub', href: 'https://github.com/r4uzn' },
    { label: 'Email', href: 'mailto:726ksm@gmail.com' },
    { label: 'Instagram', href: 'https://instagram.com/uznra' }
  ]
};

export const timeline: TimelineItem[] = [
  {
    period: '2026',
    title: 'Hacktheon CTF 2026 Qualifier 7th (Advanced to Finals)',
    body: 'Hacktheon CTF 2026 예선에서 7위를 기록했습니다.',
    tags: ['CTF', 'Hacktheon']
  },
  {
    period: '2025',
    title: 'WHS CTF 2025 3rd',
    body: '화이트햇스쿨 3기 CTF에서 3위 장려상을 수상했습니다.',
    tags: ['CTF', 'WHS']
  },
  {
    period: '2025',
    title: 'Cyber Security Paper Competition',
    body: '2025 사이버안보학회 논문경진대회 장려상을 수상했습니다.',
    tags: ['Research', 'Paper']
  },
  {
    period: '2024',
    title: 'Security Competitions',
    body: '대전대학교 화이트해커 경진대회, IN-JEJU Challenge 등에서 수상했습니다.',
    tags: ['CTF', 'Award']
  },
  {
    period: '2018',
    title: 'Information Security Gifted Education',
    body: '공주대학교 정보보호영재교육원 고등부 기초심화B 최우수상을 수상했습니다.',
    tags: ['Award', 'Education']
  }
];

export const homeItems: HomeItem[] = [
  {
    label: 'Project',
    title: 'UnrealEngine Fuzzing',
    meta: 'AFL++ / LibFuzzer',
    tags: ['AFL++', 'LibFuzzer']
  },
  {
    label: 'Project',
    title: 'GodotEngine Fuzzing',
    body: 'Windbg, AFL++, WinAFL을 활용한 Godot Engine fuzzing project.',
    meta: 'Windbg / AFL++ / WinAFL',
    tags: ['Windbg', 'AFL++', 'WinAFL']
  },
  {
    label: 'Project',
    title: 'IoT Firmware, App Vulnerability Analysis',
    meta: 'Firmware / App',
    tags: ['Firmware', 'App']
  },
  {
    label: 'Project',
    title: 'Risky Behavior Detection CCTV',
    meta: 'Computer Vision / CCTV',
    tags: ['Computer Vision', 'Detection', 'CCTV']
  },
  {
    label: 'CTF',
    title: 'CTF',
    meta: 'Competition Records',
    details: ['Hacktheon CTF 2026 Qualifier 7th (Advanced to Finals)', 'WHS CTF 2025 3rd']
  },
  {
    label: 'Awards',
    title: 'Awards',
    meta: '2018 - 2025',
    details: [
      '2018. Kongju National University Information Security Gifted Education Center, Advanced High School B, Grand Prize',
      '2024. 11. Daejeon University 2nd White Hacker Competition (CTF), Grand Prize',
      '2024. 12. IoT Innovation Convergence University 2024 IN-JEJU Challenge, Excellence Award',
      '2025. 9. WhiteHat School 3rd CTF, 3rd Place Encouragement Award',
      '2025. 10. Daejeon University 3rd White Hacker Competition (CTF), Excellence Award',
      '2025. 11. 2025 Cybersecurity Society Paper Competition, Encouragement Award'
    ]
  }
];
