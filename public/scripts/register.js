let emailField = document.getElementById('email');
// const employeesField = document.getElementById('employees');
const businessField = document.getElementById('businessType');
const carrierField = document.getElementById('carrierOperation');
const payrollField = document.getElementById('totalPayroll');
const mileageField = document.getElementById('mileage');
const zipField = document.getElementById('zipCode');
const DOTField = document.getElementById('DOT');
const companyField = document.getElementById('companyName');
const DBAField = document.getElementById('DBA');
const addressField = document.getElementById('address');
const mailingField = document.getElementById('mailingAddress');
const phoneField = document.getElementById('phoneCode');
const trucksField = document.getElementById('powerUnits');
const driversField = document.getElementById('drivers');
const operationField = document.getElementById('operationType');
const cargoField = document.getElementById('zipCode');


// If the cookie exists already, populate the email and the hidden inputs of the form with the values from the cookie.
function checkCookie() {
    const regex = /clientData={(.*?)}/ //This finds only the clientData string from document.cookie, which may have multiple others
    try {
        let clientData= document.cookie.match(regex).input.substring(11); // This trims off the "clientData=" portion 
        let clientDataObj = JSON.parse(clientData);
        // Here the values get assigned from the cookie
        emailField.value=clientDataObj.email;
        // employeesField.value=JSON.stringify(clientDataObj.employees);
        businessField.value=clientDataObj.businessType;
        carrierField.value=clientDataObj.carrierOperation;
        payrollField.value=clientDataObj.totalPayroll;
        mileageField.value=clientDataObj.mileage;
        zipField.value=clientDataObj.zipCode;
        DOTField=clientDataObj.DOT;
        companyField=clientDataObj.companyName;
        DBAField=clientDataObj.DBA;
        addressField=clientDataObj.address;
        mailingField=clientDataObj.mailingAddress;
        phoneField=clientDataObj.phone;
        trucksField=clientDataObj.powerUnits;
        driversField=clientDataObj.drivers;
        operationField=JSON.stringify(clientDataObj.operationType);
        cargoField==JSON.stringify(clientDataObj.cargoCarried);
        return clientDataObj;

    } catch (err) {
        console.log(err);
        // employeesField.value='';
        businessField.value='';
        payrollField.value='';
        mileageField.value='';
        zipField.value='';
        DOTField='';
        companyField='';
        DBAField='';
        addressField='';
        mailingField='';
        phoneField='';
        trucksField='';
        driversField='';
        operationField=JSON.stringify(clientDataObj.operationType);
        cargoField==JSON.stringify(clientDataObj.cargoCarried);
    }

}
checkCookie();