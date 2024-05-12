'use strict'

const express =require('express')
const { apiKey, permisson } = require('../auth/checkAuth')
const router = express.Router()

// check apiKey
router.use(apiKey)

// check permisson
router.use(permisson('0000'))

router.use('/v1/api', require('./access'))

module.exports = router