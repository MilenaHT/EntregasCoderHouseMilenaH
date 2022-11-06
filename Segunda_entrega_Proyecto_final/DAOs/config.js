import mongoose from "mongoose";

const mongoUrl = "mongodb+srv://admin:admin@cluster0.wrfkstj.mongodb.net/ProyectoFinalCoderHouse";

const connectMongo = () => {
        mongoose.connect(
            mongoUrl,
            (err) => {
                if (err){
                    console.log('Error en conexión de mongo');
                } else {
                    console.log('Conectado a mongo');
                }
            }
            );
    }

export default connectMongo;