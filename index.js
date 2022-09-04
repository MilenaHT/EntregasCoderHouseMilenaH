const Contenedor = require("./Contenedor");
const express = require("express");

const app = express();

const PORT = 8080;

const contenedor = new Contenedor("productos");

const server = app.listen(PORT, () => {
    console.log("servidor iniciado");
});

app.get("/", (req, response) => {
    response.send("Bienvenidos");
});

//Imprime todos los productos 
app.get("/productos", async (req, response) => {
    const productos = await contenedor.getAll();
    response.send(productos);
});

//Imprime un producto random
app.get("/productosRandom", async (req, response) => {
    const random = parseFloat(Math.random() * 3 + 1).toFixed();
    const productosRandom = await contenedor.getById(random);
    response.send(productosRandom);
});






