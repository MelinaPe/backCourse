class ProductDTO {
    constructor({ _id, title, description, price, code, stock, status, category, quantity }) {
        this._id = _id; 
        this.title = title;
        this.description = description;
        this.price = price;
        this.code = code;
        this.stock = stock;
        this.status = status;
        this.category = category;
        this.quantity = quantity;
    }
}

module.exports = ProductDTO;