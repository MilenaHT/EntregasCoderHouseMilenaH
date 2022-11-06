import ProductsModel from '../models/ProductsModel.js';

export default class Producto {
   /*  constructor() {
        this.url = mongoUrl;
        this.mongodb = mongoose.connect;
    } */

    async get(id) {
        try {
            return await ProductsModel.findById(id) || false;
        } catch (e) {
            return e.message;
        }
    }

    async getAll() {
        try {
            return await ProductsModel.find() || false;
        } catch (e) {
            return e.message;
        }
    }

    async save(prod) {
        try {
            const newProduct = new ProductsModel(prod);
            return await newProduct.save();
        } catch (e) {
            return e.message;
        }
    }

    async update(id, body) {
        try {
            return await ProductsModel.findByIdAndUpdate(id, body);
        } catch (e) {
            return e.message;
        }
    }

    async delete(id) {
        try {
            return await ProductsModel.findByIdAndDelete(id);
        } catch (e) {
            return e.message;
        }
    }
}

