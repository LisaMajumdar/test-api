const CommonHelper = class CommonHelperCls {
    constructor() {
        this.jwt = require('jsonwebtoken');
		this.bcrypt = require('bcrypt');
		const Cryptr = require('cryptr');
        this.cryptr = new Cryptr('1');
	}

	randomString() {  
		return Math.random().toString(36).substring(3)
	}

	// id encryption
	encTypeId(id) {
		const encryptedId = this.cryptr.encrypt(id);
		return encryptedId;
	}

	// ID Decryption
	decTypeId(encId) {
		const decryptedId = this.cryptr.decrypt(encId);
		return decryptedId;
	}

	// For Modified Date
	getUTCTimeAndDate() {
		const date = new Date();
		const str_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		return str_date;
	}

	// For get random no
	randomNumber() {
		var val = Math.floor(1000 + Math.random() * 9999);
		return val;
	}

	// For get Data Count
	toPlain(dataCont) {
		if (dataCont) {
			return JSON.parse(JSON.stringify(dataCont));
		}
		return dataCont;
	}

	// For Token Creation
	createToken(userdtls) {
		var jwtToken = this.jwt.sign(userdtls, global.CONFIG.jwt.JWT_SECRET, {
			algorithm: global.CONFIG.jwt.JWT_ALGORITHM,
			expiresIn: global.CONFIG.jwt.JWT_EXPIRES
		});
		return jwtToken;
	}

	// For Token Verify
	verifyToken(token) {
		var that = this;
		return new Promise(function (resolve, reject) {
			that.jwt.verify(token, global.CONFIG.jwt.JWT_SECRET, global.CONFIG.jwt.JWT_ALGORITHM, function (err, result) {
				console.log(err);
				if (result)
					return resolve(result);
				else
					return reject(err);
			});
		});

	}

	// For Password Encryption
	hashPassword(passsword) {
		var salt = this.bcrypt.genSaltSync(10);
		var hash = this.bcrypt.hashSync(passsword, salt);
		return hash;
	}

	// For Password Decryption
	comparePassword(password, hash) {
		if (this.bcrypt.compareSync(password, hash)) {
			return true;
		} else {
			return false;
		}
	}

	//Send Response through api
	sendRequestStatus(res, msg, flag , dataset = []) {
		var response_status = {};
		var response_dataset = [];
		var response_data = {};
		let status = '';
		response_status.msg = msg;
		if(flag == 'success'){
			response_status.action_status = true;		
			if (Object.keys(dataset).length === 0) {
				dataset = [];
			}
			response_data.dataset = dataset;
			status = global.CONFIG.constants.HTTP_RESPONSE_OK
		}else{
			response_status.action_status = false;
			if (Object.keys(dataset).length > 0) {
				response_dataset = dataset;
			}
			response_data.dataset = response_dataset;
			status = global.CONFIG.constants.HTTP_RESPONSE_BAD_REQUEST
		}
		
		response_data.status = response_status;
		res.status(status);
		res.send({ response: response_data });
	}

	// Unauthorised response
	unauthorizedStatusBuild(res, msg) {
		var response_status = {};
		var response_dataset = [];
		var response_data = {};
		response_status.msg = msg;
		response_status.action_status = false;
		response_data.dataset = response_dataset;
		response_data.status = response_status;
		//response_data.publish = this.api_var;
		res.status(global.CONFIG.constants.HTTP_RESPONSE_UNAUTHORIZED);
		res.send({ response: response_data });
	}

}

module.exports = CommonHelper;