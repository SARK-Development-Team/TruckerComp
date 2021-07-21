const router = require('express').Router()
const ctrl = require('../controllers')


router.post('/', ctrl.logging.logError);


module.exports = router;