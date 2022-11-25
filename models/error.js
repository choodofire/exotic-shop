import Realm from "realm"

const ErrorsSchema = {
    name: "Error",
    properties: {
        message: "string",
        stackTrace: "string",
        userEmail: "string?",
        userId: "objectId?",
        url: "string",
        timestamp: "date",
    }
}

const errorRealm = new Realm({
    path: "errors.realm",
    schema: [ErrorsSchema]
})

export default errorRealm

