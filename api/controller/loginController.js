module.exports = class LoginControllerCls {
    constructor(){

        /********** Initialize Model ***********/
        const LoginModel = require("../model/LoginModel");
        this.LoginModelObj = new LoginModel();

        const UserModel = require("../model/UserModel");
        this.UserModelObj = new UserModel();

        const OtpModel = require("../model/OtpModel");
        this.OtpModelObj = new OtpModel();

        const RefreshTokenModel = require("../model/RefreshTokenModel");
        this.RefreshTokenModelObj = new RefreshTokenModel();

         // ******** Other Packages ********** // 
        this.dateFormat = require('dateformat');

        const FileUploadHelper = require("../../helper/FileUploadHelper");
        this.fileUpObj = new FileUploadHelper();

        const EmailHelper = require("../../helper/EmailHelper");
        this.emailObj = new EmailHelper();
    }

    initLog() {        
        /*****************************LOG INITIALIZATION***************************************** */
            global.logs.logObj.application = global.CONFIG.PARENTS_APPLICATION_NAME;
            global.logs.logObj.file_name = global.pathModule.dirname(__filename) + global.pathModule.basename(__filename);
        /**************************************************************************************** */
    }


    /**
     * @developer : Lisa Majumdar
     * @date : 26-05-2021
     * @description : Function for admin login through API.
     */

    login = async (req, res) => {
        await this.initLog();
        try {
            global.logs.writelog('login', ['request:', req.body]);
            let response_data = [];
            var email = req.body.email;
            var password = req.body.password;
            if (email != '') {
                let wherObject = { 'email': email };
                let adminUserRecord = await this.LoginModelObj.findSingleRow({where : wherObject});
                global.logs.writelog('login', ['adminUserRecord:', adminUserRecord]);
                let updateData = { updated_at: global.Helpers.getUTCTimeAndDate() };
                let updateLastLogin = await this.LoginModelObj.updateAnyRecord(updateData, wherObject);
                global.logs.writelog('login', ['updateLastLogin:', updateLastLogin]);
                if (adminUserRecord != null) {
                    var userDtls = adminUserRecord.dataValues;
                    if (userDtls == null) {
                        global.Helpers.sendRequestStatus(res, 'You are not an user.', 'error');
                    } else {
                        var hash = userDtls.password;
                        if (await global.Helpers.comparePassword(password, hash) == true) {
                            let userRecord = await this.UserModelObj.findSingleRow({where : {'id': userDtls.ref_id}});
                            global.logs.writelog('login', ' user Record = ' + userRecord);
                            let rendomStr = await global.Helpers.randomString();
                            let refresh_token = await global.Helpers.encTypeId(rendomStr);
                            let image_file = userRecord.image;
                            var tokenDataSign = {
                                'login_id': userDtls.id,
                                'user_id': userDtls.ref_id,
                                'user_type' : userDtls.type,
                                'email': email
                            }
                            global.logs.writelog('login', ' token By userDtls = ' + tokenDataSign);
                            var jwtToken = await global.Helpers.createToken(tokenDataSign);
                            let inserObj = {
                                'loginId':userDtls.id,
                                'userId': userDtls.ref_id,
                                'refresh_token':refresh_token
                            }
                            let refreshTokenInsert = await this.RefreshTokenModelObj.addNewRecord(inserObj);
                            global.logs.writelog('login', ' Refresh Token Insert = ' + refreshTokenInsert);
                            let response = {
                                'email': email,
                                'name': userRecord.name,
                                'profile_image': global.CONFIG.API_PATH+'uploads/'+image_file,
                                'token' : jwtToken,
                                'token_type' : 'Bearer',
                                'refresh_token' : refresh_token
                                
                            }                           
                            response_data[0] = response;
                            global.Helpers.sendRequestStatus(res, 'Logged in successfully.', 'success', response_data);
                        }else{
                            global.Helpers.sendRequestStatus(res, 'password is incorrect.', 'error');  
                        }
                    }
                }
                else {
                    global.Helpers.sendRequestStatus(res, 'Username or password is incorrect.', 'error');
                }
                
            }else{
                global.Helpers.sendRequestStatus(res, 'Please Provide Email ID.', 'error');
            }
        } catch (err) {
            global.logs.writelog('login', err.stack, 'ERROR');
            global.Helpers.sendRequestStatus(res, 'Something Went Wrong.', 'error');
        }
    }

    /**
     * @developer : Lisa Majumdar
     * @date : 26-05-2021
     * @description : Function for admin Registration through API.
    */

    registration = async (req, res) => {
        await this.initLog();
        try {
            global.logs.writelog('registration', ['request:', req.body]);
            let response_data = [];
            let email = req.body.email;
            let password = req.body.password;
            let type = req.body.type;
            let fileLink = '';
            let name = req.body.name;
            let contact = req.body.contact;
            let address = req.body.address; 
            let wherObject = { 'email': email };
            global.logs.writelog('registration', ['Where Object :', wherObject]);  
            let existsRecord = await this.LoginModelObj.findSingleRow({where : wherObject});
            global.logs.writelog('registration', ['Existing Record :', existsRecord]);  
            if(existsRecord == null){
                let hasPwd = global.Helpers.hashPassword(password)
                let insertObj = {
                    'email' : email,
                    'password' : hasPwd,
                    'type' : type
                }
                let insertLoginRecord = await this.LoginModelObj.addNewRecord(insertObj);
                global.logs.writelog('registration', ['insert Login Record  :', insertLoginRecord]); 
                let last_auto_id = insertLoginRecord.id;
                global.logs.writelog('registration', ['last_auto_id :', last_auto_id]); 
                let currentTime = Math.floor(Date.now() / 1000);
                let newFilename = currentTime + "_image";
                // File Upload Section
                if(typeof(req.body.image) != 'undefined' && req.body.image != ''){
                    let fileUploadOptions = {
                        fileinfo: req.body.image, //HERE "myfile" IS THE FILE INPUT NAME. SETTING THE FILE INFO.
                        uploadPath: "./public/uploads/", //SERVER PATH TO UPLOAD FILE
                        newFileName: newFilename, //SETTING THE FILE NAME
                    };
                    let fileupresult = await this.fileUpObj.upload(fileUploadOptions);
                    global.logs.writelog('registration', ['file upload result  :', fileupresult]); 
                    fileLink = fileupresult.dataObj;
                }
                // End

                let insertUserObj = {
                    'name' : name,
                    'address' : address,
                    'contact' : contact,
                    'image' : fileLink
                }
                let insertUserRecord = await this.UserModelObj.addNewRecord(insertUserObj);
                global.logs.writelog('registration', ['insert User Record  :', insertUserRecord]); 
                let last_user_id = insertUserRecord.id;
                global.logs.writelog('registration', ['last_user_id :', last_user_id]); 
                let updateData = { 'ref_id': last_user_id };
                let updateLoginRecord = await this.LoginModelObj.updateAnyRecord(updateData, {'id' : last_auto_id});
                global.logs.writelog('registration', ['update Login Record:', updateLoginRecord]);
                let response = {
                    'last_login_id' : last_auto_id
                }
                response_data[0] = response;
                global.Helpers.sendRequestStatus(res, 'Registration in successfully.', 'success', response_data);
            }else{
                global.Helpers.sendRequestStatus(res, 'Email Already Exists.', 'error'); 
            }
        } catch (err) {
            global.logs.writelog('registration', err.stack, 'ERROR');
            global.Helpers.sendRequestStatus(res, 'Something Went Wrong.', 'error');
        }
    }

    /**
     * @developer : Lisa Majumdar
     * @date : 26-05-2021
     * @description : Function for get profile details through API.
    */

    getProfileDetails = async (req, res) => {
        await this.initLog();
        try {
            let response_data = [];
            global.logs.writelog('getProfileDetails', ['request:', req.body]);
            let user_id = req.body.loginDetails.user_id;
            let getUserRecord = await this.UserModelObj.findSingleRow({where : {'id' : user_id}});
            global.logs.writelog('getProfileDetails', ['Get User Record  :', getUserRecord]);
            let image_file = getUserRecord.dataValues.image;
            delete getUserRecord.dataValues.image;
            let response = getUserRecord.dataValues;
            response['email'] = req.body.loginDetails.email;
            response['user_type'] = req.body.loginDetails.user_type;
            response['image'] = global.CONFIG.API_PATH+'uploads/'+image_file;
            response_data[0] = response;
            global.Helpers.sendRequestStatus(res, 'Get Profile Details successfully.', 'success', response_data); 
        } catch (err) {
            global.logs.writelog('getProfileDetails', err.stack, 'ERROR');
            global.Helpers.sendRequestStatus(res, 'Something Went Wrong.', 'error');
        }
    }

    /**
     * @developer : Lisa Majumdar
     * @date : 27-05-2021
     * @description : Function for forget password through API.
    */
    forgetPwd = async (req, res) => {
        await this.initLog();
        try {
            let response_data = [];
            global.logs.writelog('forgetPwd', ['request:', req.body]);
            let email = req.body.email;
            let wherObject = { 'email': email };
            let adminUserRecord = await this.LoginModelObj.findSingleRow({where : wherObject});
            global.logs.writelog('forgetPwd', ['adminUserRecord:', adminUserRecord]);
            if(adminUserRecord != null){
                let loginId = adminUserRecord.id;
                let otp = global.Helpers.randomNumber();
                let otpObj = {
                    'loginId' : loginId,
                    'otp' : otp
                }
                let insertRecord = await this.OtpModelObj.addNewRecord(otpObj);
                global.logs.writelog('forgetPwd', ['insertRecord:', insertRecord]);
                let array = otp.toString().split('');
                let replacement = {
                    'Title' : 'Verify OTP',
                    'name' : 'ABC User',
                    '1st' : array[0],
                    '2nd' : array[1],
                    '3rd' : array[2],
                    '4th' : array[3]
                };
                let emailSendObj = {
                    'emailTemplate' : 'sendOtp',
                    'fromEmail' : process.env.SMTP_USERNAME,
                    'toEmail' : email,
                    'subject' : 'Verify Your Email',
                    'replacements' : replacement
                }
                let emailresponce = await this.emailObj.sendMail(emailSendObj);
                let response = {
                    'email' : email,
                    'otp' : otp
                }
                response_data[0] = response;
                global.Helpers.sendRequestStatus(res, 'Otp send to your mail successfully.', 'success', response_data); 
        
            }else{
                global.Helpers.sendRequestStatus(res, 'Email Is Not Exists.', 'error'); 
            }
            
        } catch (err) {
            global.logs.writelog('forgetPwd', err.stack, 'ERROR');
            global.Helpers.sendRequestStatus(res, 'Something Went Wrong.', 'error');
        }
    }

    /**
     * @developer : Lisa Majumdar
     * @date : 01-06-2021
     * @description : Function for verify otp through API.
    */
    verifyOtp = async (req, res) => {
        await this.initLog();
        try{
            let response_data = [];
            global.logs.writelog('verifyOtp', ['request:', req.body]);
            let email = req.body.email;
            let otp = req.body.otp;
            let wherObject = { 'email': email };
            let adminUserRecord = await this.LoginModelObj.findSingleRow({where : wherObject});
            global.logs.writelog('verifyOtp', ['adminUserRecord:', adminUserRecord]);
            if(adminUserRecord != null){
                let loginId = adminUserRecord.id;
                let whObject = { 'loginId': loginId , 'otp': otp};
                let otpRecord = await this.OtpModelObj.findSingleRow({where : whObject});
                global.logs.writelog('verifyOtp', ['otpRecord:', otpRecord]);
                if(otpRecord != null){
                    let otpId = otpRecord.id;
                    let delOtpRecord = await this.OtpModelObj.deleteByAny({'id' : otpId});
                    global.logs.writelog('verifyOtp', ['OTP Deleted Record:', delOtpRecord]);
                    let response = {
                        'email' : email
                    }
                    response_data[0] = response;
                    global.Helpers.sendRequestStatus(res, 'Otp verified successfully.', 'success', response_data);
                }else{
                    global.Helpers.sendRequestStatus(res, 'OTP Is Not Exists.', 'error');
                }
            }else{
                global.Helpers.sendRequestStatus(res, 'Email Is Not Exists.', 'error'); 
            }
        }catch (err) {
            global.logs.writelog('verifyOtp', err.stack, 'ERROR');
            global.Helpers.sendRequestStatus(res, 'Something Went Wrong.', 'error');
        }
    }

    /**
     * @developer : Lisa Majumdar
     * @date : 01-06-2021
     * @description : Function for reset password through API.
    */
    resetPwd = async (req, res) => {
        await this.initLog();
        try{
            let response_data = [];
            global.logs.writelog('resetPwd', ['request:', req.body]);
            let email = req.body.email;
            let password = req.body.password;
            let wherObject = { 'email': email };
            let adminUserRecord = await this.LoginModelObj.findSingleRow({where : wherObject});
            global.logs.writelog('resetPwd', ['adminUserRecord:', adminUserRecord]);
            if(adminUserRecord != null){
                let loginId = adminUserRecord.id;
                let hasPwd = global.Helpers.hashPassword(password)
                let updateData = {
                    'password' : hasPwd,
                    'updated_at': global.Helpers.getUTCTimeAndDate() 
                };
                let updateRecord = await this.LoginModelObj.updateAnyRecord(updateData, {'id' : loginId});
                global.logs.writelog('resetPwd', ['update password:', updateRecord]);
                global.Helpers.sendRequestStatus(res, 'Password reset successfully.', 'success', response_data); 
            }else{
                global.Helpers.sendRequestStatus(res, 'Email Is Not Exists.', 'error'); 
            }
        } catch (err) {
            global.logs.writelog('resetPwd', err.stack, 'ERROR');
            global.Helpers.sendRequestStatus(res, 'Something Went Wrong.', 'error');
        }
    }

    /**
     * @developer : Lisa Majumdar
     * @date : 01-06-2021
     * @description : Function for regenerate token through API.
    */
    regenerateToken = async (req, res) => {
        await this.initLog();
        try{
            let response_data = [];
            global.logs.writelog('regenerateToken', ['request:', req.body]);
            let refreshToken = req.body.refreshToken;
            let getRecord = await this.RefreshTokenModelObj.findSingleRow({where : {'refresh_token' : refreshToken}})
            global.logs.writelog('regenerateToken', ['Get Refresh Token Record:', getRecord]);
            let adminUserRecord = await this.LoginModelObj.findSingleRow({where : {'id': getRecord.loginId}});
            global.logs.writelog('regenerateToken', ['adminUserRecord:', adminUserRecord]);
            let rendomStr = await global.Helpers.randomString();
            let refresh_token = await global.Helpers.encTypeId(rendomStr);
            var tokenDataSign = {
                'login_id': adminUserRecord.id,
                'user_id': adminUserRecord.ref_id,
                'user_type' : adminUserRecord.type,
                'email': adminUserRecord.email
            }
            global.logs.writelog('regenerateToken', ' token By userDtls = ' + tokenDataSign);
            var jwtToken = await global.Helpers.createToken(tokenDataSign);
            let updateObj = {                
                'refresh_token':refresh_token
            }
            let whObj = {
                'id' : getRecord.id,
                'loginId':getRecord.loginId,
                'userId': getRecord.userId,
            }
            let refreshTokenInsert = await this.RefreshTokenModelObj.updateAnyRecord(updateObj, whObj);
            global.logs.writelog('regenerateToken', ' Refresh Token Update = ' + refreshTokenInsert);
            let response = {
                'token' : jwtToken,
                'token_type' : 'Bearer',
                'refresh_token' : refresh_token
                
            }                           
            response_data[0] = response;
            global.Helpers.sendRequestStatus(res, 'Regenetate Token Successfully.', 'success', response_data);

        } catch (err) {
            global.logs.writelog('regenerateToken', err.stack, 'ERROR');
            global.Helpers.sendRequestStatus(res, 'Something Went Wrong.', 'error');
        }
    }

}