import express from "express";
import Producto from "../classes/Producto.class.js";

const router = express.Router();

const producto = new Producto();

router.get('/', async (req, res) => {
    const listaProductos = await producto.getAll();
    listaProductos == 404 ?
        res.status(404).send({ error: 'No hay productos en la base.' }) :
        res.status(200).send({ response: listaProductos });
});

router.get('/:id', async (req, res) => {
    const productoBuscado = await producto.get(req.params.id);
    productoBuscado == 404 ?
        res.status(404).send({ error: 'No hay productos en la base.' }) :
        res.status(200).send({ response: productoBuscado });
});

router.post('/', validarAdmin, async (req, res) => {
    const productoCreado = await producto.save(req.body);
    productoCreado == 400 ?
        res.status(400).send({ error: 'No fue posible agregar el producto: Formato incorrecto.' }) :
        res.status(201).send({ response: productoCreado });
});

router.put('/:id', validarAdmin, async (req, res) => { 
    const productoActualizado = await producto.update(req.body, req.params.id);
    productoActualizado == 400 ?
        res.status(400).send({ error: 'No fue posible agregar el producto: Formato incorrecto.' }) :
        res.status(201).send(productoActualizado);
});

router.delete('/:id', validarAdmin, async (req, res) => {
    const productoBorrado = await producto.delete(req.params.id);
    productoBorrado == 200 ?
        res.status(200).send({ response: 'Producto eliminado.' }) :
        res.status(404).send({ error: 'No fue posible eliminar el producto: No se encontró el id.' });
});

/**
 * ### Function para validar "admin"
 **/
function validarAdmin(req, res, next) {
    if (req.query.admin) {
        next();
    } else {
        res.status(400).send({ error: 'Permisos insuficientes.' });
    }
}

export default router;