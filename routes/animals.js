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
    res.status(200).render('animal', {
        layout: 'empty',
        title: `Животное: ${animal.title}`,
        animal,
    })
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const animal = await Animal.getById(req.params.id)
    res.status(200).render('animal-edit', {
        title: `Редактировать ${animal.title}`,
        animal
    })
})

router.post('/edit', async (req, res) => {
    await Animal.update(req.body)
    res.redirect('/animals')
})

export default router