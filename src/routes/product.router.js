const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController();
const authorize = require("../middlewares/authorization.js"); 
const generateMockProducts = require("../mocking.js"); 

// Mocking Endpoint
router.get("/mockingproducts", (req, res) => {
    try {
        const mockProducts = generateMockProducts(100);
        res.status(200).json({ status: "success", data: mockProducts });
    } catch (error) {
        console.error("Error generating mock products:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.get("/", productController.getProducts.bind(productController));
router.get("/:id", productController.getProductById.bind(productController));
router.post("/", authorize(['admin']), productController.createProduct.bind(productController));
router.put("/:id", authorize(['admin']), productController.updateProduct.bind(productController));
router.delete("/:id", authorize(['admin']), productController.deleteProduct.bind(productController));


module.exports = router;