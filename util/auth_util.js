const dotenv = require('dotenv');
const constants = require("../constants");
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
let nodemailer = require('nodemailer')
const EmailError = require("../exceptions/EmailError");
const AuthCodeValidationError = require("../exceptions/AuthCodeValidationError");
const RefreshTokenError = require("../exceptions/RefreshTokenError");
const AuthState = require("../db/models/auth_state_model");
const User = require("../db/models/user_model");
const AccountCredentials = require('../db/models/account_credentials_model')
const AuthUtils = require("./auth_util");

dotenv.config({
    path: "../.env"
});

exports.generateAccessToken = function (authBody) {
    return jwt.sign(
        authBody,
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: constants.ACCESS_TOKEN_EXPIRY_TIME}
    );
}

exports.generateRefreshToken = function (authBody) {
    return jwt.sign(
        authBody,
        process.env.REFRESH_TOKEN_SECRET
    );
}

exports.verifyAccessToken = function (accessToken) {
    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
}

exports.verifyRefreshToken = function (refreshToken) {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
}

exports.getAccessTokenUsingAuthCode = async function (emailId, authCode, receivedCode) {
    await AuthUtils.verifyOTP(authCode, receivedCode);
    await AuthState.deleteAllPreviousCodes(emailId);
    const user = await User.findByEmail(emailId);
    const authBody = {_id: user._id};
    const accessToken = await AuthUtils.generateAccessToken(authBody);
    const refreshToken = await AuthUtils.generateRefreshToken(authBody);
    await AccountCredentials.saveCredential({userId: user._id, refreshToken: refreshToken});
    return {access_token: accessToken, refresh_token: refreshToken};
}

exports.getAccessTokenUsingRefreshToken = async function(refreshToken) {
    let user = await AuthUtils.verifyRefreshToken(refreshToken);
    if(AccountCredentials.credentialCount(user._id, refreshToken) === 0) {
        throw new RefreshTokenError("Invalid or expired refresh token");
    }
    const authBody = {_id: user._id};
    const accessToken = await AuthUtils.generateAccessToken(authBody);
    return {access_token: accessToken, refresh_token: refreshToken};
}

exports.generateOTP = function () {
    return otpGenerator.generate(
        constants.OTP_LENGTH,
        {
            lowerCaseAlphabets: false,
            specialChars: false
        }
    );
}

exports.verifyOTP = async function (data, code) {
    if(Date.now() > data.expiry)    {
        throw new AuthCodeValidationError("Code has expired");
    }
    if(code !== data.code)  {
        throw new AuthCodeValidationError("Code is invalid");
    }
}

exports.sendEmail = async function (data) {
    let transporter = await nodemailer.createTransport(transport);
    await transporter.verify((err, success) => {
        if (err) {
            throw new EmailError("Error connecting to Email transporter", err);
        }
    });
    const mail = createEmailMessage(data);
    await transporter.sendMail(mail, (err, data) => {
        if (err) {
            console.log(err);
            throw new EmailError("Error sending email", err);
        }
    });
}

let createEmailMessage = (data) => {
    return {
        from: "no-reply@closeby.space",
        to: data.email,
        subject: "Verify your CloseBy space",
        text: createEmailBody(data.code)
    }
}

let createEmailBody = (otp) => {
    return `<div style="padding: 20px; background-color: rgb(255, 255, 255); font-family: Helvetica,sans-serif">
    <div style="color: rgb(0, 0, 0); text-align: left;">
        <h1 style="margin: 1rem 0">Hello There,</h1>
        <p style="padding-bottom: 16px">Please use the verification code below to sign in.</p>
        <p style="padding-bottom: 16px"><strong style="font-size: 130%">${otp}</strong></p>
        <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
        <p style="padding-bottom: 16px">Thanks,<br>The CloseBy team</p>
    </div>
</div>`;
}

let transport = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
}