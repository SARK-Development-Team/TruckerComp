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
        return (result1.recordset[0])
    } catch (err) {
       console.log(err);
    }
};

// This function searches the FMCSA DB for a client based on the DOT entered
async function fmcsaSearch(number) {
    try {
      var html = '';
      var $;
      var clientObj = {}
    //   const properties = ['name', 'DBA', 'DOT', 'address', 'phone', 'email', 'milesTraveled', 'powerUnits', 'drivers', 'carrierOperations']
      await axios.get(URL.replace('DOT', number))
          .then(response => {
              html = response.data,
              $ = cheerio.load(html);
              $('.dat').map(function(i, el) {
                //   Get rid of spaces and line breaks
                // let labelName= $(this).prev().text().replace(/(\r\n|\n|\r)/gm, "").replace(/  +/g, "");
                let labelName= $(this).prev().text().trim();
                switch(labelName) {
                    case "Legal Name:":
                        clientObj.name=$(this).text();
                        break;
                    case "DBA Name:":
                        clientObj.DBA=$(this).text();
                        break;
                    case "U.S. DOT#:":
                        clientObj.DOT=$(this).text();
                        break;
                    case "Address:":
                        // clientObj.address=$(this).text().replace(/(\r\n|\n|\r)/gm, "").replace(/  +/g, "");
                        clientObj.address=$(this).text().trim();
                        break;
                    case "Telephone:":
                        clientObj.phone=$(this).text();
                        break;
                    case "Email:":
                        clientObj.email=$(this).text();
                        break;
                    case "Vehicle Miles Traveled:":
                        // Remove commas from numbers if present
                        clientObj.milesTraveled=$(this).text().replace(",","");
                        break;
                    case "Power Units:":
                        clientObj.powerUnits=$(this).text();
                        break;
                    case "Drivers:":
                        clientObj.drivers=$(this).text();
                        break;
                    case "Carrier Operation:":
                        clientObj.carrierOperation=$(this).text();
                        break;
                    default:
                        break;
                }
            })
            // These return arrays of all the items checked with an X and eliminates empty items
            const xPattern = /^X/gm
            clientObj.opClass = ($('.opClass .checked').text().split('X')).filter(Boolean);
            clientObj.cargo = ($('.cargo .checked').text().split('X')).filter(Boolean)
            // clientObj.opClass = ($('.opClass .checked').text().split(xPattern)).filter(Boolean);
            // clientObj.cargo = ($('.cargo .checked').text().split(xPattern)).filter(Boolean);
          })
          .catch(error => {
              console.log(error)
          })
          return clientObj;

    } catch(err) {
      console.log(err);
    }
}


// This route performs a search through the DB for the DOT number entered
// Returns an object that is partially displayed in the "result" box
const searchDOT = async (req, res) => {
    // const result = await sqlSearch(req.body.dot);   
    const result = await fmcsaSearch(req.body.dot);
    return res.json({ result });
};

module.exports = {
    searchDOT
}