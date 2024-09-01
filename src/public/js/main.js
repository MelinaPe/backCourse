const socket = io(); 

document.addEventListener("DOMContentLoaded", async function() {
    try {
        const cartIdElement = document.getElementById('cartId');
        const cartId = cartIdElement ? cartIdElement.value : null;

        console.log("Cart ID in DOM:", cartId);

        if (!cartId) {
            console.error("Cart ID is missing or invalid.");
            return;
        }

        console.log("Cart ID loaded:", cartId);


        addLogoutButton();

        addViewCartButton(cartId);


        if (window.location.pathname.startsWith('/cart/')) {
            const viewCartButton = document.querySelector("button#viewCartButton");
            if (viewCartButton) viewCartButton.style.display = "none";
        }
        await fetchAndRenderProducts();

    } catch (error) {
        console.error("Error during DOMContentLoaded execution:", error);
    }
});


function addLogoutButton() {
    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.addEventListener("click", async function() {
        try {
            const response = await fetch('/logout', {
                method: 'POST'
            });
            if (response.ok) {

            } else {
                console.error("Failed to log out.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    });
    document.body.appendChild(logoutButton);
}

function addViewCartButton(cartId) {
    const viewCartButton = document.createElement("button");
    viewCartButton.id = "viewCartButton";  
    viewCartButton.textContent = "Check Cart";
    viewCartButton.addEventListener("click", function() {
        window.location.href = `/cart/${cartId}`; 
    });
    document.body.appendChild(viewCartButton);
}

async function fetchAndRenderProducts() {
    try {
        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const productsData = await response.json();
        renderProducts(productsData.payload);
        renderPagination(productsData);

    } catch (error) {
        console.error("Error fetching or rendering products:", error);
    }
}

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

        if (product._id) {
            const addToCartButton = document.createElement("button");
            addToCartButton.textContent = "Add to Cart";
            addToCartButton.addEventListener("click", function() {
                addToCart(product._id);  
            });
            card.appendChild(addToCartButton);
        } else {
            console.error("Product ID is missing for product:", product);
        }

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
        const cartIdElement = document.getElementById('cartId');
        const cartId = cartIdElement ? cartIdElement.value : null;

        if (!cartId) {
            throw new Error("Cart ID is missing or invalid.");
        }

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
        console.error("Error adding product to cart:", error);
    }
}

async function updateQuantity(productId, action) {
    try {
        const cartIdElement = document.getElementById('cartId');
        const cartId = cartIdElement ? cartIdElement.value : null;

        if (!cartId) {
            throw new Error("Cart ID is missing or invalid.");
        }

        console.log('Cart ID at updateQuantity:', cartId); 

        const quantityElement = document.getElementById(`quantity-${productId}`);
        let currentQuantity = parseInt(quantityElement.textContent);

        if (action === 'decrease' && currentQuantity > 1) {
            currentQuantity--;
        } else if (action === 'increase') {
            currentQuantity++;
        }

        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: currentQuantity })
        });

        if (response.ok) {
            quantityElement.textContent = currentQuantity;
            updateTotal(); 
        } else {
            console.error('Failed to update quantity');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

async function removeProduct(productId) {
    try {
        const cartIdElement = document.getElementById('cartId');
        const cartId = cartIdElement ? cartIdElement.value : null;

        if (!cartId) {
            throw new Error("Cart ID is missing or invalid.");
        }

        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            document.location.reload(true); 
        } else {
            console.error('Failed to remove product');
        }
    } catch (error) {
        console.error('Error removing product:', error);
    }
}

function updateTotal() {
    let total = 0;
    document.querySelectorAll('li').forEach(item => {
        const quantity = parseInt(item.querySelector('span[id^="quantity-"]').textContent);
        const price = parseFloat(item.querySelector('span[id^="price-"]').textContent);
        total += quantity * price;
    });
    document.getElementById('cart-total').textContent = total.toFixed(2);
}


async function clearCart() {
    try {
        const cartIdElement = document.getElementById('cartId');
        const cartId = cartIdElement ? cartIdElement.value : null;

        if (!cartId) {
            throw new Error("Cart ID is missing or invalid.");
        }

        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('All products removed from the cart');
            document.location.reload(true); 
        } else {
            console.error('Failed to clear the cart');
            alert('Failed to clear the cart. Please try again.');
        }
    } catch (error) {
        console.error('Error clearing the cart:', error);
    }
}

async function completePurchase() {
    try {
        const cartIdElement = document.getElementById('cartId');
        const cartId = cartIdElement ? cartIdElement.value : null;

        if (!cartId) {
            throw new Error("Cart ID is missing or invalid.");
        }

        const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST'
        });

        if (response.ok) {
            alert('Purchase completed successfully!');
            window.location.href = '/'; 
        } else {
            console.error('Failed to complete purchase');
            alert('Failed to complete purchase. Please try again.');
        }
    } catch (error) {
        console.error('Error completing purchase:', error);
        alert('An error occurred while completing the purchase.');
    }
}
