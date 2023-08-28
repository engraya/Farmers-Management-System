const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/authConfig')




// Welcome Page
router.get('/', (request, response) => {
    response.render('core')
})


// Dashboard
router.get('/main', ensureAuthenticated, (request, response) =>
  response.render('main', {
    userName: request.user.name
  })
);






module.exports = router;