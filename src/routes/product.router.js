const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController();

router.get("/", productController.getProducts.bind(productController));
router.get("/:id", productController.getProductById.bind(productController));
router.post("/", productController.createProduct.bind(productController));
router.put("/:id", productController.updateProduct.bind(productController));
router.delete("/:id", productController.deleteProduct.bind(productController));

module.exports = router;