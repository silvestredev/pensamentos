const {DataTypes} = require('sequelize'); //metodo para ver tipos de dados do db
const db = require('../db/conn') //conct com o db 

const User = db.define('User', { //criando a model/table
    nome: {
        type: DataTypes.STRING, //tipo string
        allowNull: false, //tem que haver algo
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User;