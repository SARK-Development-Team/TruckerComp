const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');

const cors = require('cors');

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const DOT = '2129644'
const URL = 'https://ai.fmcsa.dot.gov/SMS/Carrier/DOT/CarrierRegistration.aspx';


// for environment variables
require('dotenv').config()

// for email function
const nodemailer = require('nodemailer');
const {google, GoogleApis} = require('googleapis');


// Passport is responsible for the user's login/logout behavior
const passport = require('passport');
require('./config/passport')(passport);


const app = express();


// Middleware

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(function(req, res, next){
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;
  
    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;
  
    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;
  
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, '/public')));


// handlebars is the template engine for the site
const hbars = require('handlebars');
const handle = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
app.engine('handlebars', handle({
    defaultLayout: 'index',
    handlebars: allowInsecurePrototypeAccess(hbars)
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));



// SQl Server is accessed to search the DOT on the dashboard page
const sql = require('mssql')


const db = require('./models');

// Azure is where the completed client lead is stored
const azure = require('azure-storage');
const tableSvc = azure.createTableService(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_ACCESS_KEY);

const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');





// For the sendMail() function
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
// Mental note: Auth object is VERY sensitive. Exact route of objects goes like this.
// 1) inject oAuth2Client with refresh_token using setCredentials({ refresh_token: REFRESH_TOKEN }),
// 2) nodemailer.createTransport: use the SMTP transport object, which uses host, port, secure, + auth.
// 3) auth object has to be exactly typed!
/*
    auth {
        type: 'OAUTH2' or 'OAuth2',
        user: USER_EMAIL (required),
        clientId: CLIENT_ID (required),
        clientSecret: CLIENT_SECRET (required),
        accessToken (string): ACCESS_TOKEN 
    }

    Do not use refresh token in the auth object unless you know that you can get a successful authentication response. If the auth.refresh_token is filled in,
    nodeemailer WILL TRY TO AUTHENTICATE, even if the access_token exists. Get the access token before hand.
*/

async function sendEmail(data) {
    try {
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        const accessToken = await oAuth2Client.getAccessToken();

        var transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: "wc@sarkinsurance.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                accessToken: accessToken.token
            }
        });

        const quote = calculateQuote(data)
        const htmlBody = `
            <h1>Hello ${data.email},<h1>
            <p>Based on the information you've provided, we estimate that we can provide a monthly worker's comp premium of ${(quote *0.8).toFixed(2)} &mdash; ${(quote *1.2).toFixed(2)} </p>
            <h1>Please call 415 xxx xxxx to purchase a policy now!</h1>
        `

        const mailOptions = {
            from: "wc@sarkinsurance.com",
            to: data.email,
            subject: "Your workers' compensation insurance quote from Trucker Comp",
            text: 'Hello text version',
            html: htmlBody
        };

        const result = await transport.sendMail(mailOptions);
        return result;

    } catch (error) {
        console.log(error)
        return error;
    }
};

// This function is the basic quote calculation formula
function calculateQuote(data) {
    // let empArray = data.employees;
    // 'typeTotal' will increase by a given amount based on the number and type of employees   
    // let typeTotal = 0;
    // 'payRollTotal' will increase based on the total combined payroll
    // let payrollTotal = 0;
    // for (let i =0; i<empArray.length; i++) {
    //     if (empArray[i].type =='driver') {
    //         // 1.5 for every driver
    //         typeTotal+= empArray[i].number*1.5;
    //     } else {
    //         // 1 for all other employee types
    //         typeTotal+= empArray[i].number;
    //     }
    //     payrollTotal+=empArray[i].payroll;
    // }
    const payrollFactor = 0.0002;
    // const typeFactor = 0;
    const mileageFactor = 0.00005;
    // return (payrollTotal *0.000002 + typeTotal * 0.85 + data.mileage * 0.000005);
    return (data.totalPayroll*payrollFactor + data.mileage * mileageFactor);
};


// This function searches the sark DB for a client based on the DOT entered
async function sqlSearch(number) {
    try {
        let pool = await sql.connect(process.env.SQL_CONNSTRING)
        let result1 = await pool.request()
            .query(`SELECT * FROM sark.Client WHERE [DOT Number] = ${number}`)
        // console.log(result1.recordset[0]);
        return (result1.recordset[0])
    } catch (err) {
       console.log(err);
    }
};

// ////////////
///////////////
///////////////

async function fmcsaSearch(number) {
    try {
      var html = '';
      var $;
      axios.get(URL.replace('DOT', DOT))
          .then(response => {
              html = response.data,
              $ = cheerio.load(html),
              console.log("this thing", $('article').children('h2').contents());
              // .children('h2').contents());
          })
          .catch(error => {
              console.log(error)
          })

    } catch(err) {
      console.log(err);
    }
}

