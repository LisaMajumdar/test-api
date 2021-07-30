module.exports = class validatorCls {
    constructor() {
        const { check } = require('express-validator');
        this.check = check;
    }

    validEmail(email) {
        const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([A-Za-zÃÁÂÀÄÇÉÈÊËÍÌÎÏÕÒÔÓÖÛÚÙÜãáàâäçéèêëíìîïñõôóòöûúùü\-0-9]+\.)+[A-Za-zÃÁÂÀÄÇÉÈÊËÍÌÎÏÕÒÔÓÖÛÚÙÜãáàâäçéèêëíìîïñõôóòöûúùü]{2,}))$/;
        return emailPattern.test(String(email).toLowerCase());
    }

    // Validation For Login Details
    login() {
        return [
            this.check('email')
                .not().isEmpty().withMessage('Email is required for login.')
                .isEmail().trim().isLength({ min: 6, max: 50 }).withMessage('Please provide valid email id.'),             
            this.check('password')
                .not()
                .isEmpty()
                .withMessage('Please provide password.')
                .isLength(8)
                .withMessage('Please provide valid password.'),
        ]
    }

    // Validation For Registration
    registration() {
        return [
            this.check('email')
                .not().isEmpty().withMessage('Email is required for registration.')
                .isEmail().trim().isLength({ min: 6, max: 50 }).withMessage('Please provide valid email id.'),             
            this.check('password')
                .not()
                .isEmpty()
                .withMessage('Please provide password.')
                .isLength(8)
                .withMessage('Please provide valid password.'),
            this.check('contact')
                .not()
                .isEmpty()
                .withMessage('Please provide mobile number.')
                .isInt()
                .isLength({ max: 10, min: 10 })
                .withMessage('Mobile number should be 10 digit.'),
            this.check('name')
                .not()
                .isEmpty()
                .withMessage('Please provide name.'),
            this.check('address')
                .not()
                .isEmpty()
                .withMessage('Please provide address.')
            
        ]
    }

    // Validation For Forget Password
    forgetPwd() {
        return [
            this.check('email')
                .not().isEmpty().withMessage('Email is required for forget password.')
                .isEmail().trim().isLength({ min: 6, max: 50 }).withMessage('Please provide valid email id.') 
        ]
    }

    // Validation For Verify OTP
    verifyOtp() {
        return [
            this.check('email')
                .not().isEmpty().withMessage('Email is required for forget password.')
                .isEmail().trim().isLength({ min: 6, max: 50 }).withMessage('Please provide valid email id.'),
            this.check('otp')
                .not()
                .isEmpty()
                .withMessage('Please provide otp.')
                .isLength(4)
                .withMessage('OTP should be 4 digit.'),
        ]
    }

    // Validation For reset password
    resetPwd() {
        return [
            this.check('email')
                .not().isEmpty().withMessage('Email is required for forget password.')
                .isEmail().trim().isLength({ min: 6, max: 50 }).withMessage('Please provide valid email id.'),
            this.check('password')
                .not()
                .isEmpty()
                .withMessage('Please provide password.')
                .isLength(8)
                .withMessage('Please provide valid password.'),
            this.check('password').custom((value, { req }) => {                
                if(typeof(req.body.con_password) === 'undefined' || req.body.con_password == ''){
                    let obj = {
                        "value": req.body.con_password,
                        "msg": "Please provide confirm password.",
                        "param": "con_password",
                        "location": "body"
                    }
                    throw obj;
                }
                if(req.body.password != req.body.con_password){
                    let obj = {
                        "value": req.body.con_password,
                        "msg": "Password should be same as confirm password.",
                        "param": "con_password",
                        "location": "body"
                    }
                    throw obj;
                }
                return true;
            })
        ]
    }

    // Validation For Regenerate Token
    regenerateToken(){
        return [
            this.check('refreshToken')
                .not().isEmpty().withMessage('Refresh token can not be empty.')
        ]    
    }

    // Validation For Booked Patient & Give Time Slot  Details
    fetchRecord() {
        return [
            this.check('doctor_id')
                .not()
                .isEmpty()
                .withMessage('Pleasae Provide Doctor Id'),                
            this.check('appointment_date')
                .not()
                .isEmpty()
                .withMessage('Pleasae Provide Appointment Date'),
            this.check('doctor_time_slot_id')
                .not()
                .isEmpty()
                .withMessage('Pleasae Provide Time Slot Id'),
            this.check('no_of_patients')
                .not()
                .isEmpty()
                .withMessage('Pleasae Provide No Of Patients')
        ]
    }
}