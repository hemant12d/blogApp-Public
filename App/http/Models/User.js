const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const defaultConfig = require('../../../config/constants');

// Templete for user
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      // It not throw an error, but convert the string to lower
      lowercase: true,
      required: [true, "User must have email"],
      unique: [true, "Email already exists"],
      validate: {
        validator(email) {
          // eslint-disable-next-line max-len
          const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
          return emailRegex.test(email);
        },
        message: '{VALUE} is not a valid email.',
      },
    },
    userName: {
      type: String,
      required: [true, "User must have name"],
      unique: true,
      // It not throw an error, but convert the string to lower
      lowercase: true,

      // max & min properties won't work with number
      minLength: [4, "Username at least contain 4 characters"],
      maxLength: [15, "Username can't be greater than 15 characters"],
      validate: {
        validator: function (userName) {
          return (userName !== this.email);
        },
        message: "Username can't be same as email"
      }

    },
    profile: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, "User must have password"],
    },
    role: {
      type: String,
      enum: defaultConfig.userRoles,
      default: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEmailVarified: {
      type: Boolean,
      default: false,
    },
    tokens:[String],
    passwordChangeAt: Date,
    passwordResetToken:  String,
    passwordResetExpires: Date
  },
  {
    timestamps: true,
  }
);
   

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.isDeleted;
  delete obj.isEmailVarified;
  delete obj.tokens;
  delete obj.role;
  delete obj.password;
  delete obj.updatedAt;
  return obj;
}

// Increment the user password (Document pre M/W) 
userSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next();

  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;
  return next();
})


// Implment the password match functionality

/**
 * 
 * @param {String} password 
 * @param {String} hashPassword 
 * @returns {Boolean}
 */

// Note (Till now, this function only work with the query that fetch a single document)
userSchema.methods.matchPassword = async function(password, hashPassword){
  return await bcrypt.compare(password, hashPassword);
}


// Generate the reset Token

userSchema.methods.createPasswordResetToken = function(){
  
  // Generate the token
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Output be Like => ec065ab4a37b300ad9c03141bb10ed497f09cd225d9064cd7d80cc05b40ef23d

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  // Output be Like => 2184e84e5993f28a1419cf2ef9dde6ce02d62a4d5d724bc1d51c1f31faad8aaa

  // Please note that you need to specify a time to expire this token. In this example is (10 min)  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

/**
 * 
 * @param {Time} tokenCreatedTime 
 * @returns 
 */

// CheckPassword change (check if jwtToken is created after checkPasswordChange or not)
userSchema.methods.checkPasswordChange = function(tokenCreatedTime){

  // If user not changed the password till now
  if(!this.passwordChangeAt) return false;


  // if user change the password 
  let passwordChange_Time_In_Seconds = (new Date(this.passwordChangeAt)).getTime()/1000;
  
  console.log("password change time in second", passwordChange_Time_In_Seconds)
  
  // return true, Then token is generated before passwordChange)
  return (passwordChange_Time_In_Seconds > tokenCreatedTime); 
}


// Compile userSchema
const User = mongoose.model("User", userSchema);

module.exports = User;
