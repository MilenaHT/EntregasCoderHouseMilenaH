import * as fs from 'fs';
const cod = 'utf-8';
const ext = '.txt'; // [.json] | [.txt]

export default class Contenedor {

  constructor(filePath) {
    this.filePath = `./Database/${filePath}${ext}`;
  }

  async save(obj) {
    try {
      if (!fs.existsSync(this.filePath)) {
        obj["id"] = 1;
        const contenidoJSON = JSON.stringify([obj], null, 2);
        await fs.promises.writeFile(this.filePath, contenidoJSON);
      }
      else {
        const parseData = await this.getAll();
        obj.id = await this.generateID();
        parseData.push(obj);
        parseData.sort((a, b) => a.id - b.id);
        await fs.promises.writeFile(this.filePath, JSON.stringify(parseData, null, 2));
      }
      return obj;
    }
    catch (e) {
      return e.message;
    }
  }

  async getAll() {
    try {
      if (!fs.existsSync(this.filePath)) {
        return (`Error en función getAll(): \n El directorio ${this.filePath} no existe.`);
      }
      else {
        const content = await fs.promises.readFile(this.filePath, cod);
        if (content.length > 0) {
          const arreglo = JSON.parse(content);
          return arreglo;
        }
      }
    }
    catch (e) {
      return e.message;
    }
  }

  async getById(id) {
    try {
      if (!fs.existsSync(this.filePath)) {
        return (`Error en función (getById()): \n El directorio ${this.filePath} no existe.`);
      } else {
        const contenido = await this.getAll();
        const prod = contenido.find((prod) => prod.id == id);
        if (prod) {
          return prod;
        }
      }
    } catch (e) {
      return e.message;
    }
  }

  async deleteAll() {
    try {
      if (!fs.existsSync(this.filePath)) {
        return (`Error en función getById(): \n El directorio ${this.filePath} no existe.`);
      } else {
        await fs.promises.writeFile(this.filePath, "");
      }
    }
    catch (e) {
      return e.message;
    }
  }

  async deleteFile() {
    try {
      if (!fs.existsSync(this.filePath)) {
        return (`Error en función getById(): \n El directorio ${this.filePath} no existe.`);
      } else {
        fs.unlinkSync(this.filePath);
      }
    }
    catch (e) {
      return e.message;
    }
  }

  async deleteById(id) {
    try {
      if (!fs.existsSync(this.filePath)) {
        return (`Error en función getById(): \n El directorio ${this.filePath} no existe.`);
      } else {
        const aux = await this.getById(id);
        const content = await this.getAll();
        if (aux) {
          const eliminado = content.filter(prod => prod.id != id);
          await fs.promises.writeFile(this.filePath, JSON.stringify(eliminado, null, 2));
          return true;
        } else {
          return false;
        }
      }
    } catch (e) {
      return e.message;
    }
  }

  saveList(arr) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(arr, null, 2));
    }
    catch (e) {
      return e.message;
    }
  }

  async generateID() {
    try {
      this.objects = await this.getAll();
      let maxID = this.objects.length;
      this.objects.forEach(prod => {
        prod.id > maxID ? maxID = prod.id : maxID
      })
      return maxID + 1;
    } catch (e) {
      return e.message;
    }
  }

  async update(id, body) {
    try {
      const listaProd = await this.getAll();
      let index = listaProd.findIndex((prod) => prod.id == id);
      listaProd.splice(index, 1, body);
      body.timeStamp = Date.now();
      body.id = parseInt(id);
      listaProd.sort((a, b) => a.id - b.id);
      await fs.promises.writeFile(this.filePath, JSON.stringify(listaProd, null, 2));
      return true;
    } catch (e) {
      return e.message;
    }
  }
}