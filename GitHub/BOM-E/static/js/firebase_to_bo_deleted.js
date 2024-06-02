// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBL81L7S_mIG81ZFUrLxug838h5UfDY5Kg",
  authDomain: "bome-81111.firebaseapp.com",
  databaseURL: "https://bome-81111-default-rtdb.firebaseio.com",
  projectId: "bome-81111",
  storageBucket: "bome-81111.appspot.com",
  messagingSenderId: "729263180479",
  appId: "1:729263180479:web:6a4fe6ee6e12bf370e140a",
  measurementId: "G-DCD6L2QM2G",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.realtime();
const storage = firebase.storage();

// Firestore에서 데이터 가져오기
function loadProducts() {
  db.collection("categories")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const productList = document.getElementById("product-list");

        data.products.forEach((product) => {
          const productDiv = document.createElement("div");
          const productName = document.createElement("h3");
          productName.textContent = product.name;

          const productImage = document.createElement("img");
          storage
            .ref(product.image)
            .getDownloadURL()
            .then((url) => {
              productImage.src = url;
            });

          productDiv.appendChild(productName);
          productDiv.appendChild(productImage);
          productList.appendChild(productDiv);
        });
      });
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
}
