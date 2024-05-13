'use strict'

const { OK, CREATE } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    signUp = async (req, res, next) => {
        // return res.status(200).json({
        //     message: '',
        //     metadata:
        // })
        // return res.status(201).json(await AccessService.signUp(req.body))
        new CREATE({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
}

module.exports = new AccessController()