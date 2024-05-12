'use strict'

const express =require('express')
const { apiKey, permisson } = require('../auth/checkAuth')
const router = express.Router()

// x-api-key: 2301fed64d316e07037f6017a7b1456499bb59f92bca36051273bc21a43f47af0f1d61860ef77ef3a2010bce1e258c64d21e2e873f0ff5c8698f707d10a993f7
// // check apiKey
// router.use(apiKey)

// // check permisson
// router.use(permisson('0000'))

router.use('/v1/api', require('./access'))

module.exports = router