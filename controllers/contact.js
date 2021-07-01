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

const sendContactInfo = async (dataObject) => {
    const data = dataObject.body;
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

        const htmlBody = `
            <h1>New Contact request from ${data.name} at ${data.email}<h1>
            <p>Name: ${data.name}</p>
            <p>Email: ${data.email}</p>
            <p>Phone: ${data.phone}</p>
            <p>Interested in: ${data.typeOfInsurance}</p>
            <p>Comments: ${data.comments}</p>
        `
        const mailOptions = {
            from: "wc@sarkinsurance.com",
            to: data.email,
            subject: "New Contact Request",
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


// const sendContactInfo = (req, res) => {
//     sendContactInfo(req.body);
// }

module.exports = {
    sendContactInfo
}