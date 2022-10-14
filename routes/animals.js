import {Router} from 'express'
import Animal from '../models/animal.js'

const router = Router()

router.get('/', async (req, res) => {
    const animals = await Animal.getAll()
    res.status(200).render('animals', {
        title: 'Животные',
        isAnimals: true,
        animals,
    })
})

router.get('/:id', async (req, res) => {
    const animal = await Animal.getById(req.params.id)
    res.render('animal', {
        layout: 'empty',
        title: `Животное: ${animal.title}`,
        animal,
    })
})

export default router