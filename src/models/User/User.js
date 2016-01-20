import {
  modelize,
  Schema,
  unique,
  required,
  isEmail,
  isAlphanumeric,
} from 'core/mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    validate: [isAlphanumeric],
    unique,
    required,
    minlength: 6,
    maxlength: 18,
  },
  email: {
    type: String,
    validate: [isEmail],
    unique,
    required,
  },
  nickname: {
    type: String,
    minlength: 4,
    maxlength: 18,
    required,
  },
  passports: [{
    type: String,
    ref: 'Passport',
  }],
});

const User = modelize('User', userSchema);

export default User;