const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


const routes = require('./routes');
// const cors = require('cors');



// for environment variables
require('dotenv').config()

const app = express();



// Middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, '/public')));


// ejs is the template engine for the site
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layouts/index');
app.set('view engine', '.ejs');

app.set('views', path.join(__dirname, 'views'));


/* --------------------------
         API ROUTES
-------------------------- */


app.get('/', (req, res) => {
    res.render('main');
})

app.use('/quote', routes.quote);
app.use('/send', routes.send);
app.use('/dot', routes.dot);
app.use('/contact', routes.contact);


// About Page
app.get('/about', (req, res) => {
    res.render('about');
});

// // Contact Page
// app.get('/contact', (req, res) => {
//     res.render('contact');
// });

// Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

// Privacy Policy Page
app.get('/privacy', (req, res) => {
    res.render('privacy');
});

// Terms of Use Page
app.get('/terms', (req, res) => {
    res.render('terms');
});

// // Send Contact Info
// app.post('/contact', (req, res) => {

// }

/* --------------------------
   The following routes are 
   currently not being used
-------------------------- */


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
