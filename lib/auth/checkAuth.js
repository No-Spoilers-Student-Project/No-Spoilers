const tokenChecker = require('./token');

module.exports = function getCheckAuth() {

  return function checkAuth(req, res, next) {
    const token = req.headers.token;

    if(!token) {
      return next({
        code: 400,
        error: 'unauthorized, no token provided'
      });
    }

    tokenChecker.verify(token)
    .then( user => {
      // for valid user, attach payload to req
      req.user = user;
      
      /* if we wanted/needed details from db */
      // User.findById(user.id)
      // 	.then(user => {
      // 		//check is exists
      // 		if (!user) { /*...*/ }
      // 		// assign whatever info we need to request
      // 		req.user = {
      // 			/* add info here */
      // 		};
      // 	})

      next();
    })
    .catch( () => {
      return next({
        code: 403,
        error: 'unauthorized, invalid token'
      });
    });

  };
};