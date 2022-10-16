import {Router} from 'express'
import Animal from '../models/animal.js'

const router = Router()

router.get('/', (req, res) => {
    res.status(200).render('add', {
        title: 'Добавить животное',
        isAdd: true,
    })
})

router.post('/', async (req, res) => {
    const animal = new Animal({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user._id,
    })

    try {
        await animal.save()
        res.redirect('/animals')
    } catch (e) {
        console.log(e)
    }

})

export default router