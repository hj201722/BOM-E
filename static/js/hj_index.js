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
  const productContainer = document.getElementById("product-list");

  const staticUrl = productContainer.getAttribute("data-static-url");
  const productDetailsUrlTemplate = productContainer.getAttribute(
    "data-product-details-url-template"
  );

  db.ref("products_digital")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const products = snapshot.val();
        productContainer.innerHTML = ""; // Clear existing products
        let productCount = 0; // Initialize product counter

        for (const largeCategory in products) {
          if (products.hasOwnProperty(largeCategory)) {
            const productNames = products[largeCategory];

            for (const productName in productNames) {
              if (productNames.hasOwnProperty(productName)) {
                const productData = productNames[productName];

                const productCard = document.createElement("div");
                productCard.classList.add("swiper-slide");

                const productDetailsUrl = productDetailsUrlTemplate.replace(
                  "PRODUCT_ID_PLACEHOLDER",
                  productName
                );
                productCard.innerHTML = `
                    <div class="product-card-1">
                        <div class="product-card-image">
                            <div class="product-action">
                                <a data-bs-toggle="modal" data-bs-target="#px-quick-view" href="javascript:void(0)" class="btn btn-outline-primary">
                                    <i class="fi-eye"></i>
                                </a>
                            </div>
                            <div class="product-media">
                                <a href="${productDetailsUrl}">
                                    <img class="img-fluid" src="${
                                      productData.img_url
                                    }" title="${productName}" alt="${productName}">
                                </a>
                                <div class="product-cart-btn">
                                    <a href="${productDetailsUrl}" class="btn btn-primary btn-sm w-100">상품 보러 가기</a>
                                </div>
                            </div>
                        </div>
                        <div class="product-card-info">
                            <div class="product-meta small">
                                <a href="#">${largeCategory}</a>
                            </div>
                            <div class="rating-star text">
                                ${getStarsHtml(
                                  productData.average_score
                                    ? productData.average_score
                                    : 0
                                )}
                            </div>
                            <h6 class="product-title">
                                <a href="${productDetailsUrl}">${productName}</a>
                            </h6>
                        </div>
                    </div>`;

                productContainer.appendChild(productCard);
                productCount++;

                if (productCount >= 10) {
                  return; // Stop after displaying 10 products
                }
              }
            }
          }
        }
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

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
