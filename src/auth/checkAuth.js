'use strict'

const { HEADER } =  require("../constant/header.constant")
const { findById } = require("../services/apikey.service")

const apiKey = async (req, res, next) => {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        // check objKey
        const objKey = await findById(key)
        if(!objKey){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey
        return next()
}

const permisson = (permisson) => {
    return (req, res, next) => {
        if(!req.objKey.permissons){
            return res.status(403).json({
                message: 'Permisson Denied'
            })
        }

        const validPermisson = req.objKey.permissons.includes(permisson)
        if(!validPermisson){
            return res.status(403).json({
                message: 'Permisson Denied'
            })
        }

        return next()
    }
}

module.exports = {
    apiKey,
    permisson
}