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

function addProd(e) {
        const prod = {
            title: document.getElementById('title').value,
            price: document.getElementById('price').value,
            thumbnail: document.getElementById('thumbnail').value
        };
        socket.emit('new-prod', prod);
        return false;
};

//mensajes
socket.on('messages', (data) => {
    renderMessage(data);

});

function renderMessage(data) {
    const html = data.map((elemento) => {
        return `<div>
                    <p1>${elemento.author}</p1>
                    <p2>${fechayhora.toLocaleString("en-US")}</p2>:
                    <p3>${elemento.text}</p3>
                </div>
        `;
    })
        .join(" ");
    document.getElementById("messages").innerHTML = html;
};

function addMessage(e) {
    const mensaje = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value,
        fechayhora: fechayhora
    };

    socket.emit('new-message', mensaje);
    document.getElementById("texto").value = '';
    return false;
};