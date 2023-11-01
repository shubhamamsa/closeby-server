const dotenv = require('dotenv');
const User = require('../db/models/user_model')
const UserDataError = require("../exceptions/UserDataError");

dotenv.config();

exports.register = async function (req, res, next) {
    try {
        let emailId = req.body.email;
        if(await User.findByEmail(emailId) != null) {
            res.status(403).send("User already registered");
            return;
        }
        let user = createUserPayload(req.body);
        let savedUser = await User.createUser(user);
        req.query.email = savedUser.email;
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).json({error: "Internal server error"});
    }
}

exports.info = async function (req, res, next) {
    let _id = req.body._id;
    let user = await User.findById(_id);
    if (user == null) {
        res.status(404).send("No user found");
        return;
    }
    res.status(200).json(user);
}

exports.updateLocation = async function (req, res, next) {
    let {timestamp, latitude, longitude} = req.body;
    if(timestamp == null || latitude == null || longitude == null)    {
        res.status(400).send("Location info cannot be null");
        return;
    }
    let locationInfo = {timestamp: timestamp, latitude: latitude, longitude: longitude};
    let _id = req.body._id;
    try {
        let user = await User.updateLocation(_id, locationInfo);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send("Internal server error");
    }
}

let createUserPayload = (request) => {
    if(request.email == null || request.firstName == null || request.lastName == null)    {
        throw new UserDataError("Incomplete user data");
    }
    return {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        location: {
            timestamp: null,
            latitude: null,
            longitude: null
        },
        friends: [],
        image: null
    }
}