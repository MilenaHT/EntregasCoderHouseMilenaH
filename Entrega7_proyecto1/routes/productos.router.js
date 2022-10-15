import express from "express";
import Producto from "../classes/Producto.class.js";

const router = express.Router();

const producto = new Producto();

router.get('/', async (req, res) => {
    try {
        const listaProductos = await producto.getAll();
        listaProductos == false ?
            res.status(404).send({ error: 'No hay productos en la base.' }) :
            res.status(200).send({ response: listaProductos });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const productoBuscado = await producto.get(req.params.id);
        productoBuscado == false ?
            res.status(404).send({ error: 'No hay productos en la base.' }) :
            res.status(200).send({ response: productoBuscado });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.post('/', validarAdmin, async (req, res) => {
    try {
        const productoCreado = await producto.save(req.body);
        productoCreado == false ?
            res.status(400).send({ error: 'No fue posible agregar el producto: Formato incorrecto.' }) :
            res.status(201).send({ response: productoCreado });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.put('/:id', validarAdmin, async (req, res) => {
    try {
        const productoActualizado = await producto.update(req.params.id, req.body);
        productoActualizado == false ?
            res.status(400).send({ error: 'No fue posible agregar el producto: Formato incorrecto.' }) :
            res.status(201).send({ response: productoActualizado} );
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.delete('/:id', validarAdmin, async (req, res) => {
    try {
        const productoBorrado = await producto.delete(req.params.id);
        productoBorrado == true ?
            res.status(200).send({ response: 'Producto eliminado.' }) :
            res.status(404).send({ error: 'No fue posible eliminar el producto: No se encontró el id.' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

/**
 * ### Function para validar "admin"
 **/
function validarAdmin(req, res, next) {
    if (req.query.admin) {
        next();
    } else {
        res.status(403).send({ error: 'Sin permisos.' });
    }
}

export default router;