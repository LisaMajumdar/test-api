module.exports = class fileUploadCls {
    constructor() {
        this.fs = require('fs');
        this.path = require('path');
    }

    /**
     * @developer : Lisa Majumdar
     * @date : 26-05-2021
     * @description : COPY FILE TO PATH
    */
    copyFile(source, destination) {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.fs.copyFile(source, destination, (err) => {
                if (err) {
                    console.log(err);
                    return resolve(false);
                }
                return resolve(true);
            });
        });
    };


    /**
     * @developer : Lisa Majumdar
     * @date : 26-05-2021
     * @description : NORMAL FILE UPLOAD FUNCTIONALITY
    */
    plainFileUpload(oldPath, newPath) {
        var that = this;
        return new Promise(function (resolve, reject) {
            return that.fs.rename(oldPath, newPath, async (err) => {
                if (err) {
                    console.log(err);
                    return resolve(false);
                } else {
                    return resolve(true);
                }
            });
        });
    }

    /**
     * @developer : Lisa Majumdar
     * @date : 26-05-2021
     * @description : FILE UPLOAD FUNCTIONALITY
    */
    upload = async (fileUploadOptions, resizeOptions = []) => {
        var that = this;
        return new Promise(function (resolve, reject) {    
            (async () => {        
                var content_type = fileUploadOptions.fileinfo[0].headers['content-type'];
                var contenttypeArr = content_type.split('/');
                var contenttype = contenttypeArr[0];

                var oldPath = fileUploadOptions.fileinfo[0].path;
                var filename = fileUploadOptions.newFileName;
                var ext = that.path.extname(fileUploadOptions.fileinfo[0].originalFilename);
                var uploadDir = fileUploadOptions.uploadPath;
                var newPath = uploadDir + filename + ext;
                //UPLOADING FILES
                if (!await that.plainFileUpload(oldPath, newPath)) {
                    return resolve({ error: true, msg: 'File could not be uploaded.' });
                }else{
                    return resolve({ error: false, msg: 'File uploaded successfully.', dataObj : filename + ext });
                }
            })();
        })
    }

}