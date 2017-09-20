var mongoose = require("mongoose");
//passport local plug in
var passportLocalMongoose = require("passport-local-mongoose");

//Creating a user model
var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

//this provides us with methods to add to the User model
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
