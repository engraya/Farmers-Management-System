const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/authConfig')




// Welcome Page
router.get('/', (request, response) => {
    response.render('core')
})

// Dashboard
router.get('/dashboard', ensureAuthenticated, (request, response) =>
  response.render('farmersDashboard', {
    userName: request.user.name
  })
);






module.exports = router;