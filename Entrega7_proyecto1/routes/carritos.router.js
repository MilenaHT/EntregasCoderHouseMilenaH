import express from "express";
import Carrito from "../classes/Carrito.class.js";

const router = express.Router();

const carrito = new Carrito();

router.post('/', async (req, res) => {
    const carritoCreado = await carrito.save();
    carritoCreado == 400 ?
        res.status(400).send({ error: 'No fue posible agregar el carrito: Formato incorrecto.' }) :
        res.status(201).send({ response: "Carrito creado" });
});

router.delete('/:id', async (req, res) => {
    const carritoEliminado = await carrito.delete(req.params.id);
    carritoEliminado == 404 ?
        res.status(404).send({ error: 'No fue posible eliminar el carrito: el ID no existe' }) :
        res.status(200).send({ response: 'Carrito eliminado ' });
});

router.get('/', async (req, res) => {
    const listaCarritos = await carrito.getAll();
    listaCarritos == 404 ?
        res.status(404).send({ error: 'No existen carritos' }) :
        res.status(200).send({ response: listaCarritos });
});

router.get('/:id', async (req, res) => {
    const listaCarrito = await carrito.get(req.params.id);
    listaCarrito == 404 ?
        res.status(404).send({ error: 'No existe el carrito' }) :
        res.status(200).send({ response: listaCarrito });
});

router.post('/:id/productos/:idProd', async (req, res) => {
    const carr = await carrito.addProd(
        req.params.id,
        req.params.idProd
    );
    carr == 404 ?
        res.status(404).send({ error: 'No fue posible agregar el producto al carrito.' }) :
        res.status(201).send({ response: carr });
});

router.delete('/:id/productos/:idProd', async (req, res) => {
    const prodBorrado = await carrito.deleteProd(
        req.params.id,
        req.params.idProd
    );
    prodBorrado == 200 ?
        res.status(200).send({ response: 'Producto eliminado del carrito.' }) :
        res.status(404).send({ error: 'No fue posible eliminar el producto del carrito.' });
});


export default router;