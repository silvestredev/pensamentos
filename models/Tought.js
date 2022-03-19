const {DataTypes} = require('sequelize'); //metodo para ver tipos de dados do db
const db = require('../db/conn') //conct com o db 

const User = require('./User'); //chamando o model user

const Tought = db.define('Tought', { //criando a model/table
    titulo: {
        type: DataTypes.STRING, //tipo string
        allowNull: false, //tem que haver algo 
    },
});

Tought.belongsTo(User); //um pensamento pertence apenas a um user
User.hasMany(Tought); //um user tem muitos pensamentos

module.exports = Tought;