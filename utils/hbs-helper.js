const hbsHelp = {
    ifeq(a, b, options) {
        if (a.toString() === b.toString()) {
            return options.fn(this)
        }
        return options.inverse(this)
    }
}

export default hbsHelp