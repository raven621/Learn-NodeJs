require('dotenv').config()
const express = require('express')
const app = express()
// morgan la thu vien in ra cac log khi nguoi dung chay 1 request
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')

// init middlewares
app.use(morgan("dev"))
app. use(helmet())
app.use(compression())

// init db
require('./dbs/init.mongodb')
// const {checkOverload} = require('./helpers/check.connect')
// checkOverload()

// init routes
app.get('/', (req, res, next)=> {
    return res.status(200).json({message: 'Welcome!'})
})

// handling error

module.exports = app