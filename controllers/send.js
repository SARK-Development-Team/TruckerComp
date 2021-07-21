// for email function
const nodemailer = require('nodemailer');
const {google, GoogleApis} = require('googleapis');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
let pdf = require("html-pdf");


// const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');



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

async function sendEmail(userData) {
    // fs.unlink(__dirname + "/templates/output.pdf", () => console.log("file deleted"))
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

        await calculateQuote(userData);


        // this sends controllers/templates/truckercomp.ejs to the client with the relevant fields filled in.
        await checkForFile(__dirname + "/templates/output.pdf", 2000, userData, transport);
        
        setTimeout(fs.unlink(__dirname + "/templates/output.pdf", function() {console.log("file deleted")}), 30000);
        return;

        } catch (error) {
            console.log(error)
            return error;
        }
};

function checkForFile(path, timeout=2000, userData, transport) {
    const intervalObj = setInterval(function() {

        const file = path;
        const fileExists = fs.existsSync(file);

        console.log('Checking for: ', file);
        console.log('Exists: ', fileExists);

        if (fileExists) {
            clearInterval(intervalObj);

            createEmail(userData, transport);
        }
    }, timeout);
};

function createEmail(userData, transport) {
    ejs.renderFile(__dirname + "/templates/truckercomp.ejs", { client: userData, date: new Date().getFullYear() }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: '"TruckerComp by SARK" wc@sarkinsurance.com',
                to: userData.email,
                subject: "Your workers' compensation insurance quote from TruckerComp",
                html: data,
                attachments: [
                    {   // filename and content type is derived from path
                        path: __dirname + "/templates/output.pdf"
                    }
                ]
            };
            transport.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
    })
}


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

        const quote = await calculateQuote(data);

        const htmlBody = `
            <h1>Hello ${data.email},<h1>
            <p>Based on the information you've provided, we estimate that we can provide a monthly worker's comp premium of ${(quote *0.95).toFixed(2)} &mdash; ${(quote *1.05).toFixed(2)} </p>
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

function establishValues(data) {

    const payroll = data.totalPayroll;
    const estimatedAnnualPremium = Math.round(payroll * 0.07 * 1e2) / 1e2;  // use 7% for now
    const terrorism = Math.round(payroll * 0.0004 * 1e2) / 1e2;
    const catastrophe = Math.round(payroll * 0.0002 * 1e2) / 1e2;
    const expenseConstant = 300;
    const increasedLimitsForLiability = Math.round(payroll * 0.00011 * 1e2) / 1e2;
    let manualPremium;
    if (payroll < 100000) {
        manualPremium = Math.round(payroll * 0.0951 * 1e2) / 1e2;
    } else if (payroll < 150000) {
        manualPremium = Math.round(payroll * 0.107 * 1e2) / 1e2;
    } else if (payroll < 200001) {
        manualPremium = Math.round(payroll * 0.113 * 1e2) / 1e2;
    } else {
        manualPremium = Math.round(payroll * 0.1248 * 1e2) / 1e2;
    }
    const scheduleRating = Math.round((parseFloat(increasedLimitsForLiability) + parseFloat(expenseConstant) + parseFloat(terrorism) + parseFloat(catastrophe) + parseFloat(manualPremium) - parseFloat(estimatedAnnualPremium)) * 1e2) / 1e2;

    const wcarf = Math.round(estimatedAnnualPremium * 0.02246 * 1e2) / 1e2;
    const uebtf = Math.round(estimatedAnnualPremium * 0.000775 * 1e2) / 1e2;
    const sibtf = Math.round(estimatedAnnualPremium * 0.006579 * 1e2) / 1e2;
    const oshaf = Math.round(estimatedAnnualPremium * 0.002584 * 1e2) / 1e2;
    const lecf = Math.round(estimatedAnnualPremium * 0.002272 * 1e2) / 1e2;
    const fraud = Math.round(estimatedAnnualPremium * 0.004734 * 1e2) / 1e2;
    const policyAdminFee = 200;
    const quote = Math.round((parseFloat(estimatedAnnualPremium) + parseFloat(wcarf) + parseFloat(uebtf) + parseFloat(sibtf) + parseFloat(oshaf) + parseFloat(lecf) + parseFloat(fraud) + parseFloat(policyAdminFee)) * 1e2) / 1e2;
    const dataValues = {
        name: data.companyName,
        payroll, estimatedAnnualPremium, terrorism, catastrophe, expenseConstant, 
        increasedLimitsForLiability, manualPremium, scheduleRating, wcarf, uebtf, 
        sibtf, oshaf, lecf, fraud, policyAdminFee, quote
    }

    return dataValues;

}

// This function is the basic quote calculation formula
async function calculateQuote(data) {
    return new Promise((res, rej) => {
        const dataValues = establishValues(data);

        writeToTemplate(dataValues);
        res();
    });
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

// function  writeToPDFTemplate(clientName, payroll, estimatedAnnualPremium, terrorism, catastrophe, expenseConstant, 
//     increasedLimitsForLiability, manualPremium, scheduleRating, wcarf, uebtf, sibtf, oshaf, lecf, fraud, policyAdminFee, quote) {
function writeToTemplate(dv) {
    // insert the values into the template

    ejs.renderFile(path.join(__dirname, "templates/estimateTemplate.ejs"), {dv}, (err, data) => {
        if (err) {
              console.log(err);
        } else {
            let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "5mm"
                },
                "footer": {
                    "height": "5mm",
                },
            };
            // now convert the file to a pdf
            pdf.create(data, options).toFile(path.join(__dirname, "templates/output.pdf"), function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("File created successfully");
                }
            });
        }

    });

}


// async function writeToPDF() {
//     // const file = fs.readFileSync(path.resolve(__dirname, 'templates/output.docx'), 'utf8');
//     docxConverter(path.resolve(__dirname, 'templates/output.docx'), path.resolve(__dirname, 'templates/output.pdf'), (err, result) => {
//         if (err) console.log(err);
//         else console.log(result); 
//       });;
//       async () => {
//         const data = await docxConverter(path.resolve(__dirname, 'templates/output.docx'))
//         fs.writeFileSync(path.resolve(__dirname, 'templates/output.pdf'), data);
//       }

// };

const generateEmail = (req, res) => {
    sendEmail(req.body);
    // sendToSark(req.body);
    saveInAzure(req.body);
}


module.exports = {
    generateEmail
}