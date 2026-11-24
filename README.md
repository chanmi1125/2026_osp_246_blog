# EWHA PICK | Tech Blog

> 이화픽을 만들어가는 과정, 개발 경험과 기술적 고민을 기록합니다.

**이화픽(EWHA PICK)** 은 이화인을 위한 마감 할인 상품 사전 결제 및 픽업 마켓입니다.
이 저장소는 **팀246** 이 2026 오픈소스프로그래밍 수업 과제로 만드는 기술 블로그입니다.

- **Jekyll** + **[Not Pure Poole](https://github.com/vszhub/not-pure-poole)** 테마(`remote_theme`)로 만들고 **GitHub Pages** 로 배포합니다.
- 게시글은 **마크다운(.md)** 으로 씁니다. push하면 GitHub가 자동으로 빌드하고 배포합니다.
- 배포 주소: `https://chanmi1125.github.io/2026_osp_246_blog/`

## 과제 요구사항과 게시글

| # | 카테고리 | 파일 | 작성자 |
|---|---|---|---|
| 01 | Concept | `_posts/2026-11-24-concept.md` | 담당 팀원 |
| 02 | Tip 또는 Debugging | `_posts/2026-11-24-debugging.md` | 담당 팀원 |
| 03 | Guide | `_posts/2026-11-24-guide.md` | 담당 팀원 |
| 04 | Explanation | `_posts/2026-11-24-explanation-1.md` | 담당 팀원 |
| 05 | Explanation | `_posts/2026-11-24-explanation-2.md` | 담당 팀원 |

- 게시글마다 **300단어 이상**, 한국어 또는 영어로 씁니다.
- 글의 구성은 Lecture 11 **"Common Structure"** 를 따릅니다. 템플릿에 소제목이 이 순서로 들어 있습니다.
  `배경(Context) → 문제/목표(Problem or goal) → 단계(Steps) → 결과(Result) → 배운 점(What I learned) → 참고 자료(References)`
- **"What Makes a Good Post?"**: 처음부터 끝까지 따라 할 수 있을 것, **5~7분 안에 읽히는 길이**, 단일 주제, 코드마다 설명.
  글 제목 아래에 "N분 소요"가 자동으로 표시됩니다.
- 실제로 구현한 기능과 사용한 기술만 씁니다.

## 파일 구조

```
2026_osp_246_blog/
├── _config.yml          사이트 설정 (제목, 테마, 주소, 팀 소개, 게시글 기본값)
├── _posts/              ★ 게시글 (마크다운) — 각자 자기 파일만 수정
├── _data/               왼쪽 메뉴(navigation) · 아이콘 링크(social) · 상단 메뉴(archive)
├── _layouts/            테마 레이아웃 중 한국어화한 것 (메인 목록, 게시글)
├── _includes/           custom-head.html(글꼴 Pretendard·파비콘·CSS), sidebar-right.html(목차)
├── category/           상단 분야 메뉴 페이지 (Concept · Tip/Debugging · Guide · Explanation)
├── assets/
│   ├── custom.css       브랜드 색상 · 글꼴 (테마 기본값 덮어쓰기)
│   └── images/<게시글>/  ★ 게시글별 이미지 폴더
├── index.html           메인 페이지 (최근 글 목록, 테마가 자동 생성)
├── Gemfile              로컬 미리보기용 Ruby 패키지 목록
└── _legacy-html/        이전에 만든 순수 HTML 버전 (배포되지 않음, 필요 없으면 삭제)
```

## 게시글 쓰는 법

### 1. 파일 이름

`_posts/YYYY-MM-DD-영문-제목.md` 형식이어야 합니다. 날짜를 실제 작성일로 바꿔도 됩니다.
**미래 날짜로 하면 글이 보이지 않습니다.**

### 2. Front matter (파일 맨 위 `---` 사이)

```yaml
---
title: "Flask 세션으로 로그인 상태 유지하기"   # 글 제목
excerpt: "목록에 보이는 한두 문장 요약"
date: 2026-11-24 15:00:00 +0900              # 목록 정렬 순서
author: "홍길동"                             # 내 이름
categories:
  - Concept                                  # Concept / Tip / Debugging / Guide / Explanation
tags:
  - 이화픽
  - Flask
---
```

`categories` 에 적은 분야에 따라 메인 상단 메뉴(Concept · Tip · Debugging · Guide · Explanation)에 글이 모입니다. Tip과 Debugging은 같은 메뉴에 나옵니다.

### 3. 본문

- 대제목은 `## 제목`, 소제목은 `### 제목`. 오른쪽 **목차가 자동으로** 만들어집니다.
- 글을 다 쓰면 맨 위의 노란 **작성 가이드 상자**(`<div class="message" ...>` ~ `</div>`)를 지웁니다.
- 제목 아래 "N분 읽기"가 글자 수(약 500자/분)로 자동 계산됩니다.

### 4. 이미지

`assets/images/<내 게시글>/` 에 넣고 아래처럼 씁니다. 바로 다음 줄의 `*기울임*` 은 가운데 정렬된 캡션으로 보입니다.

```markdown
![로그인 화면]({{ '/assets/images/concept/login.png' | relative_url }})
*그림 1. 로그인 화면*
```

> 경로는 꼭 `relative_url` 을 거쳐야 합니다. 사이트가 `/2026_osp_246_blog/` 아래에 배포되기 때문에 `/assets/...` 로만 쓰면 이미지가 깨집니다.
> GitHub Pages는 대소문자를 구분하니 파일명은 영문 소문자·숫자·하이픈만 쓰세요.

### 5. 코드 블록

````markdown
```python
@app.route("/list")
def view_list():
    return render_template("list.html")
```
````

`python`, `javascript`, `html`, `css`, `bash`, `json` 등 언어 이름을 쓰면 문법 색이 입혀집니다.

**주의**: Flask/Jinja 템플릿처럼 코드에 `{{ }}` 나 `{% %}` 가 있으면 Jekyll이 이를 해석해 버립니다.
코드 블록 바로 앞에 `{% raw %}`, 바로 뒤에 `{% endraw %}` 를 한 줄씩 넣어 감싸 주세요.

### 6. 표 · 인용문

```markdown
| 항목 | 설명 |
|---|---|
| sort | 정렬 기준 |

> 인용하거나 강조할 문장
```

## 로컬에서 미리보기

Ruby가 필요합니다 (macOS: `brew install ruby`).

```bash
git clone https://github.com/chanmi1125/2026_osp_246_blog.git
cd 2026_osp_246_blog
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve
# 브라우저에서 http://localhost:4000/2026_osp_246_blog/
```

- 글(`.md`)을 고치면 자동으로 다시 빌드됩니다. 새로고침만 하면 됩니다.
- `_config.yml` 을 고쳤다면 서버를 껐다(Ctrl+C) 다시 켜야 합니다.
- Sass 관련 `Deprecation Warning` 이 많이 나오지만 테마 내부 경고라 무시해도 됩니다.
- `Gemfile` 은 로컬 미리보기 전용입니다. 실제 배포는 GitHub Pages가 자체 환경에서 빌드합니다.

## 팀 작업 흐름

```bash
git pull origin main
git checkout -b post/concept            # 내 글 브랜치
# _posts/내글.md, assets/images/내폴더/ 만 수정
git add _posts/2026-11-24-concept.md assets/images/concept
git commit -m "Write concept post"
git push origin post/concept            # Pull Request → main 에 병합
```

각자 다른 파일만 수정하므로 충돌이 생기지 않습니다.

## GitHub Pages 배포

([Quickstart for GitHub Pages](https://docs.github.com/ko/pages/quickstart) 참고)

1. `main` 브랜치에 push 합니다.
2. 저장소 **Settings → Pages** 로 이동합니다.
3. **Source**: `Deploy from a branch`, **Branch**: `main` / `/ (root)` 를 고르고 **Save** 를 누릅니다.
4. **Actions** 탭에서 `pages build and deployment` 가 끝나면(1~3분) 아래 주소로 접속합니다.
   `https://chanmi1125.github.io/2026_osp_246_blog/`

> 저장소 이름을 `chanmi1125.github.io` 로 바꾸면 주소가 `https://chanmi1125.github.io/` 가 됩니다. 이때는 `_config.yml` 의 `baseurl` 을 `""` 로 비워 주세요.

## 디자인

| 이름 | 값 | 용도 |
|---|---|---|
| Warm Ivory | `#F6F3EA` | 왼쪽 글자, 코드 배경 |
| Deep Green | `#123D2B` | 왼쪽 커버, 링크, 강조 |
| Gray Green | `#65736D` | 보조 텍스트 |

본문 배경은 흰색, 다크 모드는 자동입니다. 색상·글꼴은 `assets/custom.css` 와 `_config.yml` 의 `cover_bg_color` 에서 테마 기본값을 덮어써서 관리합니다.
