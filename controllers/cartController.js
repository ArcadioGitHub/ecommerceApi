const Cart = require("../models/Cart");
const status = require('http-status');
const { validationResult } = require('express-validator');

const createCart = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(status.BAD_REQUEST).json(errorArray[errorArray.length - 1]);
    } else {
        const newCart = new Cart(req.body);

        try {
            const savedCart = await newCart.save();
            res.status(status.CREATED).json(savedCart);
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

const updateCartById = async (req, res) => {

    if (req.params.id == ':id') {
        res.status(status.BAD_REQUEST).json({ error: "The ID parameter is mandatory to update an existing cart" });
    } else if (await Cart.findByIdAndUpdate(req.params.id) == null) {
        res.status(status.BAD_REQUEST).json({ error: "The cart you are looking for, does not exist" });
    } else {
        try {
            const updateCart = await Cart.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true }
            );
            res.status(status.OK).json(updateCart);
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err);
        }
    }
}

const deleteCartById = async (req, res) => {

    if (req.params.id == ':id') {
        res.status(status.BAD_REQUEST).json({ error: "The ID parameter is mandatory to delete a cart" });
    } else if (await Cart.findByIdAndDelete(req.params.id) == null) {
        res.status(status.BAD_REQUEST).json({ error: "The cart you are looking for, does not exist" });
    } else {
        try {
            await Cart.findByIdAndDelete(req.params.id);
            res.status(status.OK).json({ message: "Cart has been successfully deleted" })
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err)
        }
    }
}

const getCartByUserId = async (req, res) => {

    if (req.params.id == ':id') {
        res.status(status.BAD_REQUEST).json({ error: "The ID parameter is mandatory to get a cart" });
    } else if (await Cart.findOne({userId: req.params.userId}) == null) {
        res.status(status.BAD_REQUEST).json({ error: "The cart you are looking for, does not exist" });
    } else {
        try {
            const cart = await Cart.findOne({userId: req.params.userId});
            res.status(status.OK).json(cart._doc);
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err)
        }
    }
}

const getAllCarts = async (req, res) => {

    try {
        const carts = await Cart.find();
        if (carts.length == 0) {
            res.status(status.OK).json({ message: "There are no carts in the Database yet" });
        } else {
            res.status(status.OK).json(carts);
        }
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(err)
    }
}
module.exports = { createCart, updateCartById, deleteCartById, getCartByUserId, getAllCarts };
