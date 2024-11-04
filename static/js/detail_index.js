document.addEventListener("DOMContentLoaded", function () {
  function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const regex = /([^&=]+)=([^&]*)/g;
    let m;
    while ((m = regex.exec(queryString))) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
  }

  const params = getQueryParams();
  const productName = params.productName || "제품 이름 없음";
  console.log("Query Parameters:", params);
  console.log("Product Name:", productName);

  const productTitleElement = document.querySelector(".products-title h4");
  if (productTitleElement) {
    productTitleElement.textContent = productName;
  } else {
    console.error("상품 명 요소를 찾을 수 없습니다.");
  }

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

  db.ref("products_digital/" + productName)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const productData = snapshot.val();
        console.log("Product Data:", productData);

        const descriptionElement = document.querySelector(
          ".product-description p"
        );
        if (descriptionElement) {
          descriptionElement.textContent = productData.info || "제품 설명 없음";
        }

        const starsElement = document.querySelector(".rating-star");
        if (starsElement) {
          starsElement.innerHTML =
            getStarsHtml(productData.average_score || 0) +
            ` <small>${productData.average_score || 0} 점</small>`;
          console.log("Stars HTML:", starsElement.innerHTML);
        } else {
          console.error("별점 요소를 찾을 수 없습니다.");
        }

        const galleryLinks = document.querySelectorAll(
          ".pd-gallery-slide .gallery-link"
        );
        const galleryImages = document.querySelectorAll(
          ".pd-gallery-slide img"
        );
        const thumbImages = document.querySelectorAll(
          ".pd-gallery-slide-thumb img"
        );

        if (
          galleryLinks &&
          galleryImages &&
          thumbImages &&
          productData.img_url
        ) {
          galleryLinks.forEach((galleryLink, index) => {
            if (galleryImages[index] && thumbImages[index]) {
              galleryLink.href = productData.img_url;
              galleryImages[index].src = productData.img_url;
              thumbImages[index].src = productData.img_url;
            }
          });
        }

        const positiveReviewExists =
          productData.positive_sentence || productData.positive_url;
        const negativeReviewExists =
          productData.negative_sentence || productData.negative_url;
        const neutralReviewExists =
          productData.neutral_sentence || productData.neutral_url;

        const tabList = document.querySelector(".nav.product-nav-tabs");
        if (positiveReviewExists) {
          tabList.insertAdjacentHTML(
            "beforeend",
            `<li class="nav-item" role="presentation">
              <a href="#positive" class="nav-link" id="pd_positive_tab" data-bs-toggle="tab" data-bs-target="#positive" role="tab" aria-controls="positive" aria-selected="false">긍정</a>
            </li>`
          );
        }
        if (neutralReviewExists) {
          tabList.insertAdjacentHTML(
            "beforeend",
            `<li class="nav-item" role="presentation">
              <a href="#neutral" class="nav-link" id="pd_neutral_tab" data-bs-toggle="tab" data-bs-target="#neutral" role="tab" aria-controls="neutral" aria-selected="false">중립</a>
            </li>`
          );
        }
        if (negativeReviewExists) {
          tabList.insertAdjacentHTML(
            "beforeend",
            `<li class="nav-item" role="presentation">
              <a href="#negative" class="nav-link" id="pd_negative_tab" data-bs-toggle="tab" data-bs-target="#negative" role="tab" aria-controls="negative" aria-selected="false">부정</a>
            </li>`
          );
        }

        if (positiveReviewExists) {
          const positiveTabContent = document.querySelector("#positive");
          if (positiveTabContent) {
            positiveTabContent.innerHTML = `
              <div class="review-content positive text-center">
                <h3>긍정 리뷰</h3>
                <p class="positive-review-text">${
                  productData.positive_sentence || "리뷰 내용이 없습니다."
                }</p>
                <img class="positive-review-image img-fluid mx-auto d-block" src="${
                  productData.positive_url || "{% static 'img/image-4.png' %}"
                }" alt="Product Image">
              </div>
            `;
          }
        }

        if (negativeReviewExists) {
          const negativeTabContent = document.querySelector("#negative");
          if (negativeTabContent) {
            negativeTabContent.innerHTML = `
              <div class="review-content negative text-center">
                <h3>부정 리뷰</h3>
                <p class="negative-review-text">${
                  Array.isArray(productData.negative_sentence)
                    ? productData.negative_sentence[0] ||
                      "리뷰 내용이 없습니다."
                    : productData.negative_sentence || "리뷰 내용이 없습니다."
                }</p>
                <img class="negative-review-image img-fluid mx-auto d-block" src="${
                  Array.isArray(productData.negative_url)
                    ? productData.negative_url[0] ||
                      "{% static 'img/image-3.png' %}"
                    : productData.negative_url ||
                      "{% static 'img/image-3.png' %}"
                }" alt="Product Image">
              </div>
            `;
          }
        }

        if (neutralReviewExists) {
          const neutralTabContent = document.querySelector("#neutral");
          if (neutralTabContent) {
            neutralTabContent.innerHTML = `
              <div class="review-content neutral text-center">
                <h3>중립 리뷰</h3>
                <p class="neutral-review-text">${
                  Array.isArray(productData.neutral_sentence)
                    ? productData.neutral_sentence[0] || "리뷰 내용이 없습니다."
                    : productData.neutral_sentence || "리뷰 내용이 없습니다."
                }</p>
                <img class="neutral-review-image img-fluid mx-auto d-block" src="${
                  Array.isArray(productData.neutral_url)
                    ? productData.neutral_url[0] ||
                      "{% static 'img/image-5.png' %}"
                    : productData.neutral_url ||
                      "{% static 'img/image-5.png' %}"
                }" alt="Product Image">
              </div>
            `;
          }
        }
      } else {
        console.log("No data available for product:", productName);
      }
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
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
