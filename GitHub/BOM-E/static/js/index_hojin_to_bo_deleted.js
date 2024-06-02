document.addEventListener("DOMContentLoaded", function () {
  // 모든 드롭다운 요소를 선택
  const dropdowns = document.querySelectorAll(
    ".navbar .dropdown, .navbar .dropdown-submenu"
  );

  // 각 드롭다운에 대해 마우스 오버 이벤트 리스너 추가
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("mouseover", function () {
      let submenu = this.querySelector(".dropdown-menu");
      if (submenu) submenu.style.display = "block";
    });

    dropdown.addEventListener("mouseout", function () {
      let submenus = this.querySelectorAll(".dropdown-menu");
      submenus.forEach((submenu) => {
        submenu.style.display = "none";
      });
    });
  });
});
