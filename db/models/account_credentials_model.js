let mongoose = require('mongoose')

let accountCredentialsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    refreshToken: String,
});

accountCredentialsSchema.statics.saveCredential = function (data) {
    let credential = this(data);
    return credential.save();
}

accountCredentialsSchema.statics.credentialCount = function (userId, refreshToken) {
    userId = new mongoose.Types.ObjectId(userId);
    return this.count({userId: userId, refreshToken: refreshToken});
}

accountCredentialsSchema.statics.deleteCredential = function (userId, refreshToken) {
    userId = new mongoose.Types.ObjectId(userId);
    return this.delete({userId: userId, refreshToken: refreshToken});
}

accountCredentialsSchema.statics.deleteAllCredentials = function (userId) {
    userId = new mongoose.Types.ObjectId(userId);
    return this.delete({userId: userId});
}

module.exports = mongoose.model('AccountCredentials', accountCredentialsSchema);