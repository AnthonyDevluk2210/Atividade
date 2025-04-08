const Sequelize = require ("sequelize");
const connection = require ("./database");

const Cadastro = connection.define('cadastros', {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    preco:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: true
    },
    imagem:{
        type: Sequelize.TEXT,
        allowNull: true
    }
})

Cadastro.sync({force: false}).then(() =>{});
module.exports = Cadastro;