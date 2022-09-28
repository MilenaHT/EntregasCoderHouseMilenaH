//1 - import requires 
const express = require("express");
const Productos = require("./api/productos.js");
const Contenedor = require("./api/contenedor");
const hbs = require('express-handlebars');

//2. servidor
const app = express();
const router = express.Router();

/* app.use(express.static("public")); */
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

app.use("/productos", router);

//3. websocket 
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//4. instance objetos | arreglos
const productos = new Productos();
const contenedor = new Contenedor('mensajes');
const messages = [];

//5. motor de plantillas 

app.engine('hbs',
    hbs({
        extname: '.hbs',
        defaultLayout: 'index.hbs'
    })
);

app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/vista/lista", (req, res) => {
    let prods = productos.getAll();

    res.render("vista", {
        productos: prods,
        hayProductos: prods.length,
    });
});

// Levanta server
const server = httpServer.listen(8080, () => console.log("servidor Levantado"));
server.on("error", (error) => console.log(`hubo un error ${error}`));

// socket.io productos
io.on("connection", (socket) => {
    console.log("se conecto un usuario");

    socket.emit("productos", productos.getAll());

    socket.on("new-prod", (data) => {
        productos.save(data);
        io.sockets.emit("productos", productos.getAll());
    });

    // socket.io mensajes
    socket.emit('messages', messages);
    socket.on("new-message", (data) => {
        messages.push(data);
        contenedor.save(data);
        io.sockets.emit("messages", messages);
    });
});




//--------------API-----------------//
/* router.get("/", (req, res) => {
    res.json(productos.getAll());
}); */

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id) || productId === null) {
        return res.status(400).json({ error: 'producto no encontrado' });
    };
    const productId = productos.getById(id);
    res.send(productId)
});

router.post("/", (req, res) => {
    productos.save(req.body);
    return res.status(200).json({ ok: 'producto cargado' });
    /* res.redirect("/"); */
});

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const buscoProd = productos.getById(id);
    if (isNaN(id) || buscoProd === null) {
        return res.status(400).json({ error: 'producto no encontrado' })
    };
    productos.deleteById(id);
    res.json(`El producto de id ${id} ha sido eliminado.`);
});



