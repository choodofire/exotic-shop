import {Router} from 'express'
import User from '../models/user.js'
import bcrypt from 'bcryptjs'

const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError'),
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        const candidate = await User.findOne({email})
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                const user = candidate
                req.session.user = user
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    } else {
                        res.redirect('/')
                    }
                })
            } else {
                req.flash('loginError', 'Неверный пароль')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Такого пользователя не существует')
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }
})

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            req.flash('registerError', 'Пользователь с таким email уже зарегистрирован')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 12)
            const user = new User({
                email: email,
                name: name,
                password: hashPassword,
                cart: {items: []},
            })
            await user.save()
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }
})

export default router