const mongoose = require('mongoose');
const validator = require('validator');

var userSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: [true, 'firstName is required'],
      minlength: 5,
      maclength: 50,
   },
   lastName: {
      type: String,
      required: [true, 'lastName is required'],
      minlength: 5,
      maclength: 50,
   },
   email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
   },
   mobile: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isMobilePhone, 'Please provide a valid phone number'],
   },
   password: {
      type: String,
      required: [true, 'Please provide a valid password'],
      minlength: 8,
      select: false,
      validate: [
         validator.isStrongPassword,
         'Password must be at least 8 characters, at least one uppercase letter, one number and one symbol',
      ],
   },
   passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: [validator.equals(this.passwordConfirm, this.password), 'Passwords do not match'],
   },
   role: {
      type: String,
      enum: {
         values: ['Administration', 'Resident'],
         message: 'A role can be only Administration or Resident',
      },
   },
   housenumber: {
      type: String,
      required: [true, 'House number is required field'],
      minlength: 1,
      maxlength: 5,
   },
   entrance: {
      type: Number,
      minlength: 1,
      maxlength: 2,
   },
   apartment: {
      type: String,
      required: [true, 'Apartment is a required field'],
      minlength: 1,
      maxlength: 5,
   },
   active: {
      type: Boolean,
      default: true,
      select: false,
   },
   asswordChangedAt: Date,
});

userSchema.pre('save', async function () {
   //Only run this function if password was actually modified
   if (!this.isModified(password)) return next();

   this.password = await bcrypt.hash(this.password, 12);
   // Delete passwordConfirm field
   this.passwordConfirm = undefined;
   next();
});

userSchema.pre('save', function (next) {
   if (!this.isModified('password') || this.isNew) return next();

   this.passwordChangedAt = Date.now() - 1000;
   next();
});

//Export the model
module.exports = mongoose.model('User', userSchema);
