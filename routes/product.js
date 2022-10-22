const { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts } = require("../controllers/productsController");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const { validate } = require("../helpers/validator");


//CREATE PRODUCT
router.post("/", validate('CreateProduct'), verifyTokenAndAdmin, createProduct);

//UPDATE PRODUCT
router.put("/updateProduct/:id", verifyTokenAndAdmin, updateProduct);

//DELETE PRODUCT
router.delete("/deleteProduct/:id", verifyTokenAndAdmin, deleteProduct);

//GET PRODUCT
router.get("/getProduct/:id", getProductById);

//GET ALL PRODUCTS
router.get("/getAllProducts", getAllProducts);

module.exports = router;