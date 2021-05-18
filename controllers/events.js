
// for environment variables
require('dotenv').config();


const connString = process.env.SQL_CONNSTRING;

const sql = require('mssql');

requestDoc = (number) => {
    const docs = [
        "1099 Form",
        "Drivers' License",
        "W-2",
        "Payroll Statement"
    ];
    const message = `Please upload a copy of your ${docs[number]} for the year 2020.`;
    return message;
}

requestSig = () => {
    const message = "Please provide your signature."
    return message;
}

requestInfo = () => {
    const message = "Please provide the following information: "
    return message;
}

// Check the SARK DB for any updates from the underwriting team
queryAll = async () => {
    try {
        let pool = await sql.connect(connString)
        let result1 = await pool.request()
            .query(`SELECT * FROM sark.Client WHERE [DOT Number] = ${number}`)
        const event = result1.recordset[0]  //<--update this to get only the necessary event from the DB 
        // if (event type === document) ...
        // if (event type === information) ...
        // if (event type === signature) ...
        // return event
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