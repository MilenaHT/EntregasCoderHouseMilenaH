/**
 * Imports
 * */
import express from 'express';
import routerProductos from './routes/productos.router.js';
import routerCarrito from './routes/carritos.router.js';
import path from 'path';

/**
 * Server | express 
 **/
const app = express();
const PORT = process.env.PORT || 8080;

const __dirname = path.resolve();

/**
 * Motor | middlewares
 */
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Run
 **/
app.use('/api/productos', routerProductos);
app.use('/api/carritos', routerCarrito);

const server = app.listen(PORT, () => {
    console.log(` => Servidor iniciado en: ${server.address().port}`);
});
server.on('Algo salió mal..', (error) => console.log(`Error en servidor ${error}`));


app.get('/', (req, res) => {
    res.status(200).send({ ok: 'running' });
});

app.get('*', (req, res) => {
    res.status(404).render("404");
});

