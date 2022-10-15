import express from "express";
import path from 'path';
import {fileURLToPath} from 'url';
import expressHBS from 'express-handlebars'
import homeRoutes from './routes/home.js'
import addRoutes from './routes/add.js'
import animalsRoutes from './routes/animals.js'
import cartRoutes from './routes/cart.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const log = console.log;

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

app.listen(PORT, () => {
    log(`Server is running on PORT: ${PORT}`)
})