import express from "express";
import path from 'path';
import {fileURLToPath} from 'url';
import expressHBS from 'express-handlebars'
import homeRoutes from './routes/home.js'
import addRoutes from './routes/add.js'
import animalsRoutes from './routes/animals.js'
import cartRoutes from './routes/cart.js'
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const log = console.log;
const url = "mongodb+srv://vyacheslav:pgSLiNU2xaCeHIJ7@cluster0.qtqihfc.mongodb.net/shop"

const app = express();
const hbs = expressHBS.create({
    defaultLayout: 'main',
    extname: 'hbs',
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/animals', animalsRoutes)
app.use('/cart', cartRoutes)


async function start() {
    try {
        await mongoose.connect(url, {
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

