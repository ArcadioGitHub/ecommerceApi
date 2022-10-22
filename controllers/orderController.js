const Order = require("../models/Order");
const status = require('http-status');
const { validationResult } = require('express-validator');

const createOrder = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(status.BAD_REQUEST).json(errorArray[errorArray.length - 1]);
    } else {
        const newOrder = new Order(req.body);

        try {
            const savedOrder = await newOrder.save();
            res.status(status.CREATED).json(savedOrder);
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

const updateOrder = async (req, res) => {

    if (req.params.id == ':id') {
        res.status(status.BAD_REQUEST).json({ error: "The ID parameter is mandatory to update an existing order" });
    } else if (await Order.findByIdAndUpdate(req.params.id) == null) {
        res.status(status.BAD_REQUEST).json({ error: "The order you are looking for, does not exist" });
    } else {
        try {
            const updateOrder = await Order.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true }
            );
            res.status(status.OK).json(updateOrder);
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err);
        }
    }
}

const deleteOrder = async (req, res) => {

    if (req.params.id == ':id') {
        res.status(status.BAD_REQUEST).json({ error: "The ID parameter is mandatory to delete a order" });
    } else if (await Order.findByIdAndDelete(req.params.id) == null) {
        res.status(status.BAD_REQUEST).json({ error: "The order you are looking for, does not exist" });
    } else {
        try {
            await Order.findByIdAndDelete(req.params.id);
            res.status(status.OK).json({ message: "Order has been successfully deleted" })
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err)
        }
    }
}

const getOrdersByUserId = async (req, res) => {

    if (req.params.id == ':id') {
        res.status(status.BAD_REQUEST).json({ error: "The ID parameter is mandatory to get a order" });
    } else if (await Order.find({userId: req.params.userId}) == null) {
        res.status(status.BAD_REQUEST).json({ error: "The order you are looking for, does not exist" });
    } else {
        try {
            const orders = await Order.find({userId: req.params.userId});
            res.status(status.OK).json(orders);
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err)
        }
    }
}


const getAllOrders = async (req, res) => {

    try {
        const orders = await Order.find();
        if (orders.length == 0) {
            res.status(status.OK).json({ message: "There are no orders in the Database yet" });
        } else {
            res.status(status.OK).json(orders);
        }
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(err)
    }
}

const getMonthlyIncome = async (req, res) => {

    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth - 1));

    try {
        const income = await Order.aggregate([
            {
                $match: { createdAt: { $gte: previousMonth } }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                }
            },
            { $group: { _id: "$month", total: { $sum: "$sales" } } }
        ]);
        res.status(status.OK).json(income);
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(err)
    }
}

module.exports = { createOrder, updateOrder, deleteOrder, getOrdersByUserId, getAllOrders, getMonthlyIncome };
