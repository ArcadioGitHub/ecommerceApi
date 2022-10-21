const User = require("../models/User");
const {verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const status = require('http-status');
const router = require("express").Router();

//UPDATE

router.put("/updateUser/:id", verifyTokenAndAuthorization , async (req, res) => {
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.USER_PASS).toString();
    }
   
    try{
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }, {new:true}
      );
      res.status(status.OK).json(updatedUser); 
    } catch (err){
        res.status(500).json(err)
    }
})

// DELETE

router.delete("/deleteUser/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(status.OK).json("User has been successfully deleted")
    } catch(err){
        res.status(500).json(err)
    }
})

//GET

router.get("/getUser/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(status.OK).json({...others});
    } catch(err){
        res.status(500).json(err)
    }
})

// GET ALL USERS

router.get("/getUsers", verifyTokenAndAdmin, async (req, res) => {
    try{
        const users = await User.find();
        res.status(status.OK).json(users);
    } catch(err){
        res.status(500).json(err)
    }
})

// GET USERS STATS

router.get("/getUsersStats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try{
        const data = await User.aggregate([
            {
                $match: {createdAt: {$gte: lastYear}}},
                {$project: {
                    month: {$month: "$createdAt"}}},
                {$group: {_id: "$month", total: {$sum: 1}}}
        ]);
        res.status(status.OK).json(data);
    } catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;

