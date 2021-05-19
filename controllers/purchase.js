// This route deals with clients that have not registered with us
// It saves them into the MongoDB and subsequently into the Azure DB.


// for environment variables
require('dotenv').config()


// Azure is where the completed client lead is stored
const azure = require('azure-storage');
const tableSvc = azure.createTableService(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_ACCESS_KEY);

// The Mongo Database
const db = require('../models');


// This function saves the new "lead" object in the Azure DB, using the DOT as the row key
function azureSave(object) {
    // Build the "lead" object from the data passed in
    // const rowKey = object._ID.toString();
    // const empString = JSON.stringify(object.employees);
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
    tableSvc.createTableIfNotExists('basic-leads', function(err, result, response){
        // If there is no error
        if(!err){
            // insert the "lead" object into the table
            try {
                tableSvc.insertOrReplaceEntity('basic-leads',lead, function (err, result, response) {
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

// This route saves the user input into the Azure Storage DB
savetoMongoDB = (data) => {
  try {
    db.User.findOneAndUpdate({ _id: data._id }, data)
    .then(console.log("successfully updated"))
    .catch((err)=>console.log(err)); 

  } catch (err) {
    console.log("Db error:", err);
  }
}



purchasePolicy = (req, res) => {
    savetoMongoDB(req.body);
    console.log("policy purchased!");
}


module.exports = {
    purchasePolicy
}