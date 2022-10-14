import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.status(200).render('animals', {
        title: 'Животные',
        isAnimals: true,
    })
})

export default router