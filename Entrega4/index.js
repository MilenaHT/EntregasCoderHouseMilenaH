const Contenedor = require("./class/Contenedor");
const express = require('express');

const app = express();

const PORT = 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const contenedor = new Contenedor("productos");

const server = app.listen(PORT, () => {
    console.log("Servidor Levantado");
});

app.use(express.static("public"));

const routerProductos = express.Router();

routerProductos.get("/", async (req, res) => {
    const productos = await contenedor.getAll();
    res.send(productos);
});

routerProductos.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const productId = await contenedor.getById(id);
    if (isNaN(id) || productId === null) {
        res.json({ error: 'producto no encontrado' });
    } else {
        res.send(productId);
    }
});

routerProductos.post("/", async (req, res) => {
    const nuevoProd = await contenedor.save(req.body);
    const muestra = await contenedor.getById(nuevoProd);
    res.json(muestra);
});

routerProductos.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const producto = req.body;
    if (isNaN(id)) {
        res.json({ error: 'producto no encontrado' });
    } else {
        const idBuscado = await contenedor.getById(id);
        if (idBuscado === null) {
            res.json({ error: 'producto no encontrado' })
        } else {
            res.json(await contenedor.replace(id, producto));
        }
    }
});

routerProductos.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const buscoProd = await contenedor.getById(id);
    if (isNaN(id) || buscoProd === null) {
        res.json({ error: 'producto no encontrado' });
    } else {
        const productos = await contenedor.deleteById(id);
        res.json({ productos });
    }
});


app.use("/api/productos", routerProductos);