
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');

// for environment variables
require('dotenv').config()

// SQl Server is accessed to search the DOT on the dashboard page
const sql = require('mssql')

// Azure is where the completed client lead is stored
const azure = require('azure-storage');
const tableSvc = azure.createTableService(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_ACCESS_KEY);

// Passport is responsible for the user's login/logout behavior
const passport = require('passport');
require('../config/passport')(passport);

router.use(passport.initialize());
router.use(passport.session());

const db = require('../models');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.use(flash());


// This function searches the sark DB for a client based on the DOT entered
// Currently unused
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

// Login Page
const renderLogin = (forwardAuthenticated, (req, res) => {
    res.render('login', {layout: "layouts/auth", errors: []})
});

// Register Page
// router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {layout: "dashboard"}));

const renderRegister = (forwardAuthenticated, (req, res) => {
    res.render('register', {layout: "layouts/auth", errors: []})
});


// Register
const registerUser = (req, res) => {
    const { name, email, password, password2, businessType, 
        carrierOperation, DOT, companyName, DBA, address, mailingAddress, 
        phone, powerUnits, drivers, operationType, cargoCarried, 
        zipCode, mileage, totalPayroll } = req.body;
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
        layout: "layouts/auth",
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
            layout: "layouts/auth",
            errors,
            name,
            email,
            password,
            password2
            });
        } else {
            const newUser = new db.User({
            carrierOperation, 
            DOT, 
            companyName, 
            DBA, 
            address, 
            mailingAddress, 
            phone, 
            powerUnits, 
            drivers, 
            operationType, 
            cargoCarried, 
            name,
            email,
            password,
            businessType,
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
                    res.render('login', {
                        layout: "layouts/auth", 
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

// This function saves the new "lead" object in the Azure DB, using the DOT as the row key

const updateUser = (req, res) => {
    const object = req.body;
    // Build the "lead" object from the data passed in
    const opTypeString = JSON.stringify(object.operationType);
    const cargoString = JSON.stringify(object.cargoCarried);
    const userID = object._id.toString()
    var stage;
    console.log(object)
    if (object.stage==1) {
        stage=2;
    } else {
        stage=object.stage;
    }
    const lead = {

        operationType: [],
        cargoCarried: [],
        PartitionKey: {'_':'leads'},
        RowKey: {'_': userID},
        name: {'_': object.name},
        email: {'_': object.email},
        DOT: {'_': object.DOT},
        totalPayroll: {'_': object.totalPayroll},
        mileage: {'_': object.mileage},
        companyName: {'_': object.companyName},
        address: {'_': object.address},
        mailingAddress: {'_': object.mailingAddress},
        phone: {'_': object.phone},
        powerUnits: {'_': object.powerUnits},
        drivers: {'_': object.drivers},
        carrierOperation: {'_': object.carrierOperation},
        operationType: {'_': opTypeString},
        cargoCarried: {'_': cargoString},
        stage: {'_': stage}
    };
    //   Create the table if it does not exist already
    tableSvc.createTableIfNotExists('leads', function(err, result, response){
        // If there is no error
        if(!err){
            // insert the "lead" object into the table
            try {
                tableSvc.insertOrReplaceEntity('leads',lead, function (err, result, response) {
                    if(!err){
                        return;
                    } else {
                        console.log(err);
                    }
                    
                });
                // Subsequently updates the Mongo DB with the same data
                // Both updates must pass or the catch is triggered
                db.User.findOneAndUpdate({ _id: userID }, object)
                .then(console.log("Mongo DB successfully updated"))
                .catch((err)=>console.log(err)); 
            } catch(err) {
                console.log(err)
            }
        } else {
            console.log(err);
        }
    });
};

// Dashboard
const openDashboard = (ensureAuthenticated, (req, res) => {
    user = req.user;
    res.render('dashboard', {
        layout: "layouts/auth",
        url: req._parsedUrl.pathname
    })
});

// Profile
// Can only be viewed if the user is logged in
const viewProfile = (ensureAuthenticated, (req, res) => {

    user = req.user;
    res.render('profile', {
        layout: "layouts/auth",
        url: req._parsedUrl.pathname
    })
})


const azureSearch = async (req, res) => {
    return new Promise((resolve) => {
    tableSvc.retrieveEntity('leads', 'email', req.body['email'], (err, result, response) => {
          if (!err) {
              resolve(response.body);
          } else {
              console.log(err);
          }
      });
  }); 
}

const mongoSearch = async (req, res) => {
    const user = await db.User.findOne({ email: req.body['email'] })   
    res.json(user);
}

const showPreviousPolicies = (ensureAuthenticated, (req, res) => {
    res.render('previous-policies', {        
        layout: "layouts/auth",         
        url: req._parsedUrl.pathname,
        errors: []
    })
});

const showDocuments = (ensureAuthenticated, (req, res) => {
    res.render('documents', {
        layout: "layouts/auth",         
        url: req._parsedUrl.pathname,
        errors: []
    })
});

const showApplication = (ensureAuthenticated, (req, res) => {
    res.render('application', {
        layout: "layouts/auth",         
        url: req._parsedUrl.pathname,
        errors: []
    })
});

const initiateNewPolicy = (ensureAuthenticated, (req, res) => {
    res.render('new-policy', {
        layout: "layouts/auth",         
        url: req._parsedUrl.pathname,
        errors: []
    })
});


module.exports = {
    renderLogin,
    loginUser,
    renderRegister,
    registerUser,
    logoutUser,
    updateUser,
    openDashboard,
    viewProfile,
    azureSearch,
    mongoSearch,
    showPreviousPolicies,
    showDocuments,
    showApplication,
    initiateNewPolicy
}