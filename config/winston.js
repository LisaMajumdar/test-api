const appRoot = require('app-root-path');
var winston = require('winston');
const requestIp = require('request-ip');

module.exports = class winstonlog {
  constructor(logger_settings) {
    let log_path = '';
    if(global.CONFIG.LOG_PATH == ''){
      log_path = global.pathModule.dirname(__filename)+'\\logFolder\\';
    }else{
      log_path = global.CONFIG.LOG_PATH;
    }
    
    this.logger_settings = logger_settings;
    var options = {
        file: {
          level: 'info',
          filename: `${log_path}${this.getCurrentISTDate()}_file.log`,
          handleExceptions: true,
          json: true,
          maxsize: 5242880, // 5MB
          maxFiles: 15,
          colorize: false,
        },
        console: {
          level: 'debug',
          handleExceptions: true,
          json: true,
          colorize: true,
        },
    };
    
    this.logger = new winston.createLogger({
        transports: [
          new winston.transports.File(options.file),
          new winston.transports.Console(options.console)
        ],
        exitOnError: false, // do not exit on handled exceptions
    });
    
    this.logger.stream = {
        write: function(message, encoding) {
          if(this.logger_settings.logger_error_write_all && (this.logger_settings.logger_generate_level == 1 || this.logger_settings.logger_generate_level == 2)) {
              logger.info(message);
          }
        },
    };

    this.logObj = {};
    this.logObj.application = '';
    this.logObj.file_name = '';
    this.logObj.trace_id = '1';
    this.logObj.severity = 'INFO';//INFO,WARN,DEBUG,ERROR
    this.logObj.message = '';
    this.logObj.method_name = '';
    this.logObj.request = {};
  }

  writelog(method_name,msg,severity = ''){
    if(severity != '') {
      this.logObj.severity = severity;
    } else {
      this.logObj.severity = 'INFO';
    }

    this.logObj.method_name = method_name;
    console.log(msg);
    var jsonMsg = JSON.stringify(msg);
    // var finalMsg = jsonMsg.replace(/\\/g, "");
    this.logObj.message = jsonMsg;
    
    if(this.logObj.method_name == '') {
      throw new Error('Method name is required to write log.');
    }

    if(this.logObj.application == '') {
      throw new Error('Application name is required to write log.');
    }

    if(this.logObj.file_name == '') {
      throw new Error('File name is required to write log.');
    }

    if(this.logObj.message == '') {
      throw new Error('Message is required to write log.');
    }

    var createLogFlag = false;
    if(this.logger_settings.logger_enable_write) {
      if(this.logger_settings.logger_enable_application_name != '') { //IF WANT TO GENERATE LOG FOR PARTICULAR APPLICATION
        if(this.logObj.application == this.logger_settings.logger_enable_application_name) {
          createLogFlag = true;
        } else {
          createLogFlag = false;
        }
      } else {
        createLogFlag = true;
      }
      if(createLogFlag){
        if(this.logger_settings.logger_enable_module_name != '') { //IF WANT TO GENERATE LOG FOR PARTICULAR MODULE OF AN APPLICATION
          if(this.logObj.file_name + '.' + this.logObj.method_name == this.logger_settings.logger_enable_module_name) {
            createLogFlag = true;
          } else {
            createLogFlag = false;
          }
        } else {
          createLogFlag = true;
        }
      }
      console.log('createLogFlag',createLogFlag);
      if(createLogFlag) {
        var createMessage = '~# '+this.getCurrentISTDateTime();
  
        let clientIp = '0:0:0:0';
        
        if(typeof(this.logObj.request) != 'undefined') {
          if (Object.keys(this.logObj.request).length > 0) {
            if(this.logObj.request) {
              clientIp = requestIp.getClientIp(this.logObj.request);
            }
          }
        }
  
        let trace_id = '1';
        if(typeof(this.logObj.trace_id) != 'undefined') {
          if(this.logObj.trace_id) {
            trace_id = this.logObj.trace_id;
          }
        }
  
        createMessage = createMessage+' | '+ this.logObj.application + ' | ' + this.logObj.file_name + '.' + this.logObj.method_name + ' | ' + trace_id + ' | ' + this.logObj.severity + ' | ' + clientIp + ' | ' + this.logObj.message;
        
        if(this.logObj.severity == 'ERROR') {
          if(this.logger_settings.logger_generate_level == 1 || this.logger_settings.logger_generate_level == 2) {
            this.logger.error(createMessage);
          }
        } else if(this.logObj.severity == 'WARN') {
          this.logger.warn(createMessage);
        } else if(this.logObj.severity == 'INFO') {
          if(this.logger_settings.logger_generate_level == 2) {
            this.logger.info(createMessage);
          }
        } else if(this.logObj.severity == 'SQL') {
          if(this.logger_settings.generate_sql_query_log) {
            if(this.logger_settings.logger_generate_level == 2) {
              this.logger.info(createMessage);
            }
          }
        }

      }
    }
  }

  // For Modified Date
  getCurrentISTDate(){
    var moment = require('moment-timezone');
    var utc = Date.now()/1000;
    return moment.unix(utc).tz(process.env.TZ).format('YYYY-MM-DD');
  }

  // For Modified Date
  getCurrentISTDateTime(){
    var moment = require('moment-timezone');
    var utc = Date.now()/1000;
    return moment.unix(utc).tz(process.env.TZ).format('YYYY-MM-DD HH:mm:ss');
  }
}