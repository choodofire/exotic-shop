import {Router} from 'express'
import Animal from '../models/animal.js'
import authMiddleware from '../middleware/auth.js'
import errorsLogFunc from '../utils/errors-helper.js'
import User from "../models/user.js";
import checkAPIs from "express-validator"
import validators from "../utils/validators.js";

const router = Router()
const animalValidators = validators.animalValidators
const {validationResult} = checkAPIs

function isOwner(animal, req) {
    return animal.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const animals = await Animal.find()
            .lean()
            .populate('userId', 'email name')
        res.status(200).render('animals', {
            title: 'Животные',
            isAnimals: true,
            userId: req.user ? req.user._id.toString() : null,
            animals,
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id).lean()
        res.status(200).render('animal', {
            layout: 'empty',
            title: `Животное: ${animal.title}`,
            animal,
        })
    } catch (e) {
        console.log(e)
    }
})


router.get('/:id/edit', authMiddleware, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    try {
        const animal = await Animal.findById(req.params.id).lean()

        if (!isOwner(animal, req) && !req.user.isAdmin) {
            return res.redirect('/animals')
        }
        res.status(200).render('animal-edit', {
            title: `Редактировать ${animal.title}`,
            animal,
        })
    } catch (e) {
        console.log(e);
    }
})

router.post('/edit', authMiddleware, animalValidators, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/animals/${req.body.id}/edit?allow=true`)
    }
    try {
        const {id} = req.body
        delete req.body.id
        const animal = await Animal.findById(id)
        if (!isOwner(animal, req) && !req.user.isAdmin) {
            return res.redirect('/animals')
        }
        Object.assign(animal, req.body)
        await animal.save()
        res.redirect('/animals')
    } catch (e) {
        console.log(e)
    }
})

router.post('/remove', authMiddleware, async (req, res) => {
    try {
        await Animal.deleteOne({
            _id: req.body.id,
            userId: req.user._id,
        })
        res.redirect('/animals')
    } catch (e) {
        console.log(e)
    }
    

})

export default router