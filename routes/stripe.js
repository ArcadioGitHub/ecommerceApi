const { createPayment } = require("../controllers/stripeController");
const router = require("express").Router();

//CREATE PAYMENT
router.post("/payment", createPayment)

module.exports = router;