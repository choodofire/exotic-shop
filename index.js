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
import profileRoutes from './routes/profile.js'
import varMiddleware from './middleware/variables.js';
import userMiddleware from './middleware/user.js';
import fileMiddleware from './middleware/file.js'
import helmet from 'helmet'
import compression from "compression"
import keys from './keys/index.js'
import hbsHelper from './utils/hbs-helper.js'
import errorHandler from './middleware/error404.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const log = console.log;

const MongoStore = mongoStore(session)

const app = express();
const hbs = expressHBS.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: hbsHelper,
})

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/avatars', express.static(path.join(__dirname, 'avatars')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
}))
app.use(fileMiddleware.single("avatar"))
app.use(csrf())
app.use(varMiddleware)
app.use(userMiddleware)
app.use(flash())
// app.use(helmet())
app.use(compression())

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/animals', animalsRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)


app.use(errorHandler)

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

