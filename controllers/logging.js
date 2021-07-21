
// Azure is where the completed client lead is stored
const azure = require('azure-storage');

const tableSvc = azure.createTableService(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_ACCESS_KEY);



const logError = (req, res) => {
    // Build an "instance" object from the data passed in
    const time = Date.now();
    const row = time;
    const instance = {
        PartitionKey: {'_':'instances'},
        RowKey: {'_': row},
        Function: {'_': req.body.function},
        Parameters: {'_': req.body.parameters},
        Error_Message: {'_': req.body.error}


      };
    //   Create the table if it does not exist already
    tableSvc.createTableIfNotExists('tcomperrors', function(err, result, response){
    // If there is no error
    if(!err){
        // insert the "lead" object into the table
        try {
            tableSvc.insertOrReplaceEntity('tcomperrors',lead, function (err, result, response) {
                if(!err){
                    return;
                } else {
                    console.log(err);
                }
            });
        } catch(err) {
            console.log(err)
        }
    } else {
        console.log(err);
    }
  });


}



module.exports = {
    logError
}