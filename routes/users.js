const router = require('express').Router()
const ctrl = require('../controllers')

router.get('/login', ctrl.users.renderLogin);
router.post('/login', ctrl.users.loginUser);
router.get('/register', ctrl.users.renderRegister);
router.post('/register', ctrl.users.registerUser);
router.get('/logout', ctrl.users.logoutUser);
router.get('/dashboard', ctrl.users.openDashboard);
router.get('/profile', ctrl.users.viewProfile);
router.post('/update', ctrl.users.updateUser);
router.post('/azureSearch', ctrl.users.azureSearch);
router.post('/mongoSearch', ctrl.users.mongoSearch);
router.get('/previous-policies', ctrl.users.showPreviousPolicies);
router.get('/documents', ctrl.users.showDocuments);
router.get('/application', ctrl.users.showApplication);
router.get('/new-policy', ctrl.users.initiateNewPolicy);


module.exports = router;

