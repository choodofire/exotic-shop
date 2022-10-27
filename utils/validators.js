import checkAPIs from "express-validator"

const {body, validationResult} = checkAPIs

const registerValidators = [
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({min: 6, max: 56}).isAlphanumeric(),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать')
        }
        return true
    }),
    body('name').isLength({min: 2, max: 25}).withMessage('Имя должно быть минимум 2 символа')
]

export default registerValidators