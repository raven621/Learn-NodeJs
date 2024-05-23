'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const keyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData, createKeyPair } = require("../utils")
const {RoleShop} = require('../constant/access.constant')
const { BadRequestError, AuthFailureError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")

class AccessService {

    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id)
        // console.log(delKey)
        return delKey
    }

    static login = async ({email, password, refreshToken = null}) => {
        const foundShop = await findByEmail({email})
        if(!foundShop){
            throw new BadRequestError('Error: Shop not registered!')
        }
        const match = bcrypt.compare(password, foundShop.password)
        if(!match){
            throw new AuthFailureError('Error: Authentication error!')
        }

        const {privateKey, publicKey} = createKeyPair()

        const {_id : userId} = foundShop

        const tokens = await createTokenPair({userId, email}, publicKey, privateKey)
        // console.log(`Create Token Success::`, tokens)

        await keyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId
        })

        return {
                    shop: getInfoData({fields:['_id', 'name', 'email'], object:foundShop}),
                    tokens
                }

    }

    static signUp = async ({name, email, password}) => {
            //step1: check email exits??
            const holderShop = await findByEmail({email})

            if(holderShop){
                throw new BadRequestError('Error: Shop already registered!')
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles:[RoleShop.SHOP]
            })

            if(newShop){
                // create privateKey, publicKey
                const {privateKey, publicKey} = createKeyPair()

                // created token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                // console.log(`Create Token Success::`, tokens);

                const keyStore = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                    refreshToken: tokens.refreshToken
                })

                if(!keyStore){
                    throw new BadRequestError('Error: keyStore error!')
                    // return {
                    //     code: "xxx",
                    //     message: "keyStore error"
                    // }
                }

                return {
                    shop: getInfoData({fields:['_id', 'name', 'email'], object:newShop}),
                    tokens
                }
            }

            return {
                code: 200,
                metadata: null
            }
    }
}

module.exports = AccessService