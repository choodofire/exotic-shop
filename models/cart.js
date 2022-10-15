import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const p = path.join(__dirname, '..', 'data', 'cart.json')

class Cart {
    static async add(animal) {
        const cart = await Cart.fetch()

        const idx = cart.animals.findIndex(c => c.id === animal.id)
        const candidate = cart.animals[idx]

        if (candidate) {
            //животное уже есть
            candidate.count++
            cart.animals[idx] = candidate
        } else {
            //Нужно добавить
            animal.count = 1
            cart.animals.push(animal)
        }

        cart.price += +animal.price

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static async remove(id) {
        const cart = await Cart.fetch()
        const idx = cart.animals.findIndex(c => c.id === id)
        const animal = cart.animals[idx]

        if (animal.count === 1) {
            //удалить
            cart.animals = cart.animals.filter(c => c.id !== id)
        } else {
            //изменить кол-во
            cart.animals[idx].count--
        }

        cart.price -= animal.price

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve(cart)
                }
            })
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }
            })
        })
    }
}

export default Cart