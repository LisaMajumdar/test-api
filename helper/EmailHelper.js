const EmailHelper = class EmailHelperCls {
    constructor() {
        this.path = require('path');
		const util = require('util');
		const fs = require('fs');
		this.handlebars = require('handlebars');
		this.dateFormat = require('dateformat');
		this.readFile = util.promisify(fs.readFile);
        this.nodeMailer = require('nodemailer');
        const Q = require("q");
		this.deferred = Q.defer();
        this.transporter = this.nodeMailer.createTransport({
                type: 'smtp',
                host: process.env.SMTP_HOST,
                port: 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD
                },
                secureConnection: false
            });
    }

    /**
     * @developer : Lisa Majumdar
     * @date : 27-05-2021
     * @description : MAIL SEND FUNCTIONALITY
    */
    sendMail = async(config) =>{
        try{
			let templateFile = this.path.join( this.path.join(__dirname, '../views'), `/email/${config.emailTemplate}.html`);
			let emailContent = await this.readFile(templateFile, { encoding: 'utf8' });
			this.handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

				switch (operator) {
				case '==':
					return (v1 == v2) ? options.fn(this) : options.inverse(this);
				case '===':
					return (v1 === v2) ? options.fn(this) : options.inverse(this);
				case '!=':
					return (v1 != v2) ? options.fn(this) : options.inverse(this);
				case '!==':
					return (v1 !== v2) ? options.fn(this) : options.inverse(this);
				case '<':
					return (v1 < v2) ? options.fn(this) : options.inverse(this);
				case '<=':
					return (v1 <= v2) ? options.fn(this) : options.inverse(this);
				case '>':
					return (v1 > v2) ? options.fn(this) : options.inverse(this);
				case '>=':
					return (v1 >= v2) ? options.fn(this) : options.inverse(this);
				case '&&':
					return (v1 && v2) ? options.fn(this) : options.inverse(this);
				case '||':
					return (v1 || v2) ? options.fn(this) : options.inverse(this);
				default:
					return options.inverse(this);
				}
			});		
			let template = this.handlebars.compile(emailContent); 		
			var htmlToSend = template(config.replacements);	
			let mailParams = {
					from: config.fromEmail,// sender address 
					to: config.toEmail, // list of receivers
					subject: config.subject,// Subject line
					html : htmlToSend 
			};			

			this.transporter.sendMail(mailParams,(err,result) =>{
				if(err)
				{
					return err;
				}
				else {
				  console.log('Message sent: %s', result.messageId);		
				  return result
				}
			}); 			
		}
		catch(err) {			
            return err;
        }
    }
}

module.exports = EmailHelper;