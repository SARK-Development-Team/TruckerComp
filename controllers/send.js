// for email function
const nodemailer = require('nodemailer');
const {google, GoogleApis} = require('googleapis');


// for environment variables
require('dotenv').config()

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
            <h1>Please call 415 xxx xxxx to purchase a policy now</h1>
            <h2>or proceed to <a href='https://truckcompv1.herokuapp.com/users/register'>our registration page</a> to create your TruckerComp user profile</h2>
            <h2>and one of our agents will reach out to you!</h2>
        `
        const mailOptions = {
            from: "wc@sarkinsurance.com",
            to: data.email,
            subject: "Your workers' compensation insurance quote from TruckerComp",
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

async function sendToSark(data) {
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
            <h1>Please call 415 xxx xxxx to purchase a policy now</h1>
            <h2>or proceed to <a href='https://truckcompv1.herokuapp.com/users/register'>our registration page</a> to create your TruckerComp user profile</h2>
            <h2>and one of our agents will reach out to you!</h2>
        `
        const mailOptions = {
            from: "wc@sarkinsurance.com",
            to: "wc@sarkinsurance.com",
            subject: "New customer quote from TruckerComp website",
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
    const payrollFactor = 0.002;
    const purchaseBaseline = 500;
    const mileageFactor = 500;
    return ((data.totalPayroll*payrollFactor + data.mileage) * mileageFactor+purchaseBaseline);
};

// Azure is where the completed client lead is stored
const azure = require('azure-storage');
const tableSvc = azure.createTableService(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_ACCESS_KEY);


// This function saves the new "lead" object in the Azure DB, using the DOT as the row key
function saveInAzure(object) {
    // Build the "lead" object from the data passed in
    // const empString = JSON.stringify(object.employees);
    const row = object.DOT.toString()
    var stage;
    if (object.stage==1) stage=2;
    const lead = {
        PartitionKey: {'_':'leads'},
        RowKey: {'_': row},
        name: {'_': object.name},
        email: {'_': object.email},
        DOT: {'_': object.DOT},
        totalPayroll: {'_': object.totalPayroll},
        mileage: {'_': object.mileage},
        companyName: {'_': object.companyName},
        address: {'_': object.address},
        mailingAddress: {'_': object.mailingAddress},
        phone: {'_': object.phone},
        // employees: {'_': empString},
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


const generateEmail = (req, res) => {
    console.log(req.body);
    sendEmail(req.body);
    sendToSark(req.body);
    saveInAzure(req.body);
}


module.exports = {
    generateEmail
}