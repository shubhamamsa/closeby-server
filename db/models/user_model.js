let mongoose = require('mongoose');
let validator = require('validator')

let userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    location: {
        timestamp: Number,
        latitude: Number,
        longitude: Number,
    },
    friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
    }],
    image: String,
});

userSchema.statics.createUser = function (data) {
    let user = new this(data);
    return user.save();
}

userSchema.statics.findByEmail = function (email) {
    return this.findOne({email: email});
}

userSchema.statics.findById = function (id) {
    id = new mongoose.Types.ObjectId(id);
    return this.findOne({_id: id});
}

userSchema.statics.isConnected = function (id, userId) {
    id = new mongoose.Types.ObjectId(id);
    userId = new mongoose.Types.ObjectId(userId);
    return this.count({_id: id, friends: {$elemMatch: {$eq: userId}}});
}

userSchema.statics.connectUser = async function (id, userId) {
    id = new mongoose.Types.ObjectId(id);
    userId = new mongoose.Types.ObjectId(userId);
    let filter = {_id: id};
    let update = {$push: {friends: userId}};
    await this.findOneAndUpdate(filter, update, {new: true});
    filter = {_id: userId};
    update = {$push: {friends: id}};
    await this.findOneAndUpdate(filter, update, {new: true});
    return this.findOne({_id: userId}, {friends: 0});
}

userSchema.statics.disconnectUser = async function (id, userId) {
    id = new mongoose.Types.ObjectId(id);
    userId = new mongoose.Types.ObjectId(userId);
    let filter = {_id: id};
    let update = {$pull: {friends: userId}};
    await this.findOneAndUpdate(filter, update, {new: true});
    filter = {_id: userId};
    update = {$pull: {friends: id}};
    await this.findOneAndUpdate(filter, update, {new: true});
}

userSchema.statics.updateLocation = function (id, locationData) {
    id = new mongoose.Types.ObjectId(id);
    const filter = {_id: id};
    const update = {
        "location.timestamp": locationData.timestamp,
        "location.latitude": locationData.latitude,
        "location.longitude": locationData.longitude
    };
    return this.findOneAndUpdate(filter, update, {new: true});
}

userSchema.statics.getFriendLocation = function (id) {
    id = new mongoose.Types.ObjectId(id);
    return this.findOne({_id: id}, {_id: 0, friends: 1}).populate({path: "friends", select: "_id, location"});
}

module.exports = mongoose.model('User', userSchema);