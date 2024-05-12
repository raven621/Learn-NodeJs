'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const keyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const {RoleShop} = require('../constant/access.constant')

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            //step1: check email exits??
            const holderShop = await shopModel.findOne({email}).lean()

            if(holderShop){
                return {
                    code: 'xxx',
                    message: 'Shop already registered!'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles:[RoleShop.SHOP]
            })

            if(newShop){
                // create privateKey, publicKey
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                const keyStore = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!keyStore){
                    return {
                        code: "xxx",
                        message: "keyStore error"
                    }
                }

                // created token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                console.log(`Create Token Success::`, tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields:['_id', 'name', 'email'], object:newShop}),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }

        }catch(error){
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService