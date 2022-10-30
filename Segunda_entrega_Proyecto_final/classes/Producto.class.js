import Contenedor from './Contenedor.class.js';

export default class Producto {
    constructor() {
        this.cont = new Contenedor('Productos');
    }

    async get(id) {
        try {
            const producto = await this.cont.getById(id);
            return producto || false;
        } catch (e) {
            return e.message;
        }
    }

    async getAll() {
        try {
            const productos = await this.cont.getAll();
            return productos || false;
        } catch (e) {
            return e.message;
        }
    }

    async save(prod) {
        try {
            prod.timeStamp = Date.now();
            const p = await this.cont.save(prod);
            return p;
        } catch (e) {
            return e.message;
        }
    }

    async update(id, body) {
        try {
            await this.cont.update(id, body);
        } catch (e) {
            return e.message;
        }
    }

    async delete(id) {
        try {
            const deleted = await this.cont.deleteById(id);
            return deleted;
        } catch (e) {
            return e.message;
        }
    }
}

