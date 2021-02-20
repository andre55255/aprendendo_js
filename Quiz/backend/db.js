const knex = require("knex")({
    client: "pg",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "galoucura",
        database: "quiz"
    }
});

module.exports = knex;