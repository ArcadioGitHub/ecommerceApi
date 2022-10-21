const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const status = require('http-status');
const { validationResult } = require('express-validator/check');

const login = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(status.BAD_REQUEST).json(errorArray[1]);
    } else {
        try {
            const user = await User.findOne({ userName: req.body.userName });
            if(!user){
                res.status(status.UNAUTHORIZED).json({ error: "invalid credentials" });
            } else {
                const hashedPass = CryptoJS.AES.decrypt(user.password, process.env.USER_PASS);
                const originalPassword = hashedPass.toString(CryptoJS.enc.Utf8);
                if(originalPassword !== req.body.password) {
                    res.status(status.UNAUTHORIZED).json({ error: "invalid credentials" });
                } else {
                    const accessToken = jwt.sign({
                        id: user._id,
                        isAdmin: user.isAdmin,
                    }, process.env.JWT_SEC_KEY,
                        { expiresIn: "1d" }
                    )
                    const { password, ...others } = user._doc;
                    res.status(status.OK).json({ ...others, accessToken });
                }
            }
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err);
        }
    }
}

module.exports = { login };