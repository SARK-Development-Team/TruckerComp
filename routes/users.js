  
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');


// SQl Server is accessed to search the DOT on the dashboard page
const sql = require('mssql')


// const User = require('../../models/User');
const db = require('../models');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

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
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', {layout: "dashboard"}));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {layout: "dashboard"}));

// Register
router.post('/register', (req, res) => {
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
                // res.redirect('/users/login', {email: email});
                res.render('/users/login', {email: email});
              })
              .catch(err => console.log(err));
          });
        });
      }
    }).catch(err => console.log(err));
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/myInfo',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

// Dashboard
router.get('/myInfo', ensureAuthenticated, (req, res) =>
  res.render('myInfo', {
    user: req.user
  })
);


// This route performs a search through the sark client DB for the DOT number entered
// Returns an object that is partially displayed in the "result" box
router.post('/dot', async (req, res) => {
  const result = await sqlSearch(req.body.dot);   
  return res.json({ result });
});


// This route saves the user input into the Azure Storage DB
router.post('/lead', (req, res) => {
  azureSave(req.body);
  res.send(`<p>Thank you for confirming! We will contact you shortly!</p>`);
});


module.exports = router;