const knex = require("knex")({
    client: "pg",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "galoucura",
        database: "galeria"
    }
});

module.exports = knex;