'use strict'

const {model, Schema} = require('mongoose')


const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description:{
        type: String
    },
    product_price:{
        type: Number,
        required: true,
    },
    product_quantity:{
        type: Number,
        required: true
    },
    product_type:{
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop:{
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes:{
        type: Schema.Types.Mixed,
        required: true
    }
},{
    collection: COLLECTION_NAME,
    timestamps: true
})

// define the product type = clothing

const clothingSchema = new Schema({
    brand: {type: String, required: true},
    size: {type: String},
    material: {type: String},
    product_shop:{
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
}, {
    collection: 'Clothes',
    timestamps: true
})

// define the product type = electronic
const electronicSchema = new Schema({
    manufacturer: {type: String, required: true},
    model: {type: String},
    color: {type: String},
    product_shop:{
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
}, {
    collection: 'Electronics',
    timestamps: true
})

// define the product type = furniture
const furnitureSchema = new Schema({
    manufacturer: {type: String, required: true},
    model: {type: String},
    color: {type: String},
    product_shop:{
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
}, {
    collection: 'Furniture',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronic', electronicSchema),
    clothing: model('Clothing', clothingSchema),
    furniture: model('Furniture', furnitureSchema)
}