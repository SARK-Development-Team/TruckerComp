// This is the Mongo connection version


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
    type: String
  },
  carrierOperation: {
    type: String
  },
  // employees: {
  //   type: Array
  // },
  totalPayroll: {
    type: Number
  },
  mileage: {
    type: Number
  },
  zipCode: {
    type: Number
  },
  DOT: {
    type: Number,
  },
  // MC: {
  //   type: Number,
  // },
  companyName: {
    type: String, 
  },
  DBA: {
    type: String, 
  },
  address: {
    type: String,
  },
  mailingAddress: {
    type: String,
  },
  phone: {
    type: String, 
  },
  powerUnits: {
    type: Number,
  },
  drivers: {
    type: Number,
  },
  // stage: {
  //   type: Number
  // },
  operationType: {
    type: Array
  },
  cargoCarried: {
    type: Array
  }

});

const User = mongoose.model('User', UserSchema);

module.exports = User;


// This is the SQL connection version

// const mssql = require('mssql');
