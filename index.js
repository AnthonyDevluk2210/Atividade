const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Cadastro = require("./database/Cadastros");
const path = require('path');

// Conexão com o banco de dados
connection
    .authenticate()
    .then(() => {
        console.log("Conexão com BD feita com sucesso!");
    })
    .catch((msgErro) => {
        console.error("Erro ao conectar ao banco de dados:", msgErro); // Use console.error para erros
        process.exit(1); // Encerra o processo em caso de erro de conexão
    });

// Configuração do EJS e arquivos estáticos
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

// Middleware para processar o corpo das requisições
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rota para a página inicial (lista de produtos)
app.get("/", (req, res) => {
    Cadastro.findAll({
        raw: true,
        order: [["id", 'DESC']]
    })
        .then(cadastros => {
            res.render("index", { cadastros: cadastros });
        })
        .catch(err => {
            console.error("Erro ao buscar produtos:", err);
            res.status(500).send("Erro ao carregar a lista de produtos.");
        });
});

// Rota para exibir o formulário de cadastro
app.get("/cadastrar", (req, res) => {
    res.render("cadastrar"); // Renderiza o formulário de cadastro (cadastrar.ejs)
});

// Rota para salvar um novo produto
app.post("/salvarcadastro", (req, res) => {
    const { nome, descricao, preco, imagem } = req.body;

    Cadastro.create({
        nome,
        descricao,
        preco,
        imagem
    })
        .then(() => {
            res.redirect("/"); // Redireciona para a página inicial após o sucesso
        })
        .catch(err => {
            console.error("Erro ao salvar o produto:", err);
            res.status(500).send("Erro ao cadastrar o produto.");
        });
});

// Rota para exibir detalhes de um produto (nova rota)
app.get("/cadastro/:id", (req, res) => {
    const id = req.params.id;

    Cadastro.findByPk(id)
        .then(cadastro => {
            if (cadastro) {
                res.render("detalhes", { cadastro: cadastro }); // Renderiza a página de detalhes (detalhes.ejs)
            } else {
                res.status(404).send("Produto não encontrado.");
            }
        })
        .catch(err => {
            console.error("Erro ao buscar detalhes do produto:", err);
            res.status(500).send("Erro ao carregar detalhes do produto.");
        });
});

// Inicia o servidor
const port = 5000;
app.listen(port, () => {
    console.log(`App rodando na porta ${port}!`);
});
