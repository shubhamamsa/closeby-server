// const dotenv = require('dotenv');
//
// const mongoose = require('mongoose');
// const Space = require('../db/models/space_model')
// const User = require('../db/models/user_model')
//
// dotenv.config();
//
// exports.createSpace = function(req, res, next)  {
//     const {userId, spaceName} = req.body
//     if(userId == null)  {
//         res.sendStatus(400).send("User Id required");
//     }
//     else if(spaceName == null)  {
//         res.sendStatus(400).send("Space Name required");
//     }
//     let newSpace = Space.insertNewSpace(spaceName);
//     User.insertNewSpace(newSpace._id);
//     res.sendStatus(200).send(newSpace);
// }
//
// exports.getSpace = async function (req, res, next)    {
//     let spaceId = req.query.space_id;
//     let userId = req.query.user_id;
//     if(userId == null)  {
//         res.status(400).send("User Id required");
//     }
//     else if(spaceId == null)  {
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
//
// exports.addSpace = function(req, res, next)  {
//     const {userId, spaceId} = req.body
//     if(userId == null)  {
//         res.sendStatus(400).send("User Id required");
//     }
//     else if(spaceId == null)  {
//         res.sendStatus(400).send("Space Id required");
//     }
//     User.insertNewSpace(newSpace._id);
//     res.sendStatus(200).send(newSpace);
// }
//
// exports.removeSpace = function(req, res, next)  {
//     const {userId, spaceId} = req.body
//     if(userId == null)  {
//         res.sendStatus(400).send("User Id required");
//     }
//     else if(spaceId == null)  {
//         res.sendStatus(400).send("Space Id required");
//     }
//     User.insertNewSpace(newSpace._id);
//     res.sendStatus(200).send(newSpace);
// }