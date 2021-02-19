const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const handle = require('express-handlebars');

const nodemailer = require('nodemailer');
const {google, GoogleApis} = require('googleapis');
const gmail = google.gmail('v1');

const app = express();

app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', handle({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// For the sendMail() function
// const CLIENT_ID= '286794930812-kbin7a9lhj8hed8pe2qsmpufa78gdrg0.apps.googleusercontent.com';
// const CLIENT_SECRET = 'xxx';
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
// const REFRESH_TOKEN = '1//04dWZtXpdFfINCgYIARAAGAQSNwF-L9IrmaE-TY0tmUWQiyieukBGhLtjjSAm3pEPGE35TdiJiL_dueD7E9KWdMm8Y7sBj2kWLFA';

// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
// oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

// async function sendMail() {
//     try {
//       const accessToken = await oAuth2Client.getAccessToken();
//       const transport = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           type: 'OAuth2',
//           user: 'truckcomptest@gmail.com',
//           clientID: CLIENT_ID,
//           clientSecret: CLIENT_SECRET,
//           refreshToken: REFRESH_TOKEN,
//           accessToken: accessToken
//         }
//       })
//       const mailOptions = {
//         from: 'SARK Insurance <truckcomptest@gmail.com>',
//         to: 'leiqien28@hotmail.com',
//         subject: "Hello ",
//         text: 'Hello text version',
//         html: '<h1>Hello html version</h1>'
//       };
  
//       const result = await transport.sendMail(mailOptions);
//       return result;
  
//     } catch (error){
//       return error;
//     }
//   }
const clientId= '286794930812-kbin7a9lhj8hed8pe2qsmpufa78gdrg0.apps.googleusercontent.com';

var apiKey = 'xxx';
var scopes =
'https://www.googleapis.com/auth/gmail.readonly '+
'https://www.googleapis.com/auth/gmail.send';

// This is meant to be called by the script tag at the end of index.handlebars, but it isn't being called.
function handleClientLoad() {
    google.gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
}

function checkAuth() {
    gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: true
    }, console.log('success!'));
}

function sendEmail() {
    sendMessage(
        {
            'To': 'leiqien28@hotmail.com',
            'Subject': 'TComp message'
        },
        'This is the email body.'
    );

    return false;
}

function sendMessage(headers_obj, message) {
    var email = '';

    for(var header in headers_obj)
        email += header += ": "+headers_obj[header]+"\r\n";

    email += "\r\n" + message;

    // Error occurs here -- 'gapi' undefined       <<<------
    var sendRequest = gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
        'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
        }
    });

    return sendRequest.execute(console.log('SENT!'));
}


// This function is the basic quote calculation formula
function calculateQuote(data) {
    return ((data.payroll *0.2 + data.mileage * 0.05) * (data.employees+1));
};


//  This get request is necessary for the correct page to be served up. It doesn't serve contact.handlebars, but if I change it it no longer functions
app.get('/', (req, res) => {
    res.render('contact');
})

// This function receives the request from the client side with the initialFormData, runs it through the formula, and returns a number
app.post('/quote', (req, res) => {
    const result = calculateQuote(req.body);
    return res.json({ result });
})


// This request is intended to send the email, but it encounters an error in that 'gapi' is not defined.
app.post('/send', (req, res) => {
    sendEmail().then((result)=> console.log('Email sent...', result)).catch((error) => console.log(error.message));
});


app.listen(5001, () => console.log("It's working."));