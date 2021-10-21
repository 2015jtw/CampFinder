const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const wrapAsync = require('../utility/wrapAsync');
const passport = require('passport');

// require user controller
const userController = require('../controllers/user')

router.get('/register', userController.renderRegister)

router.post('/register', wrapAsync(userController.register))


router.get('/login', userController.renderLogin)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.login)

// // route for registering user --> logic above
// app.get('/fakeuser', async (req, res) => {
//     const user = new User({ email: 'josh@gmail.com', username: 'joshy' });
//     // .register takes instance of user, and given password and stores it, and hashes it
//     const registeredUser = await User.register(user, 'dog');
//     res.send(registeredUser);
// })

router.get('/logout', userController.logout)

module.exports = router;