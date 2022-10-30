import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    timeStamp: String,
    productos: Array
})

const CartModel = mongoose.model('carritos' , cartSchema)
export default CartModel