import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.status(200).render('index', {
        title: 'Главная страница',
        isHome: true,
    })
})

export default router