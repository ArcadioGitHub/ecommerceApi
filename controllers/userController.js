const User = require("../models/User");
const CryptoJS = require("crypto-js");
const status = require('http-status');
const { validationResult} = require('express-validator');

const createUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(status.BAD_REQUEST).json(errorArray[errorArray.length - 1]);
    } else {
        const newUser = new User({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.USER_PASS).toString(),
        });
        try{
            const savedUser = await newUser.save();
            res.status(status.CREATED).json(savedUser);
            res.end();
        } catch(err){
            if ( err && err.code === 11000 ) {
                console.log(err)
                res.status(status.BAD_REQUEST).json({
                    error: "duplicatedKey",
                    message: "duplicated keys are not allowed, please update the duplicated ones.",
                    status: err.code,
                    duplicatedKeys: err.keyValue});
                return;
              } else {
                res.status(status.INTERNAL_SERVER_ERROR).json(err);
              }
        }  
    }
}

module.exports = {createUser};
