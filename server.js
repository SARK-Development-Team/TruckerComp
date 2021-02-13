const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const handle = require('express-handlebars');

const nodemail = require('nodemailer');

const app = express();

app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', handle({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.render('contact');    
});

app.post('/send', (req, res) => {
    // console.log(req.body);
    const output = `
        <p>Your Requested Quote</p>
        <p>$150/month</p>
    `;
    res.send(output);
    // // async..await is not allowed in global scope, must use a wrapper
    // async function main() {
    //     // Generate test SMTP service account from ethereal.email
    //     // Only needed if you don't have a real mail account for testing
    //     let testAccount = await nodemailer.createTestAccount();
    
    //     // create reusable transporter object using the default SMTP transport
    //     let transporter = nodemailer.createTransport({
    //         host: "smtp.ethereal.email",  //<------replace
    //         port: 587,
    //         secure: false, // true for 465, false for other ports
    //         auth: {
    //             user: testAccount.user, // generated ethereal user
    //             pass: testAccount.pass, // generated ethereal password
    //         },
    //         tls: {
    //             rejectUnauthorized:false
    //         }
    //     });
    
    //     // send mail with defined transport object
    //     let info = await transporter.sendMail({
    //         from: '"Nodemailer Contact" <foo@example.com>', // sender address
    //         to: "leiqien28@hotmail.com", // list of receivers
    //         subject: "Node test", // Subject line
    //         text: "Hello world?", // plain text body
    //         html: output, // html body
    //     });
    
    //     console.log("Message sent: %s", info.messageId);
    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    //     // Preview only available when sending through an Ethereal account
    //     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    //     res.send();
    // }
    
    // main().catch(console.error);

});





app.listen(5001, () => console.log("It's working."));