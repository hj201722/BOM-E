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
  const itemsPerPage = 10; // 페이지당 항목 수
  let currentPage = 1; // 현재 페이지

  function fetchData(searchQuery = "", page = 1, retries = 3) {
    db.ref("products_digital")
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          const products = snapshot.val();
          const productContainer = document.getElementById("product-list");
          const paginationContainer = document.querySelector(".pagination");
          productContainer.innerHTML = ""; // Clear existing products
          paginationContainer.innerHTML = ""; // Clear existing pagination

          let productNames = Object.keys(products);
          if (searchQuery) {
            productNames = productNames.filter((productName) =>
              productName.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          const totalItems = productNames.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage);

          // 현재 페이지의 시작 및 끝 인덱스 계산
          const start = (page - 1) * itemsPerPage;
          const end = Math.min(start + itemsPerPage, totalItems);

          for (let i = start; i < end; i++) {
            const productName = productNames[i];
            const imgSrc = window.defaultImgSrc; // Use the global variable

            const productCard = document.createElement("div");
            productCard.classList.add(
              "col-6",
              "col-md-3",
              "col-lg-4",
              "product-card-container"
            );

            const productDetailsUrl = productContainer
              .getAttribute("data-product-details-url-template")
              .replace("PRODUCT_ID_PLACEHOLDER", productName);
            productCard.innerHTML = `
                <div class="product-card-3">
                  <div class="product-card-image">
                    <div class="product-action">
                      <a href="javascript:void(0)" class="btn btn-dark">
                        <i class="fi-eye"></i>
                      </a>
                    </div>
                    <div class="product-media">
                      <a href="${productDetailsUrl}">
                        <img class="img-fluid" src="${imgSrc}" title="${productName}" alt="${productName}">
                      </a>
                    </div>
                  </div>
                  <div class="product-card-info">
                    <h6 class="product-title">
                      <a href="${productDetailsUrl}">${productName}</a>
                    </h6>
                  </div>
                </div>`;

            productContainer.appendChild(productCard);
          }

          // 페이지네이션 생성
          if (totalPages > 1) {
            if (page > 1) {
              const prevLi = document.createElement("li");
              prevLi.classList.add("page-item");
              prevLi.innerHTML = `
                  <a class="page-link" href="#" aria-label="Previous" data-page="${
                    page - 1
                  }">
                    <span aria-hidden="true">&laquo;</span>
                  </a>`;
              paginationContainer.appendChild(prevLi);
            }

            for (let i = 1; i <= totalPages; i++) {
              const li = document.createElement("li");
              li.classList.add("page-item");
              if (i === page) {
                li.classList.add("active");
              }
              li.innerHTML = `
                  <a class="page-link" href="#" data-page="${i}">${i}</a>`;
              paginationContainer.appendChild(li);
            }

            if (page < totalPages) {
              const nextLi = document.createElement("li");
              nextLi.classList.add("page-item");
              nextLi.innerHTML = `
                  <a class="page-link" href="#" aria-label="Next" data-page="${
                    page + 1
                  }">
                    <span aria-hidden="true">&raquo;</span>
                  </a>`;
              paginationContainer.appendChild(nextLi);
            }
          }

          // 페이지 클릭 이벤트 핸들러
          paginationContainer.addEventListener("click", (event) => {
            event.preventDefault();
            const target = event.target.closest("a");
            if (target) {
              const selectedPage = parseInt(target.getAttribute("data-page"));
              if (selectedPage !== currentPage) {
                currentPage = selectedPage;
                fetchData(searchQuery, currentPage);
              }
            }
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

  fetchData();
});
