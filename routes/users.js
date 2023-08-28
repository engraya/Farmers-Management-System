const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');
const flash = require('connect-flash');
// User Model
const User = require('../models/User');

const { forwardAuthenticated } = require('../config/authConfig');

// Registration Page
router.get('/register', forwardAuthenticated, (request, response) => {
    response.render('register')
})

// Login Page
router.get('/login', forwardAuthenticated, (request, response) => {
    response.render('login')
})


// Register route
router.post('/register', (request, response) =>{
    const { name, email, password, password2 } = request.body
    let errors = []

    let requiredFieldsErrorMesaage = { message : 'Please Fill in all the required Fields'}
    let passwordMatchErrorMessage = { message : 'Passwords do not match'}
    let passwordLengthErrorMessage = { message : 'Password Length Should be Greater than 5 Characters'}
    let alreadyRegisteredEmailErrorMeesage = { message : 'Email already exist, try with another credential'}

    // Check equired Fileds
    if (!name || !email || !password || !password2) {
        errors.push(requiredFieldsErrorMesaage)
    }

    //Check for Password Match
    if (password !== password2) {
        errors.push(passwordMatchErrorMessage)
    }

    // Check for Password Length
    if (password.length < 5) {
        errors.push(passwordLengthErrorMessage)
    }

    if (errors.length > 0) {
        let context = { errors, name, email, password, password2}
        response.render('register', context)
    }
    else{
        // Passed Validation
        User.findOne({ email : email })
            .then(user => {
                if (user) {
                //User already exist
                errors.push(alreadyRegisteredEmailErrorMeesage)
                let context = { errors, name, email, password, password2}
                response.render('register', context)
                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //Hash User password
                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //Set User Password to hashed
                            newUser.password = hash;
                            // Save Insatnce of the User to Database
                            newUser.save()
                                .then(user => {
                                    request.flash('success_msg', 'Congratulations, You are now Registered as User')
                                    response.redirect('login')
                                })
                                .catch(error => console.log(error));
                        })
                    })
                }
        
            })
    }
})


// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/farmers/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (request, response, next) => {
    request.logout(function (error) {
        if (error) { return next(error)}
    });
    request.flash('success_msg', 'You are logged out Successfully');
    response.redirect('/users/login');
  });
  






module.exports = router;