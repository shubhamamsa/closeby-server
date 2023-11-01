class RefreshTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = "RefreshTokenException";
    }
}

module.exports = RefreshTokenError;