import { v4 as uuid } from 'uuid';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "url";
import Animals from "../routes/animals.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Animal {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = uuid();
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id

        }
    }

    async save() {
        const animals = await Animal.getAll()
        animals.push(this.toJSON())
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'animals.json'),
                JSON.stringify(animals),
                    (err) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve()
                        }
                }
            )
        })
    }

    static async update(animal) {
        const animals = await Animal.getAll()
        const idx = animals.findIndex(c => c.id === animal.id)
        animals[idx] = animal
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'animals.json'),
                JSON.stringify(animals),
                (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'animals.json'),
                'utf-8',
                (err, content) =>{
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(content))
                    }
                }
            )
        })
    }

    static async getById(id) {
        const animals = await Animal.getAll()
        return animals.find(c => c.id === id)
    }
}

export default Animal