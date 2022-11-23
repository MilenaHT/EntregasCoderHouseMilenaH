const socket = io.connect();

let fechayhora = new Date();

// productos 
socket.on('productos', (productos) => {
    document.getElementById('productos').innerHTML = renderProd(productos);
});

//renderizar producto
function renderProd(productos) {
    const dataTab = `
    {{#if hayProductos}}
    <div class="table-responsive">
        <table class="table table-dark">
            <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Foto</th>
            </tr>
            {{#each productos}}
            <tr>
                <td>{{this.title}}</td>
                <td>{{this.price}}</td>
                <td><img width="50" src={{this.thumbnail}} alt="not found"></td>
            </tr>
            {{/each}}
        </table>
    </div>
    {{else}}
    <h3 class="alert alert-warning">No se encontraron productos</h3>
    {{/if}}
    `;
    let template = Handlebars.compile(dataTab);
    let html = template({
        productos: productos, hayProductos: productos.length
    });
    return html;
};

const formProd = document.getElementById('formProd');

function addProd(e) {
    const prod = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    };
    socket.emit('new-prod', prod);
    document.getElementById("formProd").reset();
    return false;
};

//mensajes
socket.on('messages', (data) => {
    renderMessage(data);

});

function renderMessage(data) {
    const html = data.map((elemento) => {
        return `<div>
                    <p1>${elemento.author.id}</p1>
                    <p2>${fechayhora.toLocaleString("en-US")}</p2>:
                    <p3>${elemento.text}</p3>
                    <p4>${elemento.author.avatar}</p4>
                </div>
        `;
    })
        .join(" ");
    document.getElementById("mensajes").innerHTML = html;
};

const formMens = document.getElementById('formMens');

function addMessage(e) {
    const mensaje = {
        id: 'mensajes',
        author: {
            id: document.getElementById('id').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: document.getElementById('texto').value
    };

    socket.emit('new-message', mensaje);
    document.getElementById("texto").value = '';
    return false;
};

