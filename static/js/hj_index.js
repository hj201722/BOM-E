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

  // Check if the productDetailsUrlTemplate is properly defined
  if (!productDetailsUrlTemplate) {
    console.error("Product details URL template is not defined.");
    return;
  }

  db.ref("products_digital")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const products = snapshot.val();
        productContainer.innerHTML = ""; // Clear existing products
        let productCount = 0; // Initialize product counter

        for (const productName in products) {
          if (products.hasOwnProperty(productName)) {
            const productData = products[productName];

            // 기본 상품 정보 가져오기
            if (!productName.includes("_")) {
              createProductCard(productName, productData);
              productCount++;
              if (productCount >= 10) return; // Stop after displaying 10 products
            }

            // 상세 정보가 있는 상품 처리
            for (const detailedProductName in products) {
              if (
                products.hasOwnProperty(detailedProductName) &&
                detailedProductName.startsWith(productName + "_")
              ) {
                const detailedProductData = products[detailedProductName];
                createDetailedProductCard(productName, detailedProductData);
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

  function createProductCard(productName, productData) {
    const productCard = document.createElement("div");
    productCard.classList.add("swiper-slide");

    const productDetailsUrl = `../product_details/?productName=${encodeURIComponent(
      productName
    )}`;

    // productData에 유효한 img_url이 있는지 확인
    const imgUrl = productData.img_url ? productData.img_url : staticUrl;

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
                      productData.average_score ? productData.average_score : 0
                    )}
                </div>
            </div>
        </div>`;

    productContainer.appendChild(productCard);
  }

  function createDetailedProductCard(productName, productData) {
    // 필요한 데이터가 있는지 확인하고 사용
    const details = {
      positive_sentence: productData.positive_sentence || "",
      positive_url: productData.positive_url || staticUrl,
      neutral_sentence: productData.neutral_sentence || "",
      neutral_url: productData.neutral_url || staticUrl,
      negative_sentence: productData.negative_sentence || "",
      negative_url: productData.negative_url || staticUrl,
    };

    // 상세 정보 출력 예시
    console.log(`Details for ${productName}:`, details);
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
