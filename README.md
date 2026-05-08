# rauzn Security Blog

Chirpy/Jekyll 없이 TypeScript로 만든 GitHub Pages용 정적 블로그입니다.

## Scripts

- `npm run build`: `dist/` 정적 결과물을 생성합니다.
- `npm run preview`: `dist/`를 로컬 서버로 확인합니다.
- `npm run dev`: 빌드 후 프리뷰 서버를 실행합니다.
- `npm run sync:posts`: `r4uzn/r4uzn.github.io`의 `_posts`를 동기화합니다.

글 원본은 `_posts/*.md`에 두고, 빌드 시 글 목록을 자동 생성한 뒤 `dist/posts/`로 복사합니다.
