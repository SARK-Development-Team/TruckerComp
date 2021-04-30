const router = require('express').Router()
const ctrl = require('../controllers')


router.post('/', ctrl.purchase.purchasePolicy);


module.exports = router;