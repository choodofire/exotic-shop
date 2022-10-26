import express from "express";
import path from 'path';
import csrf from 'csurf';
import flash from 'connect-flash'
import {fileURLToPath} from 'url';
import expressHBS from 'express-handlebars';
import session from 'express-session';
import mongoStore from 'connect-mongodb-session';
import mongoose from "mongoose";
import homeRoutes from './routes/home.js';
import addRoutes from './routes/add.js';
import animalsRoutes from './routes/animals.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import varMiddleware from './middleware/variables.js';
import userMiddleware from './middleware/user.js';
import keys from './keys/index.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const log = console.log;

const MongoStore = mongoStore(session)

const app = express();
const hbs = expressHBS.create({
    defaultLayout: 'main',
    extname: 'hbs',
})

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
}))
app.use(csrf())
app.use(varMiddleware)
app.use(userMiddleware)
app.use(flash())

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/animals', animalsRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            // useFindAndModify: false,
        })
        await app.listen(PORT, () => {
            log(`Server is running on PORT: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()

