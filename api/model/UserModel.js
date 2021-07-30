'use strict';
const Model = class UserModel{
    constructor(){
        /*Connection initialization*/
        const connection = require("../../config/connection");
        this.connectionObj = new connection;
        this.connectionObj.connectDB();
        /*End*/

        /*For sequalize operation*/
        this.Op = this.connectionObj.Sequelize.Op;
        /*End*/
        /*Schema defination of model*/
        this.Model = this.connectionObj.sequelize.define('tbl_users', {
                id:{
                    type: this.connectionObj.Sequelize.BIGINT,
                    primaryKey : true,
                    autoIncrement :true 
                },
                name:{
                    type: this.connectionObj.Sequelize.STRING
                },
                contact:{
                    type: this.connectionObj.Sequelize.STRING
                },
                address:{
                    type: this.connectionObj.Sequelize.STRING
                },
                image:{
                    type: this.connectionObj.Sequelize.STRING
                }, 
                created_at:{
                    type: this.connectionObj.Sequelize.STRING
                },
                updated_at:{
                    type: this.connectionObj.Sequelize.STRING
                }
            },
            {
                timestamps: false,
                freezeTableName: true,
                tableName: 'tbl_users'
            }
        );
    }

    // Function For get all records depends on any condition
    findByAny(dataobj) {
        return this.Model.findAll(dataobj);
    }

    // Function For get all record with count value
    findAllWithCount(mainObj) {
        return this.Model.findAndCountAll(mainObj);
    }

    // Function for add new record
    addNewRecord(dataobj) {
        return this.Model.build(dataobj).save();
    }

    // Function for update any record with any condition
    updateAnyRecord(dataobj, whereobj = {}) {
        return this.Model.update(dataobj, { where: whereobj });
    }

    // Function for delete record with any condition
    deleteByAny(dataobj) {
        return this.Model.destroy({
            where: dataobj
        })
    }

    // Function For get single record depends on any condition
    findSingleRow(dataobj) {
        return this.Model.findOne(dataobj);
    }

    // Function For count records depends on any condition
    countRows(whereObj = {}) {
        return this.Model.count(whereObj);
    }  
}

module.exports = Model;