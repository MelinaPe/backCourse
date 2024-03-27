const socket = io(); 

socket.on("products", (data) => {
    renderProducts(data); 
})



const renderProducts = (products) => {
    const productsContainer = document.getElementById("productsContainer"); 
    productsContainer.innerHTML = ""; 

    products.forEach(item => {
        const card = document.createElement("div"); 
        card.innerHTML = `
            <p> ID: ${item.id} </p>
            <p> Title: ${item.title} </p>
            <p> Description: ${item.description} </p>
            <p> Price: ${item.price} </p>
            <button> Remove Product </button>
        `

        card.style.border = "1px solid #ccc";
        card.style.borderRadius = "8px";
        card.style.padding = "10px";
        card.style.marginBottom = "20px";
        card.style.backgroundColor = "#f9f9f9";
        card.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";

        const button = card.querySelector("button");
        button.style.backgroundColor = "#007bff";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "4px";
        button.style.cursor = "pointer";
        button.style.padding = "5px 10px";
        button.addEventListener("click", () => {
            removeProduct(item.id);
        });

        productsContainer.appendChild(card);
    });
}



const removeProduct = (id) => {
    socket.emit("removeProduct", id); 
}


document.getElementById("btnSend").addEventListener("click", () => {
    addProduct(); 
})

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value, 
        status: document.getElementById("status").checked 
    }; 
    socket.emit("addProduct", product); 
}


