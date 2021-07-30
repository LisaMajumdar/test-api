var express = require('express');
var router = express.Router();

/*Controller initialization*/
const LoginController = require('../api/controller/loginController');
const LoginControllerObj = new LoginController();

/*Middleware initialization*/
const commonMiddleWare = require('../middleware/commonMiddleWare');
const commonMiddleWareObj = new commonMiddleWare;

const loginMiddleware = require('../middleware/loginMiddleware');
const loginMiddlewareObj = new loginMiddleware();


// Router For registration
middlewares = [
  commonMiddleWareObj.validateFormData,
  loginMiddlewareObj.registration(), 
  commonMiddleWareObj.checkforerrors
];
router.post('/register', middlewares, LoginControllerObj.registration);

// Router For login
middlewares = [
  commonMiddleWareObj.validateFormData,
  loginMiddlewareObj.login(),
  commonMiddleWareObj.checkforerrors
];
router.post('/login', middlewares, LoginControllerObj.login);



// Router For get profile details
middlewares = [
  commonMiddleWareObj.validateToken,
  commonMiddleWareObj.checkforerrors
];
router.post('/getProfileDtls', middlewares, LoginControllerObj.getProfileDetails);


// Router For forget password
middlewares = [
  loginMiddlewareObj.forgetPwd(),
  commonMiddleWareObj.checkforerrors
];
router.post('/forgetPwd', middlewares, LoginControllerObj.forgetPwd);


// Router For verify otp
middlewares = [
  loginMiddlewareObj.verifyOtp(),
  commonMiddleWareObj.checkforerrors
];
router.post('/verifyOtp', middlewares, LoginControllerObj.verifyOtp);


// Router For reset password
middlewares = [
  loginMiddlewareObj.resetPwd(),
  commonMiddleWareObj.checkforerrors
];
router.post('/resetPwd', middlewares, LoginControllerObj.resetPwd);

// Router For regenerate token
middlewares = [
  loginMiddlewareObj.regenerateToken(),
  commonMiddleWareObj.checkforerrors
];
router.post('/regenerateToken', middlewares, LoginControllerObj.regenerateToken);


module.exports = router;
