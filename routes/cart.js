import {Router} from 'express'
import Cart from '../models/cart.js'
import Animal from "../models/animal.js";

const router = Router()

router.post('/add', async (req, res) => {
    const animal = await Animal.getById(req.body.id)
    await Cart.add(animal)
    res.redirect('/cart')
})

router.get('/', async (req, res) => {
    const cart = await Cart.fetch()
    res.render('cart', {
        title: 'Корзина',
        isCart: true,
        animals: cart.animals,
        price: cart.price,
    })
})

router.delete('/remove/:id', async (req, res) => {
    const cart = await Cart.remove(req.params.id)
    res.status(200).json(cart)
})

export default router