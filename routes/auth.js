const router = require("express").Router();
const { validate } = require("../helpers/validator");
const { createUser } = require("../controllers/userController");
const { login } = require("../controllers/authController")

//CREATE USER
router.post("/registerUser", validate('CreateUser'), createUser);
//LOGIN USER
router.post("/login", validate('Login'), login);

module.exports = router;