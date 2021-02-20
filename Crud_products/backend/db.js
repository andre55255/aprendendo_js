const knex = require("knex")({
    client: "pg",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "galoucura",
        database: "crudprodutos"
    }
});

module.exports = knex;