const router = require('express').Router()
const ctrl = require('../controllers')


router.get('/', (req, res) => {
    res.render('contact');   
});
router.post('/', ctrl.contact.sendContactInfo);


module.exports = router;