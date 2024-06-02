document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyB72af3dmgDdLtG-PZZwaCYjz1D55NM31A",
    authDomain: "bome-digital.firebaseapp.com",
    databaseURL: "https://bome-digital-default-rtdb.firebaseio.com",
    projectId: "bome-digital",
    storageBucket: "bome-digital.appspot.com",
    messagingSenderId: "388461486960",
    appId: "1:388461486960:web:8085e059b41efff93265b5",
    measurementId: "G-REF8HG5VWW",
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }

  const db = firebase.database();
  const itemsPerPage = 9; // 페이지당 항목 수
  const pagesPerGroup = 5; // 페이지 그룹 당 페이지 수
  let currentPage = 1; // 현재 페이지
  let currentGroup = 1; // 현재 페이지 그룹

  const productContainer = document.getElementById("product-list");
  const paginationContainer = document.querySelector(".pagination");
  const productDetailsUrlTemplate = productContainer.getAttribute(
    "data-product-details-url-template"
  );

  function fetchData(searchQuery = "", page = 1, retries = 3) {
    db.ref("products_digital")
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          const products = snapshot.val();
          productContainer.innerHTML = ""; // 기존 제품 목록 제거
          paginationContainer.innerHTML = ""; // 기존 페이지네이션 제거

          let productNames = Object.keys(products);
          if (searchQuery) {
            productNames = productNames.filter((productName) =>
              productName.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          const totalItems = productNames.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage);

          const start = (page - 1) * itemsPerPage;
          const end = Math.min(start + itemsPerPage, totalItems);

          for (let i = start; i < end; i++) {
            const productName = productNames[i];
            const productData = products[productName];

            const productCard = document.createElement("div");
            productCard.classList.add(
              "col-6",
              "col-md-4",
              "col-lg-3",
              "product-card-container"
            );

            const productDetailsUrl = productDetailsUrlTemplate.replace(
              "PRODUCT_ID_PLACEHOLDER",
              encodeURIComponent(productName)
            );

            const imgUrl = productData.img_url
              ? productData.img_url
              : window.defaultImgSrc;

            productCard.innerHTML = `
              <div class="product-card-1">
                  <div class="product-card-image">
                      <div class="product-media">
                          <a href="${productDetailsUrl}">
                              <img class="img-fluid" src="${imgUrl}" title="${productName}" alt="${productName}">
                          </a>
                          <div class="product-cart-btn">
                              <a href="${productDetailsUrl}" class="btn btn-primary btn-sm w-100">상품 보러 가기</a>
                          </div>
                      </div>
                  </div>
                  <div class="product-card-info">
                    <h6 class="product-title">
                      <a href="${productDetailsUrl}">${productName}</a>
                    </h6>
                      <div class="rating-star text">
                          ${getStarsHtml(
                            productData.average_score
                              ? productData.average_score
                              : 0
                          )}
                      </div>
                      <p class="product-info">${productData.info}</p>
                  </div>
              </div>`;

            productContainer.appendChild(productCard);
          }

          // 페이지네이션 생성
          if (totalPages > 1) {
            const totalGroups = Math.ceil(totalPages / pagesPerGroup);
            currentGroup = Math.ceil(page / pagesPerGroup);

            if (currentGroup > 1) {
              const prevGroupLi = document.createElement("li");
              prevGroupLi.classList.add("page-item");
              prevGroupLi.innerHTML = `
                <a class="page-link" href="#" aria-label="Previous Group" data-group="${
                  currentGroup - 1
                }">
                  <span aria-hidden="true">&laquo;</span>
                </a>`;
              paginationContainer.appendChild(prevGroupLi);
            }

            const startPage = (currentGroup - 1) * pagesPerGroup + 1;
            const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

            for (let i = startPage; i <= endPage; i++) {
              const li = document.createElement("li");
              li.classList.add("page-item");
              if (i === page) {
                li.classList.add("active");
              }
              li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
              paginationContainer.appendChild(li);
            }

            if (currentGroup < totalGroups) {
              const nextGroupLi = document.createElement("li");
              nextGroupLi.classList.add("page-item");
              nextGroupLi.innerHTML = `
                <a class="page-link" href="#" aria-label="Next Group" data-group="${
                  currentGroup + 1
                }">
                  <span aria-hidden="true">&raquo;</span>
                </a>`;
              paginationContainer.appendChild(nextGroupLi);
            }
          }

          // 페이지 클릭 이벤트 핸들러
          paginationContainer
            .querySelectorAll("a.page-link")
            .forEach((link) => {
              link.addEventListener("click", (event) => {
                event.preventDefault();
                const selectedPage = parseInt(
                  event.target.getAttribute("data-page")
                );
                if (selectedPage !== currentPage) {
                  currentPage = selectedPage;
                  fetchData(searchQuery, currentPage);
                }
              });
            });

          // 페이지 그룹 클릭 이벤트 핸들러
          paginationContainer
            .querySelectorAll("a[data-group]")
            .forEach((link) => {
              link.addEventListener("click", (event) => {
                event.preventDefault();
                const selectedGroup = parseInt(
                  event.target.getAttribute("data-group")
                );
                currentGroup = selectedGroup;
                const newPage = (currentGroup - 1) * pagesPerGroup + 1;
                fetchData(searchQuery, newPage);
              });
            });
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        if (retries > 0) {
          setTimeout(() => fetchData(searchQuery, page, retries - 1), 3000);
        }
      });
  }

  document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchQuery = document.getElementById("searchInput").value;
    fetchData(searchQuery, 1);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search");
  if (searchQuery) {
    document.getElementById("searchInput").value = searchQuery;
    fetchData(searchQuery, 1);
  } else {
    fetchData();
  }

  function getStarsHtml(score) {
    let starsHtml = "";
    const fullStars = Math.floor(score);
    const halfStar = score % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="bi bi-star-fill text-warning"></i>';
    }

    if (halfStar) {
      starsHtml += '<i class="bi bi-star-half text-warning"></i>';
    }

    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
      starsHtml += '<i class="bi bi-star text-muted"></i>';
    }

    return starsHtml;
  }
});
