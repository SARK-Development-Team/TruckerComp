const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
// const bcrypt = require('bcrypt');
// const flash = require('connect-flash');
const routes = require('./routes');
// const cors = require('cors');


// for environment variables
require('dotenv').config()


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

/* --------------------------
  The following middleware is 
  currently not being used
-------------------------- */

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(flash());

// app.use(function(req, res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   next();
// });

// app.use(function(req, res, next){
//     var err = req.session.error,
//         msg = req.session.notice,
//         success = req.session.success;
  
//     delete req.session.error;
//     delete req.session.success;
//     delete req.session.notice;
  
//     if (err) res.locals.error = err;
//     if (msg) res.locals.notice = msg;
//     if (success) res.locals.success = success;
  
//     next();
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, '/public')));


// handlebars is the template engine for the site
const hbars = require('handlebars');
const handle = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

app.engine('hbs', handle({
    defaultLayout: 'index',
    handlebars: allowInsecurePrototypeAccess(hbars),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));



/* --------------------------
  The following functions are 
  currently not being used
-------------------------- */


// const db = require('./models');

// // Azure is where the completed client lead is stored
// const azure = require('azure-storage');
// const tableSvc = azure.createTableService(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_ACCESS_KEY);

// const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');


// // This function saves the new "lead" object in the Azure DB, using the DOT as the row key
// function azureSave(object) {
//     // Build the "lead" object from the data passed in
//     // const rowKey = object._ID.toString();
//     const empString = JSON.stringify(object.employees);
//     const userID = object._id.toString()
//     var stage;
//     if (object.stage==1) stage=2;
//     const lead = {
//         PartitionKey: {'_':'leads'},
//         RowKey: {'_': userID},
//         name: {'_': object.name},
//         email: {'_': object.email},
//         DOT: {'_': object.DOT},
//         MC: {'_': object.MC},
//         totalPayroll: {'_': object.totalPayroll},
//         mileage: {'_': object.mileage},
//         companyName: {'_': object.companyName},
//         address: {'_': object.address},
//         mailingAddress: {'_': object.mailingAddress},
//         phone: {'_': object.phone},
//         employees: {'_': empString},
//         powerUnits: {'_': object.powerUnits},
//         stage: {'_': stage}
//       };
//     //   Create the table if it does not exist already
//     tableSvc.createTableIfNotExists('sarkleads', function(err, result, response){
//     // If there is no error
//     if(!err){
//         // insert the "lead" object into the table
//         try {
//             tableSvc.insertOrReplaceEntity('sarkleads',lead, function (err, result, response) {
//                 if(!err){
//                     return;
//                 } else {
//                     console.log(err);
//                 }
//             });
//         } catch(err) {
//             console.log(err)
//         }
//     } else {
//         console.log(err);
//     }
//   });
// };

// // This function is used to find the lead in the Azure Storage table
// async function azureSearch(id) {
//   return new Promise((resolve) => {
//       tableSvc.retrieveEntity('sarkleads', 'leads', id, (err, result, response) => {
//           if (!err) {
//               resolve(response.body);
//           } else {
//               console.log(err);
//           }
//       });
//   }); 
// }


/* --------------------------
         API ROUTES
-------------------------- */


// app.get('/', (req, res) => {
//     res.render('main',  {layout: "index"},);
// })
app.get('/', (req, res) => {
    res.render('main');
})

app.use('/quote', routes.quote);
app.use('/send', routes.send);
app.use('/dot', routes.dot);

app.use('/users', routes.users);

/* --------------------------
   The following routes are 
   currently not being used
-------------------------- */


// // Show Login Page
// app.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// // Show Register Page
// app.get('/register', forwardAuthenticated, (req, res) => res.render('register'));


// // Register the user in the Mongo Database
// app.post('/register', (req, res) => {
//   const { name, email, password, password2, businessType, zipCode, mileage, totalPayroll } = req.body;
//   var DOT, MC, companyName, address, mailingAddress, phone, powerUnits;
//   DOT = MC = companyName = address = mailingAddress = phone = powerUnits = '';
//   const stage = 1;
//   if (req.body.employees) {
//     employees = JSON.parse(req.body.employees);
//   } else {
//     employees = [];
//   }
//   let errors = [];

//   if (!name || !email || !password || !password2) {
//     errors.push({ msg: 'Please enter all fields' });
//   }

//   if (password != password2) {
//     errors.push({ msg: 'Passwords do not match' });
//   }

//   if (password.length < 6) {
//     errors.push({ msg: 'Password must be at least 6 characters' });
//   }

//   if (errors.length > 0) {
//     res.render('register', {
//       errors,
//       name,
//       email,
//       password,
//       password2
//     });
//   } else {
//     db.User.findOne({ email: email }).then(user => {
//       if (user) {
//         errors.push({ msg: 'Email already exists' });
//         res.render('register', {
//           errors,
//           name,
//           email,
//           password,
//           password2
//         });
//       } else {
//         const newUser = new db.User({
//           name,
//           email,
//           password,
//           businessType,
//           employees,
//           totalPayroll,
//           mileage,
//           zipCode,
//           DOT,
//           MC,
//           companyName,
//           address,
//           mailingAddress,
//           phone,
//           powerUnits,
//           stage
//         });

//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;
//             newUser.password = hash;
//             newUser
//               .save()
//               .then(user => {
//                 req.flash(
//                   'success_msg',
//                   'You are now registered and can log in'
//                 );
//                 res.render('login', {email: email});
//               })
//               .catch(err => console.log(err));
//           });
//         });
//       }
//     }).catch(err => console.log(err));
//   }
// });

// // Login
// app.post('/login', (req, res, next) => {
//   passport.authenticate('local', {
//     successRedirect: 'dashboard',
//     failureRedirect: 'login',
//     failureFlash: true,
//   })(req, res, next);
// });

// // Logout
// app.get('/logout', (req, res) => {
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('login');
//   // console.log("locals:", res.locals);
//   // console.log("sesh:", req.session.flash.success_msg);
// });

// // Dashboard
// app.get('/dashboard', ensureAuthenticated, (req, res) => {
//   res.render('dashboard', {
//     user: req.user
//   })
// });

// // Search User
// app.post('/user', async (req, res) => {
//   const user = await azureSearch(req.body.id)
//   return res.json({ user });
// });

// // This route saves the user input into the Azure Storage DB
// app.post('/lead', (req, res) => {
//   try {
//     db.User.findOneAndUpdate({ _id: req.body._id }, req.body)
//     .then(console.log("successfully updated"))
//     .catch((err)=>console.log(err)); 

//   } catch (err) {
//     console.log("Db error:", err);
//   }
//   try {
//     console.log("trying to save in Azure");
//     azureSave(req.body);
//   } catch (err) {
//     console.log("Error Saving:", err);
//   }
//   res.send(`<p>Thank you for confirming! We will contact you shortly!</p>`);
// });

// // This route is not currently being used
// app.post('/zip', cors(), (req, res) => {
//   const zipcode = req.body.zipcode;
//   const app_key=process.env.ZIPCODE_API_APP_KEY;
//   const uri = `https://www.zipcodeapi.com/rest/${app_key}/info.json/${zipcode}/degrees`
//   $.ajax({
//     "url": uri,
//     "dataType": "json"
//   }).done(function(data) {
//     console.log(data);
//   })

//   // return response;
//   // return true;
// });

// This listens at port 5001, unless there is a Configuration variable (as on heroku).
app.listen(process.env.PORT || 5001, () => console.log("Server running."));
