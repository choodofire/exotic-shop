import {Router} from 'express'
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import keys from "../keys/index.js";
import UniSender from 'unisender'
import crypto from "crypto";
import regEmail from '../emails/registration.js';
import resetEmail from '../emails/reset.js'
import checkAPIs from "express-validator"
import registerValidators from "../utils/validators.js";


const router = Router()

const { validationResult} = checkAPIs

const uniSender = new UniSender({
    api_key: keys.MAIL_API_KEY,
    lang: 'ru'                // optional, 'en' by default
});

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
        console.log('Message - ',e.message)
        console.log('Name - ',e.name)
        console.log('Stack - ',e.stack)
    }
})

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, confirm, name} = req.body
        const candidate = await User.findOne({email})

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }

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
            await uniSender.sendEmail(regEmail(email))
        }
    } catch (e) {
        console.log(e)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забыли пароль?',
        error: req.flash('error')
    })
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Восстановить доступ',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token,
            })
        }

    } catch (e) {
        console.log(e)
    }
})

router.post('/reset',  (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Что-то пошло не так, повторите попытку позже')
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({email: req.body.email})

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                await candidate.save()
                await uniSender.sendEmail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Такого email нет')
                res.redirect('/auth/reset')
            }


        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()},
        })
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Время жизни токена истекло')
            res.redirect('/auth/login')
        }

    } catch (e) {
        console.log(e)
    }
})

export default router