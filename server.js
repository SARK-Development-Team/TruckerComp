const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

// for environment variables
require('dotenv').config()

// for email function
const nodemailer = require('nodemailer');
const {google, GoogleApis} = require('googleapis');



// const mongoose = require('mongoose');
const passport = require('passport');

const sql = require('mssql')


const app = express();

require('./config/passport')(passport);


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());



app.set('views', path.join(__dirname, 'views'));

// handlebars is the template engine for the site
const hbars = require('handlebars');
const handle = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
app.engine('handlebars', handle({
    defaultLayout: 'dashboard', 
    handlebars: allowInsecurePrototypeAccess(hbars)
}));
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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
            subject: "Your workers' compensation insurance quote from Trucker Comp ",
            text: 'Hello text version',
            html: htmlBody
        };

        const result = await transport.sendMail(mailOptions);
        return result;

    } catch (error) {
        console.log(error)
        return error;
    }
}

// This function is the basic quote calculation formula
function calculateQuote(data) {
    let empArray = data.employees;
    // 'typeTotal' will increase by a given amount based on the number and type of employees   
    let typeTotal = 0;
    // 'payRollTotal' will increase based on the total combined payroll
    let payrollTotal = 0;
    for (let i =0; i<empArray.length; i++) {
        if (empArray[i].type =='driver') {
            // 1.5 for every driver
            typeTotal+= empArray[i].number*1.5;
        } else {
            // 1 for all other employee types
            typeTotal+= empArray[i].number;
        }
        payrollTotal+=empArray[i].payroll;
    }

    return (payrollTotal *0.000002 + typeTotal * 0.85 + data.mileage * 0.000005);
};


async function sqlSearch(number) {
    console.log(`searching for ${number}`)
    try {
        let pool = await sql.connect(process.env.SQL_CONNSTRING)
        let result1 = await pool.request()
            .query(`SELECT * FROM sark.Client WHERE [DOT Number] = ${number}`)
        return (result1.recordset[0])
    } catch (err) {
       console.log(err)
    }
}

/* --------------------------
         API ROUTES
-------------------------- */


// Routes

app.get('/', (req, res) => {
    res.render('main',  {layout: "index"},);
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

app.post('/dot', async (req, res) => {
    const result = await sqlSearch(req.body.dot);   
    return res.json({ result });
})

app.use('/users', require('./routes/users.js'));

// This listens at port 5001, unless there is a Configuration variable (as on heroku).
app.listen(process.env.PORT || 5001, () => console.log("Server running."));