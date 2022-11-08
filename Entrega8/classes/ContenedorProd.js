const { options } = require('../options/mariaDB.js');
const knex = require('knex')(options);

class ContenedorProd {

    constructor(nombreTabla) {
        this.nombreTabla = nombreTabla;
    }

    async save(producto) {
        try {
            knex(this.nombreTabla).insert(producto)
                .then(() => {
                    console.log('El artículo se guardó.');
                }).catch((e) => {
                    console.log(e);
                });
        }
        catch (err) {
            return res.status(500).json({error: e.message});
        }
    }

    async getById(id) {
        try {
            return await knex
                .from(this.nombreTabla)
                .select('*')
                .where({ id: id })
                .catch((e) => {
                    console.log(e);
                });
        } catch (error) {
            return res.status(500).json({error: e.message});
        }
    }

    async getAll() {
        try {
            return await knex
                .from(this.nombreTabla)
                .select("*")
                .catch((e) => {
                    console.log(e);
                });
        } catch (err) {
            return res.status(500).json({error: e.message});
        }
    }

    async deleteById(id) {
        try {
            knex
                .from(this.nombreTabla)
                .where({ id: id })
                .del()
                .then(() => {
                    console.log('Se eliminó el producto');
                });
        } catch (error) {
            return res.status(500).json({error: e.message});
        }
    }

    async deleteAll() {
        try {
            knex
                .from(this.nombreTabla)
                .del()
                .then(() => {
                    console.log('Tabla eliminada');
                })
        } catch (error) {
            return res.status(500).json({error: e.message});
        }
    }

    async replace(id, body) {
        try {
            knex(this.nombreTabla)
                .where({ id: id })
                .update(body)
                .then(() => {
                    console.log('Se actualizó el producto');
                }).catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            return res.status(500).json({error: e.message});
        }
    }
}

module.exports = ContenedorProd;

