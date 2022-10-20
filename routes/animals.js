import {Router} from 'express'
import Animal from '../models/animal.js'
import authMiddleware from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
    const animals = await Animal.find()
        .lean()
        .populate('userId', 'email name')
    res.status(200).render('animals', {
        title: 'Животные',
        isAnimals: true,
        animals,
    })
})

router.get('/:id', async (req, res) => {
    const animal = await Animal.findById(req.params.id).lean()
    res.status(200).render('animal', {
        layout: 'empty',
        title: `Животное: ${animal.title}`,
        animal,
    })
})


router.get('/:id/edit', authMiddleware, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')

    }
    const animal = await Animal.findById(req.params.id).lean()
    res.status(200).render('animal-edit', {
        title: `Редактировать ${animal.title}`,
        animal
    })
})

router.post('/edit', authMiddleware, async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Animal.findByIdAndUpdate(id, req.body).lean()
    res.redirect('/animals')
})

router.post('/remove', authMiddleware, async (req, res) => {
    try {
        await Animal.deleteOne({_id: req.body.id})
        res.redirect('/animals')
    } catch (e) {
        console.log(e)
    }
    

})

export default router