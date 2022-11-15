//coneccion a SQLITE3
const knex = require('knex')({
    client: 'sqlite3',
    connection: { filename: './DB/ecommerce.sqlite' },
    useNullAsDefault: true,
});

//creacion de las tablas SQLITE3
knex.schema.hasTable('mensajes')
    .then(function (exists) {
        if (!exists) {
            return knex.schema
                .createTable('mensajes', (table) => {
                    table.string('author');
                    table.string('fechayhora');
                    table.string('text');
                    table.increments("id");
                }).then(() => {
                    console.log('table created');
                }).catch((err) => {
                    console.log(err);
                })
        }
    }); 

// listado de tabla
/* knex
    .from('mensajes')
    .select('*')
    .then((rows) => {
        console.log(rows);
    })
 */

// coneccion a MariaDB
const knexMaria = require('knex')(
    {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: "1234",
            database: 'ecommerceProd'
        }
    });

// creacion de las tablas MariaDB
knexMaria.schema.hasTable('productos')
    .then(function (exists) {
        if (!exists) {
            return knexMaria.schema.createTable('productos', (table) => {
                table.string("title");
                table.float("price");
                table.string("thumbnail");
                table.increments("id");
            }).then(() => {
                console.log('table created');
            }).catch((err) => {
                console.log(err);
            })
        }
    });