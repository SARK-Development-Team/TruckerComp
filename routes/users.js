const router = require('express').Router()
const ctrl = require('../controllers')

router.get('/login', ctrl.users.renderLogin);
router.post('/login', ctrl.users.loginUser);
router.get('/register', ctrl.users.renderRegister);
router.post('/register', ctrl.users.registerUser);
router.get('/logout', ctrl.users.logoutUser);
router.get('/dashboard', ctrl.users.openDashboard);


module.exports = router;

