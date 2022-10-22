const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const { updateUser, deleteUser, getUserById, getAllUsers, getUserStats } = require("../controllers/userController");
const router = require("express").Router();

//UPDATE
router.put("/updateUser/:id", verifyTokenAndAuthorization, updateUser);

//DELETE
router.delete("/deleteUser/:id", verifyTokenAndAuthorization, deleteUser);

//GET
router.get("/getUser/:id", verifyTokenAndAdmin, getUserById);

//GET ALL USERS
router.get("/getUsers", verifyTokenAndAdmin, getAllUsers);

//GET USERS STATS
router.get("/getUsersStats", verifyTokenAndAdmin, getUserStats);

module.exports = router;

