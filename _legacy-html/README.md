# EWHA PICK | Tech Blog

> 이화픽을 만들어가는 과정, 개발 경험과 기술적 고민을 기록합니다.

**이화픽(EWHA PICK)** 은 이화인을 위한 마감 할인 상품 사전 결제 및 픽업 마켓입니다.
이 저장소는 **팀246** 이 2026 오픈소스프로그래밍 수업 과제로 만드는 기술 블로그이며, GitHub Pages로 배포합니다.

- HTML, CSS, JavaScript만 사용하는 정적 웹사이트입니다. 백엔드와 빌드 과정이 없습니다.
- 모든 파일 참조와 페이지 이동은 상대 경로를 사용합니다. 그래서 로컬과 GitHub Pages 어디서든 그대로 동작합니다.

## 과제 요구사항과 게시글 구성

| # | 카테고리 | 파일 | 내용 |
|---|---|---|---|
| 01 | Concept | `posts/concept.html` | 프로젝트에 사용한 핵심 개념·기술 소개 |
| 02 | Tip or Debugging | `posts/debugging.html` | 실제로 겪은 문제와 해결 과정, 또는 개발 팁 |
| 03 | Guide | `posts/guide.html` | 따라 할 수 있는 단계별 안내 |
| 04 | Explanation | `posts/explanation-1.html` | 가장 대표적인 페이지 또는 기능 설명 ① |
| 05 | Explanation | `posts/explanation-2.html` | 가장 대표적인 페이지 또는 기능 설명 ② |

- 게시글마다 본문을 **300단어 이상**, 한국어 또는 영어로 작성합니다.
- 글의 구성은 Lecture 11 슬라이드의 **"Common Structure"** 를 따릅니다. 게시글 템플릿의 소제목이 이 순서로 들어 있습니다.
  `배경(Context) → 문제/목표(Problem or goal) → 단계(Steps, 코드와 함께) → 결과(Result, 스크린샷) → 배운 점(What I learned) → 참고 자료(References)`
- **"What Makes a Good Post?"** 기준: 처음부터 끝까지 따라 할 수 있는 완결성, **5~7분 안에 읽을 수 있는 길이**, 제목만 봐도 알 수 있는 단일 주제, 코드 블록마다 설명 붙이기.
  게시글 제목 아래에 예상 읽기 시간(한국어 약 500자/분, 영어 약 200단어/분 기준)이 자동으로 표시되니 분량을 맞출 때 참고하세요.
- 실제로 구현한 기능과 사용한 기술만 작성합니다.

## 파일 구조

```
2026_osp_246_blog/            ← 저장소 루트 = 사이트 루트
├── index.html                메인 페이지 (블로그 소개, 게시글 5개 목록)
├── css/
│   ├── style.css             공통 스타일 (색상 변수, 헤더, 푸터, 메인 목록, 반응형)
│   └── post.css              게시글 상세 페이지 공통 스타일 (본문, 목차, 코드, 표, 인용문)
├── js/
│   └── main.js               목차 자동 생성, 현재 위치 강조, 코드 복사 버튼, 카테고리 탭, 예상 읽기 시간, 연도 표시
├── posts/
│   ├── concept.html          [01] Concept
│   ├── debugging.html        [02] Tip or Debugging
│   ├── guide.html            [03] Guide
│   ├── explanation-1.html    [04] Explanation 1
│   └── explanation-2.html    [05] Explanation 2
├── assets/
│   └── images/
│       ├── favicon.svg       로고 마크 / 파비콘
│       ├── placeholder.svg   본문 임시 이미지 (실제 이미지로 교체)
│       ├── thumbnail.svg     메인 목록 임시 썸네일 (실제 이미지로 교체)
│       ├── concept/          게시글별 이미지 폴더
│       ├── debugging/
│       ├── guide/
│       ├── explanation-1/
│       └── explanation-2/
├── .nojekyll                 GitHub Pages가 Jekyll 처리 없이 파일을 그대로 배포하게 함
└── README.md
```

외부 리소스는 CDN으로 불러옵니다. 설치할 것은 없습니다.

- 글꼴: IBM Plex Sans KR (Google Fonts). 불러오지 못하면 시스템 글꼴로 표시됩니다.
- 코드 문법 강조: Prism.js 1.29.0 (cdnjs). 기본 지원 언어는 HTML, CSS, JavaScript이고 Bash, JSON 컴포넌트를 추가로 불러옵니다.

