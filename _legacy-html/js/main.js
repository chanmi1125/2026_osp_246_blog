/* ==========================================================================
   EWHA PICK | Tech Blog — 공통 스크립트
   - 모든 페이지에서 공유합니다. 게시글 작성 시 이 파일을 수정할 필요는 없습니다.
   - 기능
     1) 게시글 목차(TOC) 자동 생성: .post-body 안의 h2, h3 를 읽어 만듭니다.
     2) 현재 읽고 있는 소제목을 목차에서 강조합니다.
     3) 코드 블록에 언어 이름과 "복사" 버튼을 붙입니다.
     4) 푸터의 연도를 현재 연도로 표시합니다.
     5) 메인 페이지 카테고리 탭 필터, 스크롤 시 헤더 구분선 표시
     6) 게시글 예상 읽기 시간 표시 (Lecture 11: 5~7분 분량 권장)
   ========================================================================== */
(function () {
  "use strict";

  var LANG_NAMES = {
    js: "JavaScript", javascript: "JavaScript", html: "HTML", markup: "HTML",
    css: "CSS", json: "JSON", bash: "Bash", shell: "Shell", sh: "Shell",
    py: "Python", python: "Python", java: "Java", sql: "SQL", text: "Text"
  };

  /* ---------- 1. TOC ---------- */
  function slugify(text, used) {
    var base = text.trim().toLowerCase()
      .replace(/[^\wㄱ-ㆎ가-힣\s-]/g, "")
      .replace(/\s+/g, "-") || "section";
    var slug = base;
    var n = 2;
    while (used[slug]) { slug = base + "-" + n++; }
    used[slug] = true;
    return slug;
  }

  function buildToc() {
    var body = document.querySelector(".post-body");
    var lists = document.querySelectorAll("[data-toc]");
    if (!body || !lists.length) return [];

    var headings = Array.prototype.slice.call(body.querySelectorAll("h2, h3"));
    if (!headings.length) {
      document.querySelectorAll(".toc").forEach(function (el) { el.hidden = true; });
      return [];
    }

    var used = {};
    headings.forEach(function (h) {
      if (!h.id) h.id = slugify(h.textContent, used);
      else used[h.id] = true;
    });

    lists.forEach(function (list) {
      var frag = document.createDocumentFragment();
      headings.forEach(function (h) {
        var li = document.createElement("li");
        li.className = "toc-" + h.tagName.toLowerCase();
        var a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        frag.appendChild(li);
      });
      list.appendChild(frag);
    });

    return headings;
  }

  /* ---------- 2. Scroll spy ---------- */
  function watchHeadings(headings) {
    if (!headings.length || !("IntersectionObserver" in window)) return;
    var links = document.querySelectorAll(".toc a");

    function setActive(id) {
      links.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
      });
    }

    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      for (var i = 0; i < headings.length; i++) {
        if (visible[headings[i].id]) { setActive(headings[i].id); return; }
      }
    }, { rootMargin: "-80px 0px -65% 0px" });

    headings.forEach(function (h) { observer.observe(h); });

    document.querySelectorAll(".toc-inline a").forEach(function (a) {
      a.addEventListener("click", function () {
        var details = a.closest("details");
        if (details) details.open = false;
      });
    });
  }

  /* ---------- 3. Code blocks ---------- */
  function enhanceCodeBlocks() {
    document.querySelectorAll(".post-body pre").forEach(function (pre) {
      if (pre.parentElement.classList.contains("code-block")) return;
      var code = pre.querySelector("code");
      var lang = "";
      if (code) {
        var m = code.className.match(/language-([\w-]+)/);
        if (m) lang = m[1];
      }

      var wrap = document.createElement("div");
      wrap.className = "code-block";
      var head = document.createElement("div");
      head.className = "code-block-head";

      var label = document.createElement("span");
      label.textContent = pre.getAttribute("data-filename") || LANG_NAMES[lang] || lang || "Code";
      head.appendChild(label);

      if (navigator.clipboard) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "copy-btn";
        btn.textContent = "복사";
        btn.setAttribute("aria-label", "코드 복사");
        btn.addEventListener("click", function () {
          navigator.clipboard.writeText((code || pre).textContent).then(function () {
            btn.textContent = "복사됨";
            setTimeout(function () { btn.textContent = "복사"; }, 1500);
          }, function () {
            btn.textContent = "실패";
            setTimeout(function () { btn.textContent = "복사"; }, 1500);
          });
        });
        head.appendChild(btn);
      }

      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(head);
      wrap.appendChild(pre);
    });
  }

  /* ---------- 4. Footer year ---------- */
  function setYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- 5. Category tabs (index) ---------- */
  function setupTabs() {
    var tabs = document.querySelectorAll(".tab[data-filter]");
    var items = document.querySelectorAll(".post-list > li[data-category]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var f = tab.getAttribute("data-filter");
        tabs.forEach(function (t) { t.setAttribute("aria-selected", t === tab ? "true" : "false"); });
        items.forEach(function (li) {
          li.hidden = f !== "all" && li.getAttribute("data-category") !== f;
        });
      });
    });
  }

  /* ---------- 6. Header border on scroll ---------- */
  function setupHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function update() { header.classList.toggle("is-scrolled", window.scrollY > 4); }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- 7. Reading time ---------- */
  // 한국어 약 500자/분, 영어 약 200단어/분 기준으로 예상 읽기 시간을 표시합니다.
  function setReadingTime() {
    var target = document.querySelector("[data-reading-time]");
    var body = document.querySelector(".post-body");
    if (!target || !body) return;
    var clone = body.cloneNode(true);
    clone.querySelectorAll(".writing-guide, .toc").forEach(function (el) { el.remove(); });
    var text = clone.textContent || "";
    var ko = (text.match(/[\uAC00-\uD7A3]/g) || []).length;
    var en = (text.replace(/[\uAC00-\uD7A3]/g, " ").match(/[A-Za-z0-9]+/g) || []).length;
    var minutes = Math.max(1, Math.round(ko / 500 + en / 200));
    target.textContent = minutes + "분 읽기";
  }

  function init() {
    setReadingTime();
    setupTabs();
    setupHeader();
    watchHeadings(buildToc());
    enhanceCodeBlocks();
    setYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
