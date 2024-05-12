'use strict'

const keytokenModel = require("../models/keytoken.model")

class keyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey}) => {
            const tokens = await keytokenModel.create({
                user: userId,
                privateKey,
                publicKey,
            })
            return tokens ? tokens.publicKey : null
    }
}

module.exports = keyTokenService