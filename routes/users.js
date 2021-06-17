const router = require('express').Router()
const ctrl = require('../controllers')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/login', ctrl.users.renderLogin);
router.post('/login', ctrl.users.loginUser);
router.get('/register', ctrl.users.renderRegister);
router.post('/register', ctrl.users.registerUser);
router.get('/logout', ctrl.users.logoutUser);
router.get('/dashboard', ensureAuthenticated, ctrl.users.openDashboard);
router.get('/profile', ensureAuthenticated, ctrl.users.viewProfile);
router.post('/update', ctrl.users.updateUser);
router.post('/azureSearch', ctrl.users.azureSearch);
router.post('/mongoSearch', ctrl.users.mongoSearch);
router.get('/previous-policies', ensureAuthenticated, ctrl.users.showPreviousPolicies);
router.get('/documents', ensureAuthenticated, ctrl.users.showDocuments);
router.get('/application', ensureAuthenticated, ctrl.users.showApplication);
router.get('/new-policy', ensureAuthenticated, ctrl.users.initiateNewPolicy);


module.exports = router;

