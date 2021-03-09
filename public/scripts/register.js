let emailField = document.getElementById('email');
const employeesField = document.getElementById('employees');
const businessField = document.getElementById('businessType');
const payrollField = document.getElementById('totalPayroll');
const mileageField = document.getElementById('mileage');
const zipField = document.getElementById('zipCode');


// If the cookie exists already, populate the email and the hidden inputs of the form with the values from the cookie.
function checkCookie() {
    const regex = /clientData={(.*?)}/ //This finds only the clientData string from document.cookie, which may have multiple others
    let clientData= document.cookie.match(regex).input.substring(11); // This trims off the "clientData=" portion 
    let clientDataObj = JSON.parse(clientData);
    // Here the values get assigned from the cookie
    emailField.value=clientDataObj.email;
    employeesField.value=clientDataObj.employees;
    businessField.value=clientDataObj.businessType;
    payrollField.value=clientDataObj.totalPayroll;
    mileageField.value=clientDataObj.mileage;
    zipField.value=clientDataObj.zipCode;

    return clientDataObj;

}
checkCookie();
