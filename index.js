import express from "express";
import path from 'path';
import {fileURLToPath} from 'url';
import expressHBS from 'express-handlebars'
import mongoose from "mongoose";
import homeRoutes from './routes/home.js'
import addRoutes from './routes/add.js'
import animalsRoutes from './routes/animals.js'
import cartRoutes from './routes/cart.js'
import ordersRoutes from './routes/orders.js'
import User from './models/user.js'


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

app.use( async (req, res, next) => {
    try {
        const user = await User.findById('634beec36c5989fcb277669c')
        req.user = user
        next()
    }   catch (e) {
        console.log(e)
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/animals', animalsRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)


async function start() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            // useFindAndModify: false,
        })
        const candidate =  await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'ResSlavkaRes@mail.ru',
                name: 'Vyacheslav',
                cart: {items: []}
            })
            await user.save()
        }
        await app.listen(PORT, () => {
            log(`Server is running on PORT: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()

