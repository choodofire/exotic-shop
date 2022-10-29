export default await new Promise(async (resolve, reject) => {
        if (process.env.NODE_ENV === "production") {
            const keys = await import('./keys.prod.js')
            console.log("Выбраны ключи для продакшена")
            resolve(keys.default)
        } else {
            const keys = await import('./keys.dev.js')
            console.log("Выбраны ключи для разработки: ", keys.default)
            resolve(keys.default)
        }
    }
)