// Progressive enhancements. The site works without this file; it adds the mobile menu,
// theme switch, active-section nav, copy email, the job-description match tool,
// back-to-top and friendly contact-form validation.

(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get: (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set: (k, v) => {
      try {
        localStorage.setItem(k, v);
      } catch {
        /* storage blocked: the choice just won't be remembered */
      }
    },
  };

  // ── Toast ───────────────────────────────────────────────────────────────
  const toastEl = document.querySelector(".toast");
  let toastTimer;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
  }

  // ── Local time next to the city (updates every 30 seconds) ──────────────
  const clocks = document.querySelectorAll(".local-time[data-tz]");
  function tick() {
    for (const el of clocks) {
      try {
        el.textContent = new Intl.DateTimeFormat("en-GB", {
          timeZone: el.dataset.tz,
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date());
        el.title = "Local time";
      } catch {
        el.hidden = true; // unknown time zone: hide rather than show a wrong time
      }
    }
  }
  if (clocks.length) {
    tick();
    setInterval(tick, 30000);
  }

  // ── Mobile menu ─────────────────────────────────────────────────────────
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    const label = menuBtn.querySelector(".menu-label");
    const setOpen = (open) => {
      menuBtn.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      if (label) label.textContent = open ? "Close" : "Menu";
    };
    menuBtn.addEventListener("click", () => setOpen(menuBtn.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        menuBtn.focus();
      }
    });
  }

  // ── Theme switch (follows the system until the visitor picks one) ───────
  const themeBtn = document.querySelector(".theme-btn");
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const effectiveTheme = () => root.dataset.theme || (darkQuery.matches ? "dark" : "light");
  function syncThemeButton() {
    if (!themeBtn) return;
    const current = effectiveTheme();
    themeBtn.dataset.mode = current;
    themeBtn.setAttribute("aria-label", `Switch to ${current === "dark" ? "light" : "dark"} theme`);
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = effectiveTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      store.set("theme", next);
      syncThemeButton();
      toast(`${next === "dark" ? "Dark" : "Light"} theme on`);
    });
    darkQuery.addEventListener?.("change", syncThemeButton);
    syncThemeButton();
  }

  // ── Header shadow and back-to-top, based on scroll position ────────────
  const header = document.querySelector(".site-header");
  const toTop = document.querySelector(".to-top");
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header?.classList.toggle("is-scrolled", y > 8);
      toTop?.classList.toggle("is-visible", y > 900);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    document.querySelector(".brand")?.focus({ preventScroll: true });
  });

  // ── Highlight the section you're reading in the nav ─────────────────────
  function scrollSpy(links) {
    const map = new Map();
    for (const link of links) {
      const id = (link.getAttribute("href") || "").split("#")[1];
      const target = id && document.getElementById(id);
      if (target) map.set(target, link);
    }
    if (!map.size || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const l of map.values()) l.removeAttribute("aria-current");
          map.get(entry.target).setAttribute("aria-current", "true");
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const target of map.keys()) observer.observe(target);
  }
  scrollSpy(document.querySelectorAll(".site-nav a[data-section]"));
  scrollSpy(document.querySelectorAll(".cs-toc a"));

  // ── Copy email ──────────────────────────────────────────────────────────
  for (const btn of document.querySelectorAll("[data-copy]")) {
    btn.addEventListener("click", async () => {
      const value = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        btn.textContent = "Copied";
        toast("Email address copied");
        setTimeout(() => (btn.textContent = "Copy"), 2000);
      } catch {
        // Clipboard refused (some browsers and embedded views): select the address instead.
        const link = btn.previousElementSibling;
        const range = document.createRange();
        range.selectNodeContents(link);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        toast("Email selected. Press Ctrl+C (or ⌘C) to copy");
      }
    });
  }

  // ── Job-description match ───────────────────────────────────────────────
  const fit = document.querySelector(".fit");
  if (fit) {
    const input = fit.querySelector("#fit-input");
    const result = fit.querySelector(".fit-result");
    const clearBtn = fit.querySelector("[data-fit-clear]");
    const sampleBtn = fit.querySelector("[data-fit-sample]");
    const grid = document.querySelector(".skill-grid");
    const pills = [...document.querySelectorAll(".skill-group li[data-keys]")];
    const learningKeys = (fit.dataset.learning || "").split("|").filter(Boolean);
    const learningLabels = (fit.dataset.learningLabels || "").split("|").filter(Boolean);

    // Common QA tools and platforms that aren't in my skills list, so a match can be honest about gaps.
    const OTHER_TOOLS = {
      selenium: "Selenium", cypress: "Cypress", appium: "Appium", python: "Python", "c#": "C#", ".net": ".NET",
      typescript: "TypeScript", k6: "k6", gatling: "Gatling", loadrunner: "LoadRunner", katalon: "Katalon",
      "robot framework": "Robot Framework", webdriverio: "WebdriverIO", testcafe: "TestCafe", puppeteer: "Puppeteer",
      docker: "Docker", kubernetes: "Kubernetes", aws: "AWS", azure: "Azure", gcp: "GCP", graphql: "GraphQL",
      kafka: "Kafka", browserstack: "BrowserStack", "sauce labs": "Sauce Labs", xray: "Xray", zephyr: "Zephyr",
      karate: "Karate", pact: "Pact", allure: "Allure", gitlab: "GitLab", "azure devops": "Azure DevOps",
      terraform: "Terraform", kotlin: "Kotlin", swift: "Swift", espresso: "Espresso", xcuitest: "XCUITest",
      soapui: "SoapUI", mongodb: "MongoDB", "c++": "C++", ruby: "Ruby",
    };
    const SAMPLE =
      "Senior QA Automation Engineer (remote). You will own the test strategy for our web and mobile apps. " +
      "Must have: Playwright or Selenium, Java, REST API testing with RestAssured or Postman, SQL, and CI/CD " +
      "pipelines (GitHub Actions or Jenkins). Nice to have: Docker, performance testing with JMeter or k6, " +
      "and experience working in Agile/Scrum teams.";

    const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const mentions = (text, key) => new RegExp(`(^|[^a-z0-9+#.])${escapeRe(key)}(?![a-z0-9+#])`, "i").test(text);

    function el(tag, cls, text) {
      const node = document.createElement(tag);
      if (cls) node.className = cls;
      if (text != null) node.textContent = text;
      return node;
    }

    function reset() {
      for (const li of pills) li.classList.remove("is-match");
      grid?.classList.remove("is-filtering");
      result.replaceChildren();
      clearBtn.hidden = true;
    }

    function run() {
      const text = input.value.replace(/\s+/g, " ").trim();
      if (!text) return reset();
      clearBtn.hidden = false;

      const matched = [];
      const matchedKeys = new Set();
      for (const li of pills) {
        const keys = li.dataset.keys.split("|");
        const hit = keys.some((k) => mentions(text, k));
        li.classList.toggle("is-match", hit);
        if (hit) {
          matched.push(li.textContent.trim());
          keys.forEach((k) => matchedKeys.add(k));
        }
      }
      grid?.classList.add("is-filtering");

      const learning = learningKeys
        .map((k, i) => (mentions(text, k) ? learningLabels[i] : null))
        .filter(Boolean);
      const gaps = Object.entries(OTHER_TOOLS)
        .filter(([key, label]) => label && !matchedKeys.has(key) && !learningKeys.includes(key) && mentions(text, key))
        .map(([, label]) => label);

      const out = [];
      if (matched.length) {
        const score = el("p", "fit-score");
        score.append(el("strong", null, String(matched.length)), ` of my skills ${matched.length === 1 ? "matches" : "match"} this role`);
        const chips = el("ul", "fit-chips");
        chips.setAttribute("aria-label", "Matching skills");
        for (const name of matched) chips.append(el("li", null, name));
        out.push(score, chips);
      } else {
        out.push(el("p", "fit-score fit-empty", "No matching skills found yet. Try pasting the full job description, including the requirements."));
      }
      if (learning.length) {
        const p = el("p", "fit-note");
        p.append(el("span", null, "Learning now:"), ` ${learning.join(", ")}`);
        out.push(p);
      }
      if (gaps.length) {
        const p = el("p", "fit-note");
        p.append(el("span", null, "Not on my list yet:"), ` ${gaps.join(", ")}`);
        out.push(p);
      }
      result.replaceChildren(...out);
    }

    let timer;
    input.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(run, 200);
    });
    sampleBtn.addEventListener("click", () => {
      input.value = SAMPLE;
      run();
    });
    clearBtn.addEventListener("click", () => {
      input.value = "";
      reset();
      input.focus();
    });
  }

  // ── Contact form ────────────────────────────────────────────────────────
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const submit = form.querySelector('button[type="submit"]');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: (v) => (v ? "" : "Enter your name."),
    email: (v) =>
      !v ? "Enter your email address." : EMAIL_RE.test(v) ? "" : "Enter a valid email address, like name@company.com.",
    message: (v) =>
      !v ? "Enter a message." : v.length < 10 ? "Add a little more detail (at least 10 characters)." : "",
  };

  function showError(field, message) {
    const input = form.elements[field];
    const err = document.getElementById(`cf-${field}-error`);
    input.setAttribute("aria-invalid", message ? "true" : "false");
    err.textContent = message;
    err.hidden = !message;
  }

  function validate() {
    let firstInvalid = null;
    for (const [field, rule] of Object.entries(rules)) {
      const message = rule(form.elements[field].value.trim());
      showError(field, message);
      if (message && !firstInvalid) firstInvalid = form.elements[field];
    }
    return firstInvalid;
  }

  // Re-check a field once the visitor leaves it, but only after a first submit attempt.
  let attempted = false;
  for (const field of Object.keys(rules)) {
    form.elements[field].addEventListener("blur", () => {
      if (attempted) showError(field, rules[field](form.elements[field].value.trim()));
    });
  }

  function setStatus(kind, message) {
    status.className = `form-status is-${kind}`;
    status.textContent = message;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    attempted = true;
    status.textContent = "";
    status.className = "form-status";

    const firstInvalid = validate();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = "Sending…";
    const fallback = form.dataset.email ? ` or email me at ${form.dataset.email}` : "";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      attempted = false;
      setStatus("success", "Message sent. Thanks, I'll reply by email.");
    } catch {
      setStatus("error", `Your message wasn't sent. Check your connection and try again${fallback}.`);
    } finally {
      submit.disabled = false;
      submit.textContent = "Send message";
    }
  });
})();
