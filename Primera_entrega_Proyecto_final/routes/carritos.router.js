import express from "express";
import Carrito from "../classes/Carrito.class.js";

const router = express.Router();

const carrito = new Carrito();

router.post('/', async (req, res) => {
    try {
        const carritoCreado = await carrito.save();
        carritoCreado == false ?
            res.status(400).send({ error: 'No fue posible agregar el carrito: Formato incorrecto.' }) :
            res.status(201).send({ response: "Carrito creado" });
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const carritoEliminado = await carrito.delete(req.params.id);
        carritoEliminado == false ?
            res.status(404).send({ error: 'No fue posible eliminar el carrito: el ID no existe' }) :
            res.status(200).send({ response: 'Carrito eliminado ' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const listaCarritos = await carrito.getAll();
        listaCarritos == false ?
            res.status(404).send({ error: 'No existen carritos' }) :
            res.status(200).send({ response: listaCarritos });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const listaCarrito = await carrito.get(req.params.id);
        listaCarrito == false ?
            res.status(404).send({ error: 'No existe el carrito' }) :
            res.status(200).send({ response: listaCarrito });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.post('/:id/productos/:idProd', async (req, res) => {
    try {
        const carr = await carrito.addProd(
            req.params.id,
            req.params.idProd
        );
        carr == false ?
            res.status(404).send({ error: 'No fue posible agregar el producto al carrito.' }) :
            res.status(201).send({ response: carr });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.delete('/:id/productos/:idProd', async (req, res) => {
    try {
        const prodBorrado = await carrito.deleteProd(
            req.params.id,
            req.params.idProd
        );
        prodBorrado == true ?
            res.status(200).send({ response: 'Producto eliminado del carrito.' }) :
            res.status(404).send({ error: 'No fue posible eliminar el producto del carrito.' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});


export default router;