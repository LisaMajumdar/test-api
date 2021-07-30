const Connection = class ConnectionCls {
    connectDB(){ 
        this.Sequelize = require('sequelize');
        this.sequelize = new this.Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASS, {
            host: process.env.DB_HOST,
            dialect: 'mysql'
        });
    }
}

module.exports = Connection;