const { createOrder, updateOrder, deleteOrder, getOrdersByUserId, getMonthlyIncome } = require("../controllers/orderController");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const { validate } = require("../helpers/validator");


//CREATE ORDER
router.post("/", validate('CreateOrder'), verifyTokenAndAuthorization, createOrder);

//UPDATE ORDER
router.put("/updateOrder/:id", verifyTokenAndAdmin, updateOrder);

//DELETE ORDER
router.delete("/deleteOrder/:id", verifyTokenAndAdmin, deleteOrder);

//GET ORDER BY USER ID
router.get("/getOrder/:userId", verifyTokenAndAdmin, getOrdersByUserId);

//GET MONTHLY INCOME
router.get("/getMonthlyIncome", verifyTokenAndAdmin, getMonthlyIncome);

module.exports = router;