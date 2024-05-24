'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData, createKeyPair } = require("../utils")
const {RoleShop} = require('../constant/access.constant')
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")

class AccessService {

    static handlerRefreshTokenV2 = async ({refreshToken, user, keyStore}) => {
        const {userId, email} = user

        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something went wrong !! Please relogin') 
        }

        if(keyStore.refreshToken !== refreshToken){
            throw new AuthFailureError('Shop not registered')
        }

        const foundShop = await findByEmail({email})
        if(!foundShop){
            throw new AuthFailureError('Shop not registered')
        }

        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)

        await keyStore.updateOne({
                $set:{
                    refreshToken: tokens.refreshToken
                },
                $addToSet:{
                    refreshTokensUsed: refreshToken
                }
        })
        
        return {
            user: {userId, email},
            tokens
        }
    }

    static handlerRefreshToken = async (refreshToken) => {
        // check token used ??
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        // exist
        if(foundToken){
            // decode User
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
            // console.log({userId, email})
            // delete key
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something went wrong !! Please relogin')
        }
        // not exist
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        // console.log({holderToken})
        if(!holderToken){
            throw new AuthFailureError('Shop not registered')
        }

        // verifyToken
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)

        // check Userid
        const foundShop = await findByEmail({email})
        if(!foundShop){
            throw new AuthFailureError('Shop not registered')
        }

        // create new token pair
        const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey)

        // update token
        await holderToken.updateOne({
            $set:{
                refreshToken: tokens.refreshToken
            },
            $addToSet:{
                refreshTokenUsed: refreshToken
            }
        })

        return {
            user: {userId, email},
            tokens
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
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

        await KeyTokenService.createKeyToken({
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

                const keyStore = await KeyTokenService.createKeyToken({
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