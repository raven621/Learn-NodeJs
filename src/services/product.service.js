'use strict'

const { BadRequestError } = require("../core/error.response")
const {product, clothing, electronic, furniture} = require("../models/product.model")

// define Factory class to create product
class ProductFactory {
    /**
     * type : 'Clothing',
     * payload
     */
    static async createProduct(type, payload){
        switch(type){
            case 'Electronic':
                return new Electronic(payload).createProduct()
            case 'Furniture':
                return new Furniture(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError(`Error:: Invalid product type ${type}`)
        }
    }
}

// define base product class 
class Product {
    constructor({product_name, product_thumb, product_description,
        product_price, product_quantity, product_type, product_shop, product_attributes
    }){
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create new Product
    async createProduct(product_id){
        return await product.create({...this, _id: product_id})
    }
}

// define sub-class for different product type = clothing
class Clothing extends Product{
    async createProduct(){
        let newClothing
        try{
            newClothing = await clothing.create({...this.product_attributes, product_shop: this.product_shop})
            if(!newClothing) throw new BadRequestError('Error:: Create new clothing failed')
            
            const newProduct = await super.createProduct(newClothing._id)
            if(!newProduct) throw new BadRequestError('Error:: Create new product failed')
        
            return newProduct
        }catch(error){
            if (newClothing) {
                await clothing.deleteOne({ _id: newClothing._id })
            }
            throw error
        }
    }
}

// define sub-class for different product type = electronic
class Electronic extends Product{
    async createProduct(){
        let newElectronic
        try{
            newElectronic = await electronic.create({...this.product_attributes, product_shop: this.product_shop})
            if(!newElectronic) throw new BadRequestError('Error:: Create new electronic failed')
            
            const newProduct = await super.createProduct(newElectronic._id)
            if(!newProduct) throw new BadRequestError('Error:: Create new product failed')
            
            return newProduct
        }catch(error){
            if (newElectronic) {
                await electronic.deleteOne({ _id: newElectronic._id })
            }
            throw error
        }
    }
}

// define sub-class for different product type = furniture
class Furniture extends Product{
    async createProduct(){
        let newFurniture
        try{
            newFurniture = await furniture.create({...this.product_attributes, product_shop: this.product_shop})
            if(!newFurniture) throw new BadRequestError('Error:: Create new furniture failed')
            
            const newProduct = await super.createProduct(newFurniture._id)
            if(!newProduct) throw new BadRequestError('Error:: Create new product failed')
            
            return newProduct
        }catch(error){
            if (newFurniture) {
                await furniture.deleteOne({ _id: newFurniture._id })
            }
            throw error
        }
    }
}

module.exports = ProductFactory