const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {type: String, required: true, maxLength: 100},
  last_name: {type: String, required: true, maxLength: 100},
  username: {type: String, required: true, maxLength: 100, index: {unique: true}},
  password: {type: String, required: true, maxLength: 100, minLength: 8},
  membership: {type: Boolean},
  admin: {type: Boolean}
})

UserSchema.pre('save', function(next) {
  let user = this;
  //only hash the pasword if the user has been modified or is new
  if(!user.isModified('password')) return next();
  //generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err);
      //override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);