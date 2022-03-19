const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('toughts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

try { //vendo se o sequelize está funcionando
    sequelize.authenticate()
    console.log('Sequelize iniciado!')
} catch (error) {
    console.log(error)
};

module.exports = sequelize;

//conectando com o db 'toughts'