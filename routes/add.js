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
    const animal = new Animal(req.body.title, req.body.price, req.body.img)
    await animal.save()
    res.redirect('/animals')

})

export default router