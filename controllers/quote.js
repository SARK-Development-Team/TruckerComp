


// This function is the basic quote calculation formula
function calculateQuote(data) {
    const payroll = data.totalPayroll;
    const estimatedAnnualPremium = payroll * 0.07;  // use 7% for now
    const terrorism = payroll * 0.0004;
    const catastrophe = payroll * 0.0002;
    const expenseConstant = 300;
    const increasedLimitsForLiability = payroll * 0.00011;
    let manualPremium;
    if (payroll < 100000) {
        manualPremium = payroll * 0.0951;
    } else if (payroll < 150000) {
        manualPremium = payroll * 0.107;
    } else if (payroll < 200001) {
        manualPremium = payroll * 0.113;
    } else {
        manualPremium = payroll * 0.1248;
    }
    const scheduleRating = increasedLimitsForLiability + expenseConstant + terrorism + catastrophe + manualPremium - estimatedAnnualPremium;

    const wcarf = estimatedAnnualPremium * 0.02246;
    const uebtf = estimatedAnnualPremium * 0.000775;
    const sibtf = estimatedAnnualPremium * 0.006579;
    const oshaf = estimatedAnnualPremium * 0.002584;
    const lecf = estimatedAnnualPremium * 0.002272;
    const fraud = estimatedAnnualPremium * 0.004734;
    const policyAdminFee = 200;
    const quote = estimatedAnnualPremium + wcarf + uebtf + sibtf + oshaf + lecf + fraud + policyAdminFee;
    return quote;
};

const generateQuote = (req, res) => {
    const result = calculateQuote(req.body);
    return res.json({ result });
}


module.exports = {
    generateQuote
}