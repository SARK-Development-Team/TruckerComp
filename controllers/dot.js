const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// SQl Server is accessed to search for the DOT on slide 3
const sql = require('mssql')

const DOT = '2129644'
const URL = 'https://ai.fmcsa.dot.gov/SMS/Carrier/DOT/CarrierRegistration.aspx';


// This function searches the sark DB for a client based on the DOT entered
async function sqlSearch(number) {
    try {
        let pool = await sql.connect(process.env.SQL_CONNSTRING)
        let result1 = await pool.request()
            .query(`SELECT * FROM sark.Client WHERE [DOT Number] = ${number}`)
        // console.log(result1.recordset[0]);
        return (result1.recordset[0])
    } catch (err) {
       console.log(err);
    }
};

// ////////////
///////////////
///////////////

async function fmcsaSearch(number) {
    try {
      var html = '';
      var $;
      axios.get(URL.replace('DOT', DOT))
          .then(response => {
              html = response.data,
              $ = cheerio.load(html),
              console.log("this thing", $('article').children('h2').contents());
          })
          .catch(error => {
              console.log(error)
          })

    } catch(err) {
      console.log(err);
    }
}


// This route performs a search through the sark client DB for the DOT number entered
// Returns an object that is partially displayed in the "result" box
const searchDOT = async (req, res) => {
    const result = await sqlSearch(req.body.dot);   
    // const result2 = await fmcsaSearch(req.body.dot);
    // console.log(result);
    return res.json({ result });
};

module.exports = {
    searchDOT
}