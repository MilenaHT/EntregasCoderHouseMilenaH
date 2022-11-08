import Producto from './Producto.class.js';
import Contenedor from './Contenedor.class.js';

export default class Carrito {
    constructor() {
        this.producto = new Producto();
        this.contCarr = new Contenedor('Carritos');
        this.contProd = new Contenedor('Productos');
    }

    async get(id) {
        try {
            const carrito = await this.contCarr.getById(id);
            return carrito || false;
        } catch (e) {
            return e;
        }
    }

    async getAll() {
        try {
            const carritos = await this.contCarr.getAll()
            return carritos || false;
        } catch (e) {
            return e;
        }
    }

    async save() {
        try {
            const carr = {
                timeStamp: Date.now(),
                productos: []
            };
            return await this.contCarr.save(carr) || false;
        } catch (e) {
            return e;
        }
    }

    async addProd(idCarr, idProd) {
        try {
            const prod = await this.contProd.getById(idProd);
            if (!prod) return false;

            let target = await this.contCarr.getById(idCarr);
            if (!target) return false;

            let misCarritos = await this.contCarr.getAll();
            if (!misCarritos) return false;

            misCarritos = misCarritos.filter((carr) => carr.id != target.id)
            target.productos.push(prod);
            target.timeStamp = Date.now();
            target.id = parseInt(idCarr);
            misCarritos.push(target);
            misCarritos.sort((a, b) => a.id - b.id);
            return this.contCarr.saveList(misCarritos);

        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            const deleted = await this.contCarr.deleteById(id);
            return deleted;
        } catch (e) {
            return e;
        }
    }

    async deleteProd(idCarr, idProd) {
        try {
            const prod = await this.contProd.getById(idProd);
            if (!prod) return false;

            let misCarritos = await this.contCarr.getAll();
            if (!misCarritos) return false;

            let target = await this.contCarr.getById(idCarr);
            if (!target) return false;

            misCarritos = misCarritos.filter((carr) => carr.id != idCarr);

            target.productos = target.productos.filter((prod) => prod.id != idProd);
            target.timeStamp = Date.now();
            target.id = parseInt(idCarr);

            misCarritos.sort((a, b) => a.id - b.id);
            this.contCarr.saveList(misCarritos);
            return true;
            
        } catch (e) {
            return e;
        }
    }
}