const Product = require("../models/Products");
const status = require('http-status');
const { validationResult } = require('express-validator');


const createProduct = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        return res.status(status.BAD_REQUEST).json(errorArray[errorArray.length - 1]);
    } else {
        const newProduct = new Product(req.body);

        try {
            const savedProduct = await newProduct.save();
            res.status(status.CREATED).json(savedProduct);
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

const updateProduct = async (req, res) => {

    if (req.params.id == ':id') {
        res.status(status.BAD_REQUEST).json({ error: "The ID parameter is mandatory to update an existing product" });
    } else if (await Product.findByIdAndUpdate(req.params.id) == null) {
        res.status(status.BAD_REQUEST).json({ error: "The product you are looking for, does not exist" });
    } else {
        try {
            const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true }
            );
            res.status(status.OK).json(updateProduct);
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err);
        }
    }
}

const deleteProduct = async (req, res) => {

    if (req.params.id == ':id') {
        res.status(status.BAD_REQUEST).json({ error: "The ID parameter is mandatory to delete a product" });
    } else if (await Product.findByIdAndDelete(req.params.id) == null) {
        res.status(status.BAD_REQUEST).json({ error: "The product you are looking for, does not exist" });
    } else {
        try {
            await Product.findByIdAndDelete(req.params.id);
            res.status(status.OK).json({ message: "Product has been successfully deleted" })
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err)
        }
    }
}

const getProductById = async (req, res) => {

    if (req.params.id == ':id') {
        res.status(status.BAD_REQUEST).json({ error: "The ID parameter is mandatory to get a product" });
    } else if (await Product.findById(req.params.id) == null) {
        res.status(status.BAD_REQUEST).json({ error: "The product you are looking for, does not exist" });
    } else {
        try {
            const product = await Product.findById(req.params.id);
            res.status(status.OK).json(product._doc);
        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json(err)
        }
    }
}

const getAllProducts = async (req, res) => {

    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products = await Product.find();
        if (products.length == 0) {
            res.status(status.OK).json({ message: "There are no products in the Database yet" });
        } else if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                }
            })
        } else {
            products = await Product.find();
        }
        res.status(status.OK).json(products);
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(err)
    }
}
module.exports = { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts };
