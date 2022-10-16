//1 - import requires 
const express = require("express");
//const Productos = require("./api/productos.js");
const ContenedorProd = require('./classes/ContenedorProd.js');
const Mensajes = require('./classes/Mensajes.js')
const hbs = require('express-handlebars');
const {router} = require('./routes/productos.router.js');

//2. servidor
const app = express();
app.use(express.static("public"));

app.use("/productos", router);

//3. websocket 
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const { captureRejectionSymbol } = require("events");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//4. instance objetos | arreglos
const contProd = new ContenedorProd('productos');
const mjes = new Mensajes('mensajes')
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

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/vista/lista", async (req, res) => {
    const prods = await contProd.getAll();

    res.render("vista", {
        productos: prods,
        hayProductos: prods.length,
    });
});

// Levanta server
const server = httpServer.listen(8080, () => console.log("servidor Levantado"));
server.on("error", (error) => console.log(`hubo un error ${error}`));

// socket.io productos
io.on("connection", async (socket) => {
    console.log("se conecto un usuario");

    socket.emit("productos", await contProd.getAll());

    socket.on("new-prod", async (data) => {
        await contProd.save(data);
        io.sockets.emit("productos", await contProd.getAll());
    });

    // socket.io mensajes
    socket.emit('messages', messages);
    socket.on("new-message", (data) => {
        messages.push(data);
        mjes.save(data);
        io.sockets.emit("messages", messages);
    });
});

