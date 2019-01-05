const mongoose = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose')
      
// Creating USER model  

const userSchema = new mongoose.Schema({
    username: String,
    password: String 
});

userSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model("User", userSchema);