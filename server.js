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


// Login Page
app.get('/login', (req, res) => {
    res.render('login')
});
/* --------------------------
   The following routes are 
   currently not being used
-------------------------- */


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
