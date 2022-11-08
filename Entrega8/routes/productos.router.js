const ContenedorProd = require('../classes/ContenedorProd');
const contProd = new ContenedorProd('productos');
const express = require("express");
const router = express.Router();


router.use(express.json());
router.use(express.urlencoded({ extended: true }));


//--------------API-----------------//

router.get("/", async (req, res) => {
    try {
        const lista = await contProd.getAll();
        return res.status(200).json({ lista });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id == null) {
            return res.status(400).json({ error: 'producto no encontrado' });
        } else {
            const productId = await contProd.getById(id);
            console.log(productId);
            if (productId) {
                return res.status(200).json({ productId });
            }
        }
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.post("/", async (req, res) => {
    try {
        contProd.save(req.body);
        return res.status(200).json({ ok: 'producto cargado' });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const producto = req.body;
        if (isNaN(id)) {
            return res.status(400).json({ error: 'producto no encontrado' });
        } else {
            const idBuscado = contProd.getById(id);
            if (idBuscado === null) {
                return res.status(404).json({ error: 'producto no encontrado' })
            } else {
                res.json(contProd.replace(id, producto));
            }
        }
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const buscoProd = contProd.getById(id);
        if (isNaN(id) || buscoProd === null) {
            return res.status(400).json({ error: 'producto no encontrado' })
        };
        contProd.deleteById(id);
        res.json(`El producto de id ${id} ha sido eliminado.`);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.get('*', (req, res) => {
    try {
        res.status(404).render('404', {
            titulo: '404 - Ups.. error',
            info: 'La URL no se encuentra.'
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

module.exports = { router };