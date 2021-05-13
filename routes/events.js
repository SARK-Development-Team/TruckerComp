const router = require('express').Router()
const ctrl = require('../controllers')


router.post('/requestDoc', ctrl.events.requestDoc);
router.post('/requestSig', ctrl.events.requestSig);
router.post('/requestInfo', ctrl.events.requestInfo);


module.exports = router;