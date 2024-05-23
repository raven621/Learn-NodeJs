'use strict'

const { OK, CREATE, SuccessResponse} = require("../core/success.response");
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
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
}

module.exports = new AccessController()