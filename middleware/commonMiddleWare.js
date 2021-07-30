module.exports = class validatorCls {
    constructor() {
        const { validationResult } = require('express-validator');
        this.validationResult = validationResult;

        // const CommonHelper = require('../helper/CommonHelper');
        // this.CommonHelper = new CommonHelper();
    }

    // Error return method
    checkforerrors = async (req, res, next) => {        
        let err_response = this.validationResult(req);
        if(!err_response.isEmpty()){
            let response_status = {};
            let response_dataset = {};
            let response_data = {};
            let errorVal = err_response.array();  
            if(errorVal.length > 0){
                let arr = [];
                let arr1 = [];
                errorVal.forEach((item) => {
                    if(item.msg.param !=  undefined){
                        arr.push(item.msg);
                    }else{                        
                        arr1.push(item);
                    }
                });
                arr = arr.concat(arr1);
                response_dataset = arr;
                response_status.msg = arr[0].msg;
                response_status.action_status = false;
                response_data.dataset = response_dataset;
                response_data.status = response_status;
            }
            res.status(global.CONFIG.constants.HTTP_RESPONSE_BAD_REQUEST);
            res.send({ response: response_data });
        }else{
            next();
        }
        
    }

    // From validate Method

    validateFormData = async (req, res, next) => {
        var loginDetails = {};
       // global.logs.logObj.request = req;
        if (typeof (req.body.loginDetails) != 'undefined') {
            loginDetails = req.body.loginDetails;
        } else {
            req.body.loginDetails = loginDetails;
        }
        let localObj = {};

        localObj = req.body;
        var checkMultiparty = 0;
        if (typeof (req.body.loginDetails) != 'undefined') {
            if (Object.keys(req.body).length == 1) {
                //ONLY LOGIN DETAILS EXIST
                checkMultiparty = 1;
            }
        }
        console.log('checkMultiparty: ', checkMultiparty);
        if (checkMultiparty == 1) {
            var checkform = (callback) => {
                var sendData = {};
                var multiparty = require('multiparty');
                var form = new multiparty.Form();
                form.parse(req, function (err, fields, files) {
                    if(typeof(fields) != 'undefined'){
                        if(Object.keys(fields).length>0) {
                            Object.keys(fields).forEach(function (key) {
                                sendData[key] = fields[key][0];
                            });
                        }
                    }
                    else{
                        //global.Helpers.notAcceptableStatusBuild(res,'Content type mismatch');
                        return; 
                    }

                    if(typeof(files) != 'undefined'){
                        if(Object.keys(files).length>0) {
                            Object.keys(files).forEach(function (key) {
                                sendData[key] = files[key];
                            });
                        }
                    }
                    else{
                       // global.Helpers.notAcceptableStatusBuild(res,'Content type mismatch'); 
                        return;
                    }
                    callback(sendData);
                });
            }

            var callbackfun = (sendData) => {
                sendData['loginDetails'] = localObj.loginDetails;
                req.body = sendData;
                next();
            }
            checkform(callbackfun);
        } else {
            next();
        }
    }


    // Validate Token

    validateToken = async (req, res, next) => {
        var token = req.headers['authorization'];
        if (token) {
            if (token.startsWith('Bearer ') || token.startsWith('bearer ')) {
                // Remove Bearer from string
                token = token.slice(7, token.length);
            }

            // decode token
            if (token) {
                global.Helpers.verifyToken(token)
                    .then(async jwtDecres => {
                        req.body.loginDetails = jwtDecres;
                        next();
                    }).catch(async err => {
                        if (err.name == 'TokenExpiredError') {
                            global.Helpers.unauthorizedStatusBuild(res, 'Token Expired');
                        }
                        else {
                            global.Helpers.unauthorizedStatusBuild(res, 'Something went wrong, please try again.');
                        }

                    });
            } else {
                global.Helpers.unauthorizedStatusBuild(res, 'Token Undefine.');
            }
        } else {
            global.Helpers.unauthorizedStatusBuild(res, 'Token Undefine.');
        }
    }

}