const dotenv = require('dotenv');
const User = require('../db/models/user_model')

dotenv.config();

exports.addFriend = async function (req, res, next) {
    let id = req.body._id;
    let friendId = req.body.friendId;
    if(id === friendId) {
        res.status(400).send("Cannot add yourself");
        return;
    }
    if (await User.findById(friendId) == null) {
        res.status(400).send("User does not exist");
        return;
    }
    if (await User.isConnected(id, friendId) !== 0) {
        res.status(406).send("User already connected");
        return;
    }
    const userData = await User.connectUser(id, friendId);
    res.status(200).json(userData);
}

exports.getLocation = async function (req, res, next) {
    let id = req.body._id;
    const friends = await User.getFriendLocation(id);
    res.status(200).json(friends);
}

// exports.getSpace = async function (req, res, next) {
//     let spaceId = req.query.spaceId;
//     let userId = req.query.userId;
//     if (userId == null) {
//         res.status(400).send("User Id required");
//     } else if (spaceId == null) {
//         res.status(400).send("Space Id required");
//     }
//     spaceId = new mongoose.Types.ObjectId(spaceId);
//     userId = new mongoose.Types.ObjectId(userId);
//     try {
//         let space = await User.usersToSpaceAggregator(spaceId, userId);
//         res.status(200).json(space);
//     } catch (e) {
//         console.log(e);
//         res.status(500).json({error: "Internal server error"});
//     }
// }

// exports.addSpace = async function (req, res, next) {
//     const {userId, spaceId} = req.body
//     if (userId == null) {
//         res.sendStatus(400).send("User Id required");
//     } else if (spaceId == null) {
//         res.sendStatus(400).send("Space Id required");
//     }
//     await User.insertNewSpace(newSpace._id);
//     res.sendStatus(200).send(newSpace);
// }