'use strict'

const keytokenModel = require("../models/keytoken.model")
const { Types } = require('mongoose')
class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
            try{
                // const tokens = await keytokenModel.create({
                //     user: userId,
                //     privateKey,
                //     publicKey,
                // })
                // return tokens ? tokens.publicKey : null
                const filter = {user: userId}
                const update = {
                    publicKey, 
                    privateKey, 
                    refreshTokenUsed: [], 
                    refreshToken
                }
                const options = {
                    upsert: true,
                    new: true
                }

                const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

                return tokens ? tokens.publicKey : null
            }catch(error){
                return error
            }
    }

    static findByUserId = async (userId) => {
        const id = new Types.ObjectId(userId)
        return await keytokenModel.findOne({ user: id })

    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne(id)
    }

    static findByRefreshTokensUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken})
    }

    static deleteKeyById = async (userId) => {
        const id = new Types.ObjectId(userId)
        return await keytokenModel.deleteOne({user: id})
    }
}

module.exports = KeyTokenService