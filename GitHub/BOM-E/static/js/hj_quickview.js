document.addEventListener("DOMContentLoaded", function () {
  // Firebase 초기화
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

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }

  const db = firebase.database();

  // Fetch data from Firebase
  const dbRef = db.ref("products_digital");

  // 재시도 로직
  function fetchData(retries = 3) {
    dbRef
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          const products = snapshot.val();
          console.log("Fetched products:", products);

          // Loop through all products and update the DOM
          for (const largeCategory in products) {
            if (products.hasOwnProperty(largeCategory)) {
              const productNames = products[largeCategory];

              for (const productName in productNames) {
                if (productNames.hasOwnProperty(productName)) {
                  const productData = productNames[productName];

                  // Update DOM elements with fetched data
                  const summaryElement =
                    document.getElementById("quick-view-summary");
                  const productNameElement =
                    document.getElementById("quick-view-title");
                  const averageScoreElement = document.getElementById(
                    "quick-view-average-score"
                  );
                  const reviewCountElement = document.getElementById(
                    "quick-view-review-count"
                  );
                  const productCategoryElement = document.getElementById(
                    "quick-view-category"
                  );
                  const starContainer = document.getElementById(
                    "quick-view-star-container"
                  );

                  if (
                    summaryElement &&
                    productNameElement &&
                    averageScoreElement &&
                    reviewCountElement &&
                    productCategoryElement &&
                    starContainer
                  ) {
                    summaryElement.textContent = productData.summary
                      ? productData.summary
                      : "No summary available";
                    productNameElement.textContent = productName;
                    averageScoreElement.textContent = productData.average_score
                      ? productData.average_score.toFixed(1)
                      : "0.0";
                    reviewCountElement.textContent = productData.reviews
                      ? `${Object.keys(productData.reviews).length}개의 리뷰`
                      : "0개의 리뷰";
                    productCategoryElement.textContent = largeCategory;

                    // Clear existing stars
                    starContainer.innerHTML = "";
                    const averageScore = productData.average_score
                      ? productData.average_score
                      : 0;

                    // Add filled stars
                    for (let i = 0; i < Math.floor(averageScore); i++) {
                      starContainer.innerHTML +=
                        '<i class="bi bi-star-fill text-warning"></i>';
                    }

                    // Add half star if necessary
                    if (averageScore % 1 !== 0) {
                      starContainer.innerHTML +=
                        '<i class="bi bi-star-half text-warning"></i>';
                    }

                    // Add empty stars
                    for (let i = Math.ceil(averageScore); i < 5; i++) {
                      starContainer.innerHTML +=
                        '<i class="bi bi-star text-muted"></i>';
                    }
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
        if (retries > 0) {
          setTimeout(() => fetchData(retries - 1), 3000);
        }
      });
  }

  // Open Quick View Modal
  window.openQuickView = function (
    imgUrl,
    productName,
    largeCategory,
    averageScore,
    summary
  ) {
    document.getElementById("quick-view-image").src = imgUrl;
    document.getElementById("quick-view-title").innerText = productName;
    document.getElementById("quick-view-category").innerText = largeCategory;
    document.getElementById("quick-view-average-score").innerText =
      averageScore.toFixed(1);
    document.getElementById("quick-view-summary").innerText = summary;
    // Update stars
    const starContainer = document.getElementById("quick-view-star-container");
    starContainer.innerHTML = getStarsHtml(averageScore);
  };

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

  fetchData();
});
