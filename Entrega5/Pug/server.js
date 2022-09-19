const pug = require("pug");
const express = require("express");
const Productos = require("./api/productos.js");

const productos = new Productos();

const app = express();

const PORT = 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = app.listen(PORT, () => {
    console.log(`Servidor puerto ${server.address().port} Levantado`);
});
server.on ('error', (err) => console.log(`Error en servidor ${err}`));

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));

const routerProductos = express.Router();
app.use("/productos", routerProductos);

routerProductos.use(express.json());
routerProductos.use(express.urlencoded({ extended: true }));

routerProductos.get("/", (req, res) => {
    res.json(productos.getAll());
});

routerProductos.get("/:id", (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id) || productId === null) {
        return res.status(400).json({ error: 'producto no encontrado' })
    };
    const productId = productos.getById(id);
    res.send(productId)
});

routerProductos.post("/", (req, res) => {
    productos.save(req.body);
    res.redirect("/");
});

routerProductos.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const producto = req.body;
    if (isNaN(id)) {
        return res.status(400).json({ error: 'producto no encontrado' });
    } else {
        const idBuscado = productos.getById(id);
        if (idBuscado === null) {
            return res.status(404).json({ error: 'producto no encontrado' })
        } else {
            res.json(productos.replace(id, producto));
        }
    }
});

routerProductos.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const buscoProd = productos.getById(id);
    if (isNaN(id) || buscoProd === null) {
        return res.status(400).json({ error: 'producto no encontrado' })
    };
    productos.deleteById(id);
    res.json( `El producto de id ${id} ha sido eliminado.` );
});

routerProductos.get("/vista/lista", (req, res) => {
	let prods = productos.getAll();

	res.render("layouts/index", {
		productos: prods,
		hayProductos: prods.length,
	});
});
