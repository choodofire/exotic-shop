import ErrorLog from '../models/error.js'

const errorsLogFunc = async (err, req) => {
    const errorLog = new ErrorLog({
        message: err.message,
        stackTrace: err.stack,
        userEmail: req.user.email,
        url: req.originalUrl,
    })
    await errorLog.save()
}

export default errorsLogFunc

