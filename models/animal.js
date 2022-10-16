import {Schema, model} from 'mongoose'

const animal = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String,
})

export default model('Animal', animal)