// This function saves the new "lead" object in the Azure DB, using the DOT as the row key
function azureSave(object) {
    // Build the "lead" object from the data passed in
    // const rowKey = object._ID.toString();
    const empString = JSON.stringify(object.employees);
    const userID = object._id.toString()
    var stage;
    if (object.stage==1) stage=2;
    const lead = {
        PartitionKey: {'_':'leads'},
        RowKey: {'_': userID},
        name: {'_': object.name},
        email: {'_': object.email},
        DOT: {'_': object.DOT},
        MC: {'_': object.MC},
        totalPayroll: {'_': object.totalPayroll},
        mileage: {'_': object.mileage},
        companyName: {'_': object.companyName},
        address: {'_': object.address},
        mailingAddress: {'_': object.mailingAddress},
        phone: {'_': object.phone},
        employees: {'_': empString},
        powerUnits: {'_': object.powerUnits},
        stage: {'_': stage}
      };
    //   Create the table if it does not exist already
    tableSvc.createTableIfNotExists('sarkleads', function(err, result, response){
    // If there is no error
    if(!err){
        // insert the "lead" object into the table
        try {
            tableSvc.insertOrReplaceEntity('sarkleads',lead, function (err, result, response) {
                if(!err){
                    return;
                } else {
                    console.log(err);
                }
            });
        } catch(err) {
            console.log(err)
        }
    } else {
        console.log(err);
    }
  });
};

// This function is used to find the lead in the Azure Storage table
async function azureSearch(id) {
  return new Promise((resolve) => {
      tableSvc.retrieveEntity('sarkleads', 'leads', id, (err, result, response) => {
          if (!err) {
              resolve(response.body);
          } else {
              console.log(err);
          }
      });
  }); 
}


/* --------------------------
         API ROUTES
-------------------------- */


// app.get('/', (req, res) => {
//     res.render('main',  {layout: "index"},);
// })
app.get('/', (req, res) => {
    res.render('main2',  {layout: "index"},);
})

// This function receives the request from the client side with the initialFormData, runs it through the formula, and returns a number
app.post('/quote', (req, res) => {
    const result = calculateQuote(req.body);
    return res.json({ result });
})

// This route is responsible for sending the email.
app.post('/send', (req, res) => {
    sendEmail(req.body);
    // .then((result)=> console.log('Email sent...', result)).catch((error) => console.log(error.message));
});


// Show Login Page
app.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Show Register Page
app.get('/register', forwardAuthenticated, (req, res) => res.render('register'));


// Register the user in the Mongo Database
app.post('/register', (req, res) => {
  const { name, email, password, password2, businessType, zipCode, mileage, totalPayroll } = req.body;
  var DOT, MC, companyName, address, mailingAddress, phone, powerUnits;
  DOT = MC = companyName = address = mailingAddress = phone = powerUnits = '';
  const stage = 1;
  if (req.body.employees) {
    employees = JSON.parse(req.body.employees);
  } else {
    employees = [];
  }
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
          zipCode,
          DOT,
          MC,
          companyName,
          address,
          mailingAddress,
          phone,
          powerUnits,
          stage
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
                res.render('login', {email: email});
              })
              .catch(err => console.log(err));
          });
        });
      }
    }).catch(err => console.log(err));
  }
});

// Login
app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: 'dashboard',
    failureRedirect: 'login',
    failureFlash: true,
  })(req, res, next);
});

// Logout
app.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('login');
  // console.log("locals:", res.locals);
  // console.log("sesh:", req.session.flash.success_msg);
});

// Dashboard
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    user: req.user
  })
});

// Search User
app.post('/user', async (req, res) => {
  const user = await azureSearch(req.body.id)
  return res.json({ user });
});


// This route performs a search through the sark client DB for the DOT number entered
// Returns an object that is partially displayed in the "result" box
app.post('/dot', async (req, res) => {
  const result = await sqlSearch(req.body.dot);   
  // const result = await fmcsaSearch(req.body.dot);
  return res.json({ result });
});


// This route saves the user input into the Azure Storage DB
app.post('/lead', (req, res) => {
  try {
    db.User.findOneAndUpdate({ _id: req.body._id }, req.body)
    .then(console.log("successfully updated"))
    .catch((err)=>console.log(err)); 

  } catch (err) {
    console.log("Db error:", err);
  }
  try {
    console.log("trying to save in Azure");
    azureSave(req.body);
  } catch (err) {
    console.log("Error Saving:", err);
  }
  res.send(`<p>Thank you for confirming! We will contact you shortly!</p>`);
});

// This route is not currently being used
app.post('/zip', cors(), (req, res) => {
  const zipcode = req.body.zipcode;
  const app_key=process.env.ZIPCODE_API_APP_KEY;
  const uri = `https://www.zipcodeapi.com/rest/${app_key}/info.json/${zipcode}/degrees`
  $.ajax({
    "url": uri,
    "dataType": "json"
  }).done(function(data) {
    console.log(data);
  })

  // return response;
  // return true;
});

// This listens at port 5001, unless there is a Configuration variable (as on heroku).
app.listen(process.env.PORT || 5001, () => console.log("Server running."));