## 로컬 실행 방법

**방법 1. 파일 직접 열기**
`index.html` 을 더블클릭해 브라우저에서 엽니다. 별도 서버가 필요하지 않습니다.

**방법 2. 로컬 서버 (권장, GitHub Pages와 같은 환경)**

```bash
git clone https://github.com/chanmi1125/2026_osp_246_blog.git
cd 2026_osp_246_blog
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

VS Code를 사용한다면 **Live Server** 확장으로 `index.html` 을 열어도 됩니다.

## 팀원별 게시글 수정 방법

각 팀원은 **자기 게시글 파일 하나**와 **`index.html` 안의 자기 항목**만 수정합니다.
공통 디자인 파일(`css/`, `js/`)은 수정하지 않습니다. 수정이 필요하면 팀과 먼저 상의해 주세요.

### 1. 게시글 파일 (`posts/담당파일.html`)

파일 상단 주석에 수정할 곳이 적혀 있습니다.

1. `<title>` 과 `<meta name="description">` 에 제목과 요약을 넣습니다.
2. `post-header` 영역에서 **제목(`<h1>`), 요약(`.post-lede`), 작성자, 작성일** 을 수정합니다.
   작성일은 `<time datetime="2026-12-01">2026.12.01</time>` 처럼 `datetime` 속성도 함께 넣어 주세요.
3. `<!-- 본문 시작 -->` 과 `<!-- 본문 끝 -->` 사이에 본문을 작성합니다.
   - 대제목은 `<h2>`, 소제목은 `<h3>` 을 씁니다. **목차는 이 제목들로 자동 생성되므로** 따로 만들 필요가 없습니다.
   - 문단 `<p>`, 목록 `<ul>/<ol>`, 강조 `<strong>`, 인라인 코드 `<code>` 를 사용할 수 있습니다.
4. 글 작성을 마치면 점선 테두리의 **작성 가이드 블록(`<div class="writing-guide">`)을 삭제**합니다.
5. 영어로 작성한다면 `<html lang="ko">` 를 `<html lang="en">` 으로 바꿉니다.

헤더, 푸터, 목차, 이전/다음 글 영역은 모든 게시글의 공통 구조이므로 수정하지 않습니다.

### 2. 메인 페이지 목록 (`index.html`)

`index.html` 의 `<ol class="post-list">` 안에 게시글별 블록이 주석으로 구분되어 있습니다.

```html
<!-- ===== [01] Concept — posts/concept.html 담당자만 수정 ===== -->
<li data-category="concept">
  <a class="post-item" href="posts/concept.html">
    <div>
      <span class="post-category">Concept</span>
      <h2 class="post-title">게시글 제목</h2>
      <p class="post-summary">한두 문장 요약</p>
      <p class="post-meta"><span>작성자 이름</span><span><time datetime="2026-12-01">2026.12.01</time></span></p>
    </div>
    <div class="post-thumb">
      <img src="assets/images/concept/thumbnail.png" alt="" width="480" height="360" loading="lazy">
    </div>
  </a>
</li>
```

자기 번호의 블록에서 **제목, 요약, 작성자, 작성일** 을 게시글 파일과 똑같이 맞추고, 썸네일 이미지(가로:세로 4:3 권장)를 `assets/images/담당폴더/` 에 넣어 `src` 를 바꿉니다.
`data-category` 값은 카테고리 탭 필터에 쓰이므로 바꾸지 마세요.
다른 팀원의 블록은 건드리지 않습니다. 그러면 같은 파일을 여러 명이 수정해도 Git 충돌이 거의 생기지 않습니다.

### 3. 작업 흐름 (권장)

```bash
git pull origin main                 # 최신 상태로 맞추기
git checkout -b post/concept         # 담당 글 이름으로 브랜치 만들기
# ... posts/concept.html, index.html 의 [01] 항목, assets/images/concept/ 수정 ...
git add posts/concept.html index.html assets/images/concept
git commit -m "Write concept post"
git push origin post/concept         # Pull Request를 만들어 main에 병합
```

## 이미지 삽입 방법

1. 이미지를 **자기 게시글 폴더**에 넣습니다. 예: `assets/images/concept/architecture.png`
2. 게시글에서 `../` 로 시작하는 상대 경로로 불러옵니다. 게시글 파일이 `posts/` 폴더 안에 있기 때문입니다.

```html
<figure>
  <img src="../assets/images/concept/architecture.png"
       alt="이미지 내용을 설명하는 대체 텍스트" loading="lazy">
  <figcaption>그림 1. 이화픽 서비스 구조</figcaption>
