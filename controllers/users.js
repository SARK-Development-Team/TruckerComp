
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');
// const flash = require('connect-flash');

// for environment variables
require('dotenv').config()

// SQl Server is accessed to search the DOT on the dashboard page
const sql = require('mssql')

// Passport is responsible for the user's login/logout behavior
const passport = require('passport');
require('../config/passport')(passport);

router.use(passport.initialize());
router.use(passport.session());

const db = require('../models');

// Azure is where the completed client lead is stored
const azure = require('azure-storage');
const tableSvc = azure.createTableService(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_ACCESS_KEY);

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// router.use(flash());


// This function searches the sark DB for a client based on the DOT entered
async function sqlSearch(number) {
  try {
      let pool = await sql.connect(process.env.SQL_CONNSTRING)
      let result1 = await pool.request()
          .query(`SELECT * FROM sark.Client WHERE [DOT Number] = ${number}`)
      return (result1.recordset[0])
  } catch (err) {
     console.log(err)
  }
}


// This function saves the new "lead" object in the Azure DB, using the DOT as the row key
function azureSave(object) {
  // Build the "lead" object from the data passed in
  const rowKey = object.DOT.toString();
  const lead = {
      PartitionKey: {'_':'leads'},
      RowKey: {'_': rowKey},
      name: {'_': object.name},
      email: {'_': object.email},
      DOT: {'_': object.DOT},
      MCP: {'_': object.MCP},
      totalPayroll: {'_': object.totalPayroll},
      mileage: {'_': object.mileage},
      companyName: {'_': object.companyName},
      address: {'_': object.address},
      mailingAddress: {'_': object.mailingAddress},
      phoneNumber: {'_': object.phoneNumber},
      drivers: {'_': object.drivers},
      powerUnits: {'_': object.powerUnits},
    };
  //   Create the table if it does not exist already
  tableSvc.createTableIfNotExists('sarkleads', function(err, result, response){
  // If there is no error
  if(!err){
      // insert the "lead" object into the table
      tableSvc.insertEntity('sarkleads',lead, function (err, result, response) {
          if(!err){
              return
          } else {
              console.log(err)
          }
      });
  } else {
      console.log(err)
  }
});
}


// Login Page
const renderLogin = (forwardAuthenticated, (req, res) => {
    res.render('login', {layout: "auth"})
});

// router.get('/login', forwardAuthenticated, (req, res) => );

// Register Page
// router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {layout: "dashboard"}));

const renderRegister = (forwardAuthenticated, (req, res) => {
    res.render('register', {layout: "auth"})
});

// Register
const registerUser = (req, res) => {
    const { name, email, password, password2, businessType, employees, zipCode, mileage, totalPayroll } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
        layout: "auth",
        errors,
        name,
        email,
        password,
        password2
        });
    } else {
        db.User.findOne({ email: email }).then(user => {
        if (user) {
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
            layout: "auth",
            errors,
            name,
            email,
            password,
            password2
            });
        } else {
            const newUser = new db.User({
            name,
            email,
            password,
            businessType,
            employees,
            totalPayroll,
            mileage,
            zipCode
            });

            bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                .save()
                .then(user => {
                    req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                    );
                    res.redirect('/users/login', {email: email});
                    res.render('login', {
                        layout: "auth", 
                        email: email
                    });
                })
                .catch(err => console.log(err));
            });
            });
        }
        }).catch(err => console.log(err));
    }
}

// Login
const loginUser = (req, res, next) => {
  errors = [];
  passport.authenticate('local', {
    successRedirect: 'dashboard',
    failureRedirect: 'login',
    failureFlash: true
  })(req, res, next);
};

// Logout
const logoutUser = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('login');
};

// Dashboard
const openDashboard = (ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        layout: "auth",
        user: req.user
    })
});

module.exports = {
    renderLogin,
    loginUser,
    renderRegister,
    registerUser,
    logoutUser,
    openDashboard
}