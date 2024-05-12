'use strict'

const {ReasonPhrases, StatusCodes } = require("../constant/httpStatusCode/httpStatusCode")

class ErrorResponse extends Error {
    constructor(message, status){
        super(message)
        this.status = status
    }
}

class ConflicRequestError extends ErrorResponse{
    constructor(message = ReasonPhrases.ConflicRequestError, statusCode = StatusCodes.FORBIDDEN){
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse{
    constructor(message = ReasonPhrases.BadRequestError, statusCode = StatusCodes.BAD_REQUEST) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflicRequestError,
    BadRequestError,
}