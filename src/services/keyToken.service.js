'use strict'

const keytokenModel = require("../models/keytoken.model")

class keyTokenService {
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
}

module.exports = keyTokenService