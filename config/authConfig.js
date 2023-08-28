module.exports = {
    ensureAuthenticated: function(request, response, next) {
      if (request.isAuthenticated()) {
        return next();
      }
      request.flash('error_msg', 'Please Ensure you are Logged in Before gaining access to the required Page...!');
      response.redirect('/users/login');
    },
    forwardAuthenticated: function(request, response, next) {
      if (!request.isAuthenticated()) {
        return next();
      }
      response.redirect('/farmers/dashboard');      
    }
  };
  