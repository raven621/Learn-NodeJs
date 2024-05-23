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
            message: 'Login Success!',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Success!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    handleRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Get token Success!',
        //     metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        // }).send(res)

        //v2 fixed
        new SuccessResponse({
            message: 'Get token Success!',
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }
}

module.exports = new AccessController()