const router = require('express').Router()
const ctrl = require('../controllers')


router.post('/', ctrl.send.generateEmail);


module.exports = router;