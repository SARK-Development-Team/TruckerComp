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


// Azure is where the completed client lead is stored
const azure = require('azure-storage');
const tableSvc = azure.createTableService(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_ACCESS_KEY);


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
