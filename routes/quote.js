const router = require('express').Router()
const ctrl = require('../controllers')


router.post('/', ctrl.quote.generateQuote);


module.exports = router;