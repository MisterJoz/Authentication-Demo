var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//add package methods to our schema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);