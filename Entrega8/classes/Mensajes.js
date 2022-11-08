const { options } = require('../options/SQLite3.js');
const knex = require('knex')(options);

class Mensajes {

    constructor(nombreTabla) {
        this.nombreTabla = nombreTabla;
    }

    createTabla() {
        knex.schema.hasTable(this.nombreTabla)
            .then(function (exists) {
                if (!exists) {
                    return knex.schema.createTable(this.nombreTabla, (table) => {
                        table.string("author");
                        table.string("fechayhora");
                        table.string("text");
                        table.increments("id");
                    });
                }
            }).catch((e) => {
                console.log(e);
            });
    }


    save(mens) {
        try {
            knex(this.nombreTabla)
                .insert(mens)
                .then(() => {
                    console.log('Mensaje guardado en la base de datos');
                }).catch((e) => {
                    console.log(e);
                });
        }
        catch (e) {
            return res.status(500).json({error: e.message});
        }
    }

    getAll() {
        try {
            return knex
                .from(this.nombreTabla)
                .select('*')
                .catch((e) => {
                    console.log(e);
                });
        }
        catch (e) {
            return res.status(500).json({error: e.message});
        }
    }

    getById(id) {
        try {
            return knew
                .from(this.nombreTabla)
                .select('*')
                .where({ id: id })
                .catch((e) => {
                    console.log(e);
                });
        }
        catch (e) {
            return e.message;
        }
    }

    deleteById(id) {
        try {
            knex
                .from(this.nombreTabla)
                .where({ id: id })
                .del()
                .then(() => {
                    console.log('Mensaje borrado de la base de datos');
                }).catch((e) => {
                    console.log(e);
                });
        }
        catch (e) {
            return e.message;
        }
    }
}

module.exports = Mensajes;