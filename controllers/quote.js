


// This function is the basic quote calculation formula
function calculateQuote(data) {
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