class UserDataError extends Error {
    constructor(message, err) {
        super(message);
        this.name = "UserDataError";
        this.err = err;
    }
}

module.exports = UserDataError;