import {Schema, model} from 'mongoose'

const errorSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    stackTrace: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
    },
    url: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export default model('ErrorLog', errorSchema)

