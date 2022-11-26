import {Router} from "express";
import Animal from "../models/animal.js";

const router = Router()

router.get('/snakes', async(req, res) => {
    try {
        const animals = await Animal.find()
            .lean()
            .populate('userId', 'email name')
        res.status(200).render('animals', {
            title: 'Змеи',
            isSnakes: true,
            isShop: true,
            userId: req.user ? req.user._id.toString() : null,
            animals,
        })
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.get('/lizards', async(req, res) => {
    try {
        const animals = await Animal.find()
            .lean()
            .populate('userId', 'email name')
        res.status(200).render('animals', {
            title: 'Ящерицы',
            isLizards: true,
            isShop: true,
            userId: req.user ? req.user._id.toString() : null,
            animals,
        })
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.get('/eublefars', async(req, res) => {
    try {
        const animals = await Animal.find()
            .lean()
            .populate('userId', 'email name')
        res.status(200).render('animals', {
            title: 'Эублефары',
            isEublefar: true,
            isShop: true,
            userId: req.user ? req.user._id.toString() : null,
            animals,
        })
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.get('/spiders', async(req, res) => {
    try {
        const animals = await Animal.find()
            .lean()
            .populate('userId', 'email name')
        res.status(200).render('animals', {
            title: 'Пауки и скорпионы',
            isSpider: true,
            isShop: true,
            userId: req.user ? req.user._id.toString() : null,
            animals,
        })
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.get('/amphibians', async(req, res) => {
    try {
        const animals = await Animal.find()
            .lean()
            .populate('userId', 'email name')
        res.status(200).render('animals', {
            title: 'Амфибии',
            isAmphibian: true,
            isShop: true,
            userId: req.user ? req.user._id.toString() : null,
            animals,
        })
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.get('/turtles', async(req, res) => {
    try {
        const animals = await Animal.find()
            .lean()
            .populate('userId', 'email name')
        res.status(200).render('animals', {
            title: 'Черепахи',
            isTurtle: true,
            isShop: true,
            userId: req.user ? req.user._id.toString() : null,
            animals,
        })
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

export default router