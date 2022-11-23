//1 - import requires 
const express = require("express");
const ContenedorProd = require('./classes/ContenedorProd.js');
const hbs = require('express-handlebars');
const { router } = require('./routes/productos.router.js');
const { faker } = require('@faker-js/faker');
const Contenedor = require('./classes/Contenedor.js');
// persiste en mongo DB
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const bCrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Usuarios = require('./models/UserModel.js');
const mongodb = mongoose.connect;
const mongoUrl = "mongodb+srv://admin:admin@cluster0.wrfkstj.mongodb.net/?retryWrites=true&w=majority";


const { normalize, denormalize, schema } = require('normalizr');

//2. servidor
const app = express();
app.use(express.static("public"));

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || "secreto",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 10000,
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://admin:admin@cluster0.wrfkstj.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    })
}))

app.use("/productos", router);

//3. websocket 
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const { response } = require("express");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//4. instance objetos | arreglos
const contProd = new ContenedorProd('productos');

let fakerProd = [];

//5. motor de plantillas 

app.engine('hbs',
    hbs({
        extname: '.hbs',
        defaultLayout: 'index.hbs'
    })
);

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });


app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/vista/lista", async (req, res) => {
    const prods = await contProd.getAll();

    res.render("vista", {
        productos: prods,
        hayProductos: prods.length,
    });
});


//faker
function objRandom() {
    return {
        title: faker.commerce.product(),
        price: faker.commerce.price(100, 1220, 0, '$'),
        thumbnail: faker.image.image()
    }
}
//5 productos
app.get("/productos-test", async (req, res) => {
    try {
        const cantFaker = req.query.cant || 5;
        for (let i = 0; i < cantFaker; i++) {
            fakerProd.push(objRandom());
        }
        res.render("productos-test", {
            productos: fakerProd,
            contenido: fakerProd.length
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

//serializar y deserializar

app.get('/registrar', (req, res) => {
    res.render('register');
})

app.post("/registrar", urlencodedParser, async (req, res) => {
    try {
        await mongodb(mongoUrl);
        const body = req.body;
        let { username, password, direccion } = body;

        const usuario = new Usuarios({
            username,
            password: createHash(password),
            direccion: req.body.direccion
        })
        console.log(usuario);

        usuario.save((err, user) => {
            if (err) {
                return res.render("login-error");
            }
            return res.render("login");
        })
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

//login

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
    res.render('login');
})

passport.use(
    'login',
    new LocalStrategy(
        { passReqToCallback: true },
        async (req, username, password, done) => {
            mongoose.connect(
                mongoUrl
            );
            try {
                Usuarios.findOne({ username },
                    (err, user) => {
                        if (err) {
                            return done(err, null)
                        };
                        if (!user) {
                            console.log('User not found with username ' + user);
                            return done(null, false);
                        };
                        if (!isValidPassword(user, password)) {
                            console.log('Invalid password');
                            return done(null, false);
                        };
                        return done(null, user);
                    });
            } catch (error) {
                console.error(`Error al loguear usuario: ${error}`);
            };
        })
);


passport.serializeUser((usuario, done) => {
    done(null, usuario._id)
})

passport.deserializeUser((id, done) => {
    Usuarios.findById(id, done);
})

app.post(
    "/login", 
    urlencodedParser,
    passport.authenticate('login', {
        failureRedirect: '/login-error',
    }),function (req, res) {
        res.render('index', { username: req.body.username});
    }
);

app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/login-error', (req, res) => {
    res.render('login-error');
});

// ... logout
app.get("/logout",  urlencodedParser, function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); 
        } else {
        res.render('logout', { username: req.body.username });
    }
    });
});

function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

const isValidPassword = (user, password) => {
    return bCrypt.compareSync(password, user.password);
}



// normalización mensajes
const bdMjes = new Contenedor('mensajes');
const messages = [];

const authorSchema = new schema.Entity('author', {}, { idAttribute: 'id' });
const chatSchema = new schema.Entity("chatSchema", {
    author: authorSchema
});

// Levanta server
const server = httpServer.listen(8080, () => console.log("servidor Levantado"));
server.on("error", (error) => console.log(`hubo un error ${error}`));

// socket.io productos
io.on("connection", async (socket) => {
    try {
        const prods = await contProd.getAll();
        console.log("se conecto un usuario");

        socket.emit("productos", prods);

        socket.on("new-prod", async (data) => {
            await contProd.save(data);
            prods.push(data);
            io.sockets.emit("productos", prods);
        });

        // socket.io mensajes
        socket.emit('messages', messages);
        socket.on("new-message", async (data) => {
            messages.push(data);
            const mensajeNormalizado = normalize(messages, [chatSchema]);
            await bdMjes.save(mensajeNormalizado);

            console.log('------ NORMALIZADO ------');

            //console.log(util.inspect(mensajeNormalizado, false, Infinity));
            const fileData = await bdMjes.getAll();
            const p1 = JSON.stringify(fileData).length;
            const p2 = JSON.stringify(mensajeNormalizado).length;
            const pje = (p2 * 100) / p1;
            console.log(pje);

            io.sockets.emit("messages", messages);
        });
    } catch (e) {
        throw new Error(e.message);
    }
});

