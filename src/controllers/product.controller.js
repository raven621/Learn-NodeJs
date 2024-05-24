'use strict'

const { CREATE } = require("../core/success.response")
const ProductService = require("../services/product.service")

class ProductController{
    createProduct = async (req, res, next) => {
       new CREATE({
        message: 'Create new product success',
        metadata: await ProductService.createProduct(req.body.product_type, req.body)
       }).send(res)
    }
}

module.exports = new ProductController()