class Productos {
	constructor() {
		this.productos = [];
		this.id = 0;
	}

	getById(id) {
		let prod = this.productos.find((prod) => prod.id == id);
		return prod || { error: "producto no encontrado" };
	}

	getAll() {
		return this.productos.length
			? this.productos
			: { error: "no hay productos cargados" };
	}

	save(prod) {
		prod.id = ++this.id;
		this.productos.push(prod);
	}

	replace(prod, id) {
		prod.id = Number(id);
		let index = this.productos.findIndex((prod) => prod.id == id);
		this.productos.splice(index, 1, prod);
	}

	deleteById(id) {
		let index = this.productos.findIndex((prod) => prod.id == id);
		return this.productos.splice(index, 1);
	}
}

module.exports = Productos;
