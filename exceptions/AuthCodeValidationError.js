class AuthCodeValidationError extends Error {
    constructor(message, err) {
        super(message);
        this.name = "AuthCodeValidationError";
        this.err = err;
    }
}

module.exports = AuthCodeValidationError;