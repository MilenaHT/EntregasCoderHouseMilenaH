import ProductsModel from '../models/ProductsModel.js';
import CartModel from '../models/CartModel.js';

export default class Carrito {
/*     constructor() {
        this.url = mongoUrl;
        this.mongodb = mongoose.connect;
    } */


    async get(id) {
        try {
            return await CartModel.findById(id) || false;
        } catch (e) {
            return e;
        }
    }

    async getAll() {
        try {
            return await CartModel.find() || false;
        } catch (e) {
            return e;
        }
    }

    async saveCart() {
        try {
            const carr = {
                timeStamp: Date.now(),
                productos: []
            };
            const newCart = new CartModel(carr);
            return await newCart.save() || false;
        } catch (e) {
            return e.message;
        }
    }

    async addProd(idCarr, idProd) {
        try {
            const prod = await ProductsModel.findById(idProd);
            if (!prod) return false;

            let target = await CartModel.findById(idCarr);
            if (!target) return false;
            
            return await CartModel.findByIdAndUpdate(target, {$push: { 'productos': prod}});

        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            return await CartModel.findByIdAndDelete(id);
        } catch (e) {
            return e;
        }
    }

    async deleteProd(idCarr, idProd) {
        try {
            const prod = await ProductsModel.findById(idProd);
            if (!prod) return false;

            let target = await CartModel.findById(idCarr);
            if (!target) return false;
            
            return await CartModel.findByIdAndUpdate(target, {$pull: { 'productos': prod}});
            
        } catch (e) {
            return e;
        }
    }
}