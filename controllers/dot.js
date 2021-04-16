const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// SQl Server is accessed to search for the DOT on slide 3
const sql = require('mssql')

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
      var clientObj = {}
      await axios.get(URL.replace('DOT', number))
          .then(response => {
              html = response.data,
              $ = cheerio.load(html),
              $('.dat').map(function (i, el) {
                if (i===0) {
                    clientObj.name=$(this).text()
                }
                if (i===1) {
                    clientObj.DBA=$(this).text()
                }
                if (i===2) {
                    clientObj.DOT=$(this).text()
                }
                if (i===3) {
                    clientObj.address=$(this).text().replace(/(\r\n|\n|\r)/gm, "").replace(/  +/g, "");
                }
                if (i===4) {
                    clientObj.phone=$(this).text()
                }
                if (i===6) {
                    clientObj.email=$(this).text()
                }
                if (i===7) {
                    clientObj.milesTraveled=$(this).text()
                }
                if (i===9) {
                    clientObj.powerUnits=$(this).text()
                }
                if (i===11) {
                    clientObj.drivers=$(this).text()
                }
                if (i===12) {
                    clientObj.carrierOperation=$(this).text()
                }

            })
          })
          .catch(error => {
              console.log(error)
          })
        //   console.log("cob in the function= ", clientObj);
          return clientObj;

    } catch(err) {
      console.log(err);
    }
}


// This route performs a search through the sark client DB for the DOT number entered
// Returns an object that is partially displayed in the "result" box
const searchDOT = async (req, res) => {
    // const result = await sqlSearch(req.body.dot);   
    const result = await fmcsaSearch(req.body.dot);
    return res.json({ result });
};

module.exports = {
    searchDOT
}