</figure>
```

- 파일명은 **영문 소문자, 숫자, 하이픈(-)** 만 사용하세요. GitHub Pages는 대소문자를 구분하므로 `Image.PNG` 와 `image.png` 는 다른 파일입니다.
- 이미지 폭은 본문 너비에 자동으로 맞춰집니다. 너무 큰 이미지는 폭 1600px 이하로 줄여서 올려 주세요.
- 템플릿의 `placeholder.svg` 는 임시 이미지입니다. 실제 이미지로 바꾸거나 `<figure>` 를 삭제하세요.

## 코드 블록 삽입 방법

`<pre><code class="language-언어">` 형식으로 작성하면 문법 강조, 언어 이름, 복사 버튼이 자동으로 붙습니다.

```html
<pre data-filename="app.js"><code class="language-javascript">const name = "EWHA PICK";
console.log(name);</code></pre>
```

| 언어 | class |
|---|---|
| JavaScript | `language-javascript` |
| HTML | `language-html` |
| CSS | `language-css` |
| Bash / 터미널 | `language-bash` |
| JSON | `language-json` |

- `data-filename` 은 선택 사항입니다. 넣으면 코드 블록 위에 파일명이 표시되고, 없으면 언어 이름이 표시됩니다.
- `<pre>` 안은 **들여쓰기와 줄바꿈이 그대로 표시**됩니다. 코드는 `<pre>` 안에서 왼쪽 끝부터 붙여 넣으세요.
- 코드 안의 `<`, `>`, `&` 는 각각 `&lt;`, `&gt;`, `&amp;` 로 바꿔 써야 합니다. HTML 코드를 보여 줄 때 특히 주의하세요.
- 위 표에 없는 언어(예: Python)는 해당 게시글 하단의 Prism 스크립트 아래에
  `<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>`
  처럼 컴포넌트를 추가하면 됩니다. 이 변경은 해당 게시글에만 적용됩니다.

표와 인용문은 각 게시글 템플릿의 예시(`<div class="table-wrap"><table>…`, `<blockquote>…`)를 복사해 사용하세요.

## GitHub Pages 배포 방법

빌드 과정이 없으므로 저장소의 파일이 그대로 사이트가 됩니다.
([Quickstart for GitHub Pages](https://docs.github.com/en/pages/quickstart) 참고)

1. 변경 사항을 `main` 브랜치에 push 합니다.
2. GitHub 저장소에서 **Settings → Pages** 로 이동합니다.
3. **Build and deployment → Source** 를 **Deploy from a branch** 로 선택합니다.
4. **Branch** 를 `main`, 폴더를 `/ (root)` 로 선택하고 **Save** 를 누릅니다.
5. 1~2분 뒤 페이지 상단에 표시되는 주소로 접속합니다.
   예: `https://chanmi1125.github.io/2026_osp_246_blog/`

이후에는 `main` 에 push 할 때마다 자동으로 다시 배포됩니다. 배포 진행 상황은 저장소의 **Actions** 탭에서 확인할 수 있습니다.

> 사이트가 `https://아이디.github.io/저장소명/` 같은 하위 경로에 배포되므로, 링크를 `/css/style.css` 처럼 `/` 로 시작하는 절대 경로로 쓰면 깨집니다. 항상 `css/style.css`, `../index.html` 같은 상대 경로를 사용하세요.

## 디자인 규칙

| 이름 | 값 | 용도 |
|---|---|---|
| Warm Ivory | `#F6F3EA` | 배경 |
| Deep Green | `#123D2B` | 제목, 강조, 코드 블록 배경 |
| Gray Green | `#65736D` | 보조 텍스트, 메타 정보 |

색상과 글꼴은 `css/style.css` 의 `:root` 변수에서 한 번에 관리합니다.
그라데이션, 그림자, 둥근 모서리는 사용하지 않고, 선(border)과 여백으로 영역을 구분합니다.

---

© Team 246 · EWHA PICK
