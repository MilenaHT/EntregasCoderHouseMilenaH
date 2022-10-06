import Contenedor from './Contenedor.class.js';

export default class Producto {
    constructor() {
        this.cont = new Contenedor('Productos');
    }

    async get(id) {
        try {
            const producto = await this.cont.getById(id);
            console.log(producto);
            return producto || 404;
        } catch (e) {
            return e;
        }
    }

    async getAll() {
        try {
            const productos = await this.cont.getAll();
            return productos || 404;
        } catch (e) {
            return e;
        }
    }

    async save(prod) {
        try {
            prod.timeStamp = Date.now();
            const p = this.cont.save(prod);
            return p;
        } catch (e) {
            return e;
        }
    }

    async update(prod, id) {
        try {
            //prod.id = Number(id);
            await this.cont.deleteById(id);
            await this.cont.save(prod);
        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            const deleted = await this.cont.deleteById(id);
            return deleted;
        } catch (e) {
            return e;
        }
    }
}

