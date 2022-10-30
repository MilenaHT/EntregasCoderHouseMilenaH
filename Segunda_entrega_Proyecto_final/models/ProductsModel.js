import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    codigo: Number,
    foto: String,
    precio: String,
    stock: Number,
    timeStamp: Date
})

const ProductsModel = mongoose.model('producto',productoSchema)
export default ProductsModel