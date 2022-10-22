const User = require("../models/User");
const CryptoJS = require("crypto-js");
const status = require('http-status');
const { validationResult } = require('express-validator');

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
        try {
            const savedUser = await newUser.save();
            res.status(status.CREATED).json(savedUser);
        } catch (err) {
            if (err && err.code === 11000) {
                res.status(status.BAD_REQUEST).json({
                    error: "duplicatedKey",
                    message: "duplicated keys are not allowed, please update the duplicated ones.",
                    status: err.code,
                    duplicatedKeys: err.keyValue
                });
                return;
            } else {
                res.status(status.INTERNAL_SERVER_ERROR).json(err);
            }
        }
    }
}

const updateUser = async (req, res) => {

    if (req.params.id == ':id') {
        res.status(status.BAD_REQUEST).json({ error: "The ID parameter is mandatory to update an existing user" });
    } else if (await User.findByIdAndUpdate(req.params.id) == null) {
        res.status(status.BAD_REQUEST).json({ error: "The user you are looking for, does not exist" });
    } else {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.USER_PASS).toString();
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true }
            );
            res.status(status.OK).json(updatedUser);
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err);
        }
    }
}

const deleteUser = async (req, res) => {

    if (req.params.id == ':id') {
        res.status(status.BAD_REQUEST).json({ error: "The ID parameter is mandatory to delete a user" });
    } else if (await User.findByIdAndDelete(req.params.id) == null) {
        res.status(status.BAD_REQUEST).json({ error: "The user you are looking for, does not exist" });
    } else {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(status.OK).json({ message: "User has been successfully deleted" })
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err)
        }
    }
}

const getUserById = async (req, res) => {

    if (req.params.id == ':id') {
        res.status(status.BAD_REQUEST).json({ error: "The ID parameter is mandatory to get a user" });
    } else if (await User.findById(req.params.id) == null) {
        res.status(status.BAD_REQUEST).json({ error: "The user you are looking for, does not exist" });
    } else {
        try {
            const user = await User.findById(req.params.id);
            const { password, ...others } = user._doc;
            res.status(status.OK).json({ ...others });
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err)
        }
    }
}

const getAllUsers = async (req, res) => {

    try {
        const users = await User.find();
        if (users.length == 0) {
            res.status(status.OK).json({ message: "There are no users in the Database yet" });
        } else {
            res.status(status.OK).json(users);
        }
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(err)
    }
}

const getUserStats = async (req, res) => {

    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            {
                $match: { createdAt: { $gte: lastYear } }
            },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            { $group: { _id: "$month", total: { $sum: 1 } } }
        ]);
        res.status(status.OK).json(data);
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(err)
    }
}
module.exports = { createUser, updateUser, deleteUser, getUserById, getAllUsers, getUserStats };
