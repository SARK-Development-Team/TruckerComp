


// This function is the basic quote calculation formula
function calculateQuote(data) {
    // let empArray = data.employees;
    // 'typeTotal' will increase by a given amount based on the number and type of employees   
    // let typeTotal = 0;
    // 'payRollTotal' will increase based on the total combined payroll
    // let payrollTotal = 0;
    // for (let i =0; i<empArray.length; i++) {
    //     if (empArray[i].type =='driver') {
    //         // 1.5 for every driver
    //         typeTotal+= empArray[i].number*1.5;
    //     } else {
    //         // 1 for all other employee types
    //         typeTotal+= empArray[i].number;
    //     }
    //     payrollTotal+=empArray[i].payroll;
    // }
    const payrollFactor = 0.002;
    const purchaseBaseline = 500;
    const mileageFactor = 500;
    return ((data.totalPayroll*payrollFactor + data.mileage) * mileageFactor+purchaseBaseline);
};

const generateQuote = (req, res) => {
    const result = calculateQuote(req.body);
    return res.json({ result });
}


module.exports = {
    generateQuote
}