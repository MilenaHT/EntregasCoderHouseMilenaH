
const fs = require("fs");


class Contenedor {
    constructor(archivo) {
        this.archivo = `./${archivo}.txt`;
    }

    async save(producto) {
        try {
            if (!fs.existsSync(this.archivo)) {
                producto.id = 1;
                await fs.promises.writeFile(this.archivo, JSON.stringify([producto], null, 2));
            } else {
                const listado = await this.getAll();
                const orden = listado.sort((a, b) => b.id - a.id)[0].id;
                producto.id = orden + 1
                listado.push(producto);
                listado.sort((a, b) => a.id - b.id);
                await fs.promises.writeFile(this.archivo, JSON.stringify(listado, null, 2));
            }
            return producto.id;
        }
        catch (err) {
            throw new Error('Error en save()');
        }
    }

    async getById(id) {
        try {
            const contenido = await this.getAll();
            let obj = null;
            contenido.find(item => {
                if (item.id === id) {
                    obj = item;
                }
            });
            return obj;
        } catch (error) {
            throw new Error('Error en getById()'+ error);
        }
    }

    async getAll() {
        try {
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const infoJSON = JSON.parse(data);
            return infoJSON;
        } catch (err) {
            throw new Error('Error en getAll()');
        }
    }

    async deleteById(id) {
        try {
            const data = await this.getAll();
            const borraDeLista = data.filter(producto => producto.id !== id);
            await fs.promises.writeFile(this.archivo, JSON.stringify(borraDeLista, null, 2));
        } catch (error) {
            throw new Error('Error en deleteById()');
        }
    }

    async deleteAll() {
        try {
            if (fs.existsSync(this.archivo)) {
                fs.promises.writeFile(this.archivo, "");
            }
        } catch (error) {
            throw new Error('Error en deleteAll()');
        }
    }

    async replace(id, body) {
        try {
            await this.deleteById(id);
            const contenido = await this.getAll();
            body.id = id;
            contenido.push(body);
            contenido.sort((a, b) => a.id - b.id);
            await fs.promises.writeFile(this.archivo, JSON.stringify(contenido, null, 2));
        } catch (error) {
            throw new Error('Error en replace()');
        }
    }
}

module.exports = Contenedor;

