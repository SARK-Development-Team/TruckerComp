// This file was an earlier attempt using nodemailer.
// It uses SMTP, so it is of no use.

const nodemailer = require('nodemailer');

// const fs = require('fs');
// const readline = require('readline');
const {google} = require('googleapis');
// const { getAPI } = require('googleapis-common');
// const { gmail } = require('googleapis/build/src/apis/gmail');

const CLIENT_ID= '286794930812-kbin7a9lhj8hed8pe2qsmpufa78gdrg0.apps.googleusercontent.com';
const CLIENT_SECRET = 'XXX';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04dWZtXpdFfINCgYIARAAGAQSNwF-L9IrmaE-TY0tmUWQiyieukBGhLtjjSAm3pEPGE35TdiJiL_dueD7E9KWdMm8Y7sBj2kWLFA';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'truckcomptest@gmail.com',
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    })
    const mailOptions = {
      from: 'SARK Insurance <truckcomptest@gmail.com>',
      to: 'leiqien28@hotmail.com',
      subject: "Hello ",
      text: 'Hello text version',
      html: '<h1>Hello html version</h1>'
    };

    const result = await transport.sendMail(mailOptions);
    return result;

  } catch (error){
    return error;
  }
}

sendMail().then((result)=> console.log('Email sent...', result)).catch((error) => console.log(error.message));


function sendMessage(headers_obj, message, callback)
{
  var email = '';

  for(var header in headers_obj)
    email += header += ": "+headers_obj[header]+"\r\n";

  email += "\r\n" + message;

  var sendRequest = gapi.client.gmail.users.messages.send({
    'userId': 'me',
    'resource': {
      'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
    }
  });

  return sendRequest.execute(callback);
}