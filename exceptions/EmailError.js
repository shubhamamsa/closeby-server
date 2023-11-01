class EmailError extends Error {
    constructor(message, err) {
        super(message);
        this.name = "EmailError";
        this.err = err;
    }
}

module.exports = EmailError;