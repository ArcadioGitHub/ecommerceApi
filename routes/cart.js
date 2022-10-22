const { createCart, updateCartById, deleteCartById, getCartById, getCartByUserId, getAllCarts } = require("../controllers/cartController");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const { validate } = require("../helpers/validator");


//CREATE CART
router.post("/", validate('CreateCart'), verifyToken, createCart);

//UPDATE CART
router.put("/updateCart/:id", verifyTokenAndAuthorization, updateCartById);

//DELETE CART
router.delete("/deleteCart/:id", verifyTokenAndAuthorization, deleteCartById);

//GET CART BY USER ID
router.get("/getCart/:userId", verifyTokenAndAuthorization, getCartByUserId);

//GET ALL CARTS
router.get("/", verifyTokenAndAdmin, getAllCarts);

module.exports = router;
