let mongoose = require('mongoose');
let validator = require('validator')

let authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    code: String,
    redeemed: Boolean,
    expiry: Date,
});

authSchema.statics.insertCode = function (data) {
    let authCode = new this(data);
    return authCode.save();
}

authSchema.statics.getCode = function (email)   {
    return this.findOne({email: email});
}

authSchema.statics.deleteAllPreviousCodes = function (email) {
  return this.deleteMany({email: email});
}

module.exports = mongoose.model('AuthState', authSchema);