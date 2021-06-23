
// for environment variables
require('dotenv').config();
const fetch = require('node-fetch');

const connString = process.env.SQL_CONNSTRING;
const eversignAPI = process.env.EVERSIGN_ACCESS_KEY;
const eversignBusinessID = process.env.EVERSIGN_BUSINESS_ID;

const db = require('../models');

const sql = require('mssql');


const messageList = {
    "profile": "Please confirm the information on your profile or edit as necessary and forward to SARK",
    "document": "Please complete the attached form and provide your signature",
    "contact": "Please contact XXX for more information"
};


async function requestSignature() {
    // if(true) {
    //     eversign.open({
    //         url: 'https://api.eversign.com/api/document',  //<----replace with correct url
    //         containerID: "signature-area",
    //         width: 600,
    //         height: 600,
    //         events: {
    //           loaded: function () {
    //             console.log("loaded Callback");
    //           },
    //           signed: function () {
    //             console.log("signed Callback");
    //           },
    //           declined: function () {
    //             console.log("declined Callback");
    //           },
    //           error: function () {
    //             console.log("error Callback");
    //           }
    //         }
    //     });
    // }
    let sigForm = await fetch(`https://api.eversign.com/api/document?access_key=${eversignAPI}&business_id=${eversignBusinessID}&type="text"`, {
        // method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(data)
    }).then(response => response.json()).catch(err=>console.error(err));
    console.log(sigForm);
}

const requestDoc = (number) => {
    const docs = [
        "1099 Form",
        "Drivers' License",
        "W-2",
        "Payroll Statement"
    ];
    const message = `Please upload a copy of your ${docs[number]} for the year 2020.`;
    return message;
}

requestSig = async (req, res) => {
    const sigForm = await requestSignature();
    return sigForm;
}

requestInfo = () => {
    const message = "Please provide the following information: "
    return message;
}

// Check the SARK DB for any updates from the underwriting team
queryAll = async (req, res) => {
    // console.log(`${user['DOT']}`);
    try {
        let pool = await sql.connect(connString)
        let result1 = await pool.request()
            .query(`SELECT * FROM sark.Client WHERE [DOT Number] = ${req.body['DOT']}`)
        const event = result1.recordset[0]  //<--update this to get only the necessary event from the DB 
        // if (event type === document) ...
        // if (event type === information) ...
        // if (event type === signature) ...
        // console.log(event);
        // return event;
        if (event) {
            res.json(messageList);
        }
    } catch (err) {
       console.log(err);
    }
}


module.exports = {
    requestDoc,
    requestSig,
    requestInfo,
    queryAll
}