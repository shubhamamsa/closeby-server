const AuthUtils = require("../util/auth_util");
const EmailError = require("../exceptions/EmailError");
const constants = require("../constants");
const AuthState = require("../db/models/auth_state_model");
const User = require('../db/models/user_model')
const AuthCodeValidationError = require("../exceptions/AuthCodeValidationError");
const RefreshTokenError = require("../exceptions/RefreshTokenError");

exports.authenticateUser = async function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    if (token == null) {
        res.status(401).send("Token missing");
        return;
    }
    try {
        const user = await AuthUtils.verifyAccessToken(token);
        req.body._id = user._id;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).send(err.message);
    }
}

exports.getAuthorizationCode = async function (req, res, next) {
    const emailId = req.query.email;
    if (emailId == null) {
        res.status(400).send("Email Id required");
        return;
    }
    if (await User.findByEmail(emailId) == null) {
        res.status(404).send("User not found");
        return;
    }
    try {
        await AuthState.deleteAllPreviousCodes(emailId);
        const otp = AuthUtils.generateOTP();
        const data = {
            email: emailId,
            code: otp,
            redeemed: false,
            expiry: Date.now() + constants.OTP_EXPIRY_TIME,
        };
        let savedCode = await AuthState.insertCode(data);
        // let sentEmail = await AuthUtils.sendEmail(savedCode);
        // console.log(sentEmail + " " + otp);
        res.status(200).send("Email sent " + otp);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}

exports.getAccessToken = async function (req, res, next) {
    const authType = req.body.authType;
    if (authType == null) {
        res.status(400).send("Auth Type required");
        return;
    }

    const emailId = req.body.email;
    if (emailId == null) {
        res.status(400).send("Email required");
        return;
    }

    if (authType === "code") {
        try {
            const receivedCode = req.body.code;
            const authCode = await AuthState.getCode(emailId);
            if (authCode == null) {
                res.status(400).send("Generate a code first");
                return;
            }
            let response = await AuthUtils.getAccessTokenUsingAuthCode(emailId, authCode, receivedCode);
            res.status(200).send(response);
        } catch (err) {
            console.log(err);
            if (err instanceof AuthCodeValidationError) {
                res.status(401).send("Invalid or expired OTP");
            } else {
                res.status(500).send("Internal Server Error");
            }
        }
    } else if (authType === "refresh_token") {
        try {
            const refreshToken = req.body.refreshToken;
            console.log(refreshToken);
            let response = await AuthUtils.getAccessTokenUsingRefreshToken(refreshToken);
            res.status(200).send(response);
        } catch (err) {
            if (err instanceof RefreshTokenError) {
                res.status(401).send("Invalid or expired Refresh Token");
            } else {
                res.status(500).send("Internal Server Error");
            }
        }
    }
}