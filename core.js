const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const coreRoute = require('./routes/core');
const usersRoute = require('./routes/users');
const farmersRoute = require('./routes/farmers')
const path = require('path');
const bodyParser = require('body-parser');


// Passport Config
require('./config/passport')(passport);

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,"uploads")));
app.use(bodyParser.urlencoded({ extended : false }));


// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Connect flash
  app.use(flash());


// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


app.use((request, response, next) => {
  response.locals.message = request.session.message;
  delete request.session.message;
  next();
})



//Routes
app.use('/', coreRoute)
app.use('/users', usersRoute)
app.use('/farmers', farmersRoute)


const dbURL = 'mongodb://localhost:27017/farmers_management_DB'

mongoose.connect(dbURL, { family : 4}, { useNewUrlParser: true, useUnifiedTopology: true  } )
    .then(() => console.log('Successfully Connected to Database...'))
    .catch((err) => console.log(err));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));