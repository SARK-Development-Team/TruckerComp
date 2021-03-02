
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  businessType: {
    type: String,
  },
  employees: {
    type: Array
  },
  totalPayroll: {
    type: Number
  },
  mileage: {
    type: Number
  },
  zipCode: {
    type: Number
  }


});

const User = mongoose.model('User', UserSchema);

module.exports = User;