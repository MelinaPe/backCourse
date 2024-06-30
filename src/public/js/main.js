const socket = io(); 


document.addEventListener("DOMContentLoaded", async function() {
  try {
      const response = await fetch("/api/products");
      if (!response.ok) {
          throw new Error("Failed to fetch products");
      }

      const productsData = await response.json();
      renderProducts(productsData.payload);
      renderPagination(productsData);

      const cartId = "66336f188428ce2a6b2b1ae0";

      const cartResponse = await fetch(`/api/carts/${cartId}`);
      if (!cartResponse.ok) {
          throw new Error("Failed to fetch cart");
      }

      const cartData = await cartResponse.json();
      renderCart(cartData);
  } catch (error) {
      console.error("Error:", error);
  }
});

function renderProducts(products) {
  const container = document.querySelector(".cards");
  container.innerHTML = "";

  products.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("card");

      const title = document.createElement("p");
      title.textContent = product.title;
      card.appendChild(title);

      const description = document.createElement("p");
      description.textContent = product.description;
      card.appendChild(description);

      const price = document.createElement("p");
      price.textContent = `Price: €${product.price}`;
      card.appendChild(price);

      const stock = document.createElement("p");
      stock.textContent = `Stock: ${product.stock}`;
      card.appendChild(stock);

      const category = document.createElement("p");
      category.textContent = `Category: ${product.category}`;
      card.appendChild(category);

      const addToCartButton = document.createElement("button");
      addToCartButton.textContent = "Add to Cart";
      addToCartButton.addEventListener("click", function() {
          addToCart(product._id);
      });
      card.appendChild(addToCartButton);

      container.appendChild(card);
  });
}

function renderPagination(data) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const prevButton = document.createElement("a");
  prevButton.href = data.prevLink || "#";
  prevButton.textContent = "Previous";
  paginationContainer.appendChild(prevButton);

  const nextButton = document.createElement("a");
  nextButton.href = data.nextLink || "#";
  nextButton.textContent = "Next";
  paginationContainer.appendChild(nextButton);

  prevButton.addEventListener("click", function(event) {
      event.preventDefault();
      if (data.hasPrevPage) {
          loadProducts(data.prevPage);
      }
  });

  nextButton.addEventListener("click", function(event) {
      event.preventDefault();
      if (data.hasNextPage) {
          loadProducts(data.nextPage);
      }
  });
}

async function loadProducts(page = 1) {
  try {
      const response = await fetch(`/api/products?page=${page}`);
      if (!response.ok) {
          throw new Error("Failed to fetch products");
      }

      const productsData = await response.json();
      renderProducts(productsData.payload);
      renderPagination(productsData);
  } catch (error) {
      console.error("Error:", error);
  }
}

async function addToCart(productId) {
  try {
      const cartId = "66336f188428ce2a6b2b1ae0";
      console.log(`Adding product ${productId} to cart ${cartId}`);
      const response = await fetch(`/api/carts/${cartId}/addProduct/${productId}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          }
      });
      if (!response.ok) {
          throw new Error("Failed to add product to cart");
      }
      console.log("Product added to cart successfully");
  } catch (error) {
      console.error("Error:", error);
  }
}

function renderCart(cartData) {
  const container = document.querySelector(".cart-container");
  container.innerHTML = "";

  const cartTitle = document.createElement("h2");
  cartTitle.textContent = "Cart";
  container.appendChild(cartTitle);

  const productList = document.createElement("ul");
  container.appendChild(productList);

  if (cartData.data.products.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No products in the cart";
      container.appendChild(emptyMessage);
  } else {
      cartData.data.products.forEach(item => {
          const productItem = document.createElement("li");
          productItem.textContent = `${item.title} - ${item.price}`;
          productList.appendChild(productItem);
      });
  }
}

