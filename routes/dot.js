const router = require('express').Router()
const ctrl = require('../controllers')


router.post('/', ctrl.dot.searchDOT);


module.exports = router;