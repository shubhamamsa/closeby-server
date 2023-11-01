class UserNotFoundError extends Error {
    constructor(message, err) {
        super(message);
        this.name = "UserNotFoundError";
        this.err = err;
    }
}

module.exports = UserNotFoundError;