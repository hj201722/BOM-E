(() => {
  "use strict";

  function showActiveTheme() {
    const activeTheme = document.querySelector("[data-theme].active");
    if (activeTheme) {
      const theme = activeTheme.dataset.theme;
      document.querySelectorAll("[data-theme]").forEach((elem) => {
        elem.classList.remove("active");
      });
      activeTheme.classList.add("active");
    }
  }

  // DOMContentLoaded 이벤트 리스너를 추가하여 DOM이 완전히 로드된 후에 함수를 호출합니다.
  document.addEventListener("DOMContentLoaded", function () {
    showActiveTheme();
  });

  const storedTheme = localStorage.getItem("theme");

  const getPreferredTheme = () => {
    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setTheme = function (theme) {
    if (
      theme === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-bs-theme", theme);
    }
  };

  setTheme(getPreferredTheme());

  const showActiveTheme = (theme) => {
    const activeThemeIcon = document.querySelector(".theme-icon-active i");
    const btnToActive = document.querySelector(
      `[data-bs-theme-value="${theme}"]`
    );

    // 요소가 존재하지 않을 경우 반환
    if (!btnToActive || !activeThemeIcon) {
      return;
    }

    const svgOfActiveBtn = btnToActive.querySelector("span i")
      ? btnToActive.querySelector("span i").getAttribute("class")
      : "";

    document.querySelectorAll("[data-bs-theme-value]").forEach((element) => {
      element.classList.remove("active");
    });

    btnToActive.classList.add("active");
    activeThemeIcon.setAttribute("class", svgOfActiveBtn);
  };

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (storedTheme !== "light" || storedTheme !== "dark") {
        setTheme(getPreferredTheme());
      }
    });

  window.addEventListener("DOMContentLoaded", () => {
    showActiveTheme(getPreferredTheme());

    document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const theme = toggle.getAttribute("data-bs-theme-value");
        localStorage.setItem("theme", theme);
        setTheme(theme);
        showActiveTheme(theme);
      });
    });
  });
})();
