import mongoose from "mongoose";
import ProductsModel from '../models/ProductsModel.js';
import mongoUrl from './config.js';

export default class Producto {
    constructor() {
        this.url = mongoUrl;
        this.mongodb = mongoose.connect;
    }

    async get(id) {
        try {
            await this.mongodb(this.url);
            return await ProductsModel.findById(id) || false;
        } catch (e) {
            return e.message;
        }
    }

    async getAll() {
        try {
            await this.mongodb(this.url);
            return await ProductsModel.find() || false;
        } catch (e) {
            return e.message;
        }
    }

    async save(prod) {
        try {
            await this.mongodb(this.url);
            const newProduct = new ProductsModel(prod);
            return await newProduct.save();
        } catch (e) {
            return e.message;
        }
    }

    async update(id, body) {
        try {
            await this.mongodb(this.url);
            return await ProductsModel.findByIdAndUpdate(id, body);
        } catch (e) {
            return e.message;
        }
    }

    async delete(id) {
        try {
            await this.mongodb(this.url);
            return await ProductsModel.findByIdAndDelete(id);
        } catch (e) {
            return e.message;
        }
    }
}

