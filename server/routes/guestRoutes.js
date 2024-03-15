const express     = require('express'),
    router        = express.Router(),
    controller    = require('../controllers/guestController.js');

//findAllGuests
//router.get('/', controller.findAllUsers);

//addGuest
router.post('/addGuest', controller.addGuest);

//remove
router.post('/remove', controller.delete);

//login
router.post('/login', controller.login);

//verifyToken
router.post('/verifyToken', controller.verifyToken);

//addItemToCart
router.post('/addItem', controller.addItemToCart);

//removeItemFromCart
router.post('/deleteCartItem', controller.removeItemFromCart);

//clearCart
router.post('/clear', controller.clearCart);

//getCart
//router.post('/getCart', controller.getCart);

//email test
router.post('/sendEmail', controller.sendEmail)

module.exports = router;