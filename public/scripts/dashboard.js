const localPattern = /localhost/;
let uriRoot = '';
if (localPattern.test(window.location.href)) {
    uriRoot = 'http://localhost:5001/'
} else {
    uriRoot = window.location.href;
}

const searchButton = document.getElementById('btn-search')
searchButton.onclick = () => searchDOT();


async function searchDOT() {
    let resultField = document.getElementById('result');
    let dot = {'dot': document.getElementById('DOT').value};
    console.log("searchDot is working");
    const result = await fetchDOT(dot);
    console.log(result.result)
    for (let i in result.result) {
        resultField.innerHTML += `<p>${i}: ${result.result[i]}</p>`;
    }
}

async function fetchDOT(dotObject) {
    const uri = uriRoot+'dot';
    console.log("fetchhDot is working");

    const result = fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dotObject)
    }).then(response => response.json()).catch(err=>console.log(err));

    return result;
}

let emailField = document.getElementById('email');
const employeesField = document.getElementById('employees');
const businessField = document.getElementById('businessType');
const payrollField = document.getElementById('totalPayroll');
const mileageField = document.getElementById('mileage');
const zipField = document.getElementById('zipCode');


// If the cookie exists already, populate the email and the hidden inputs of the form with the values from the cookie.
function checkCookie() {
    const regex = /clientData={(.*?)}/ //This finds only the clientData string from document.cookie, which may have multiple others
    
    // This only gets called if:
    // a). a cookie that matches the regex is found
    // b). the current url slug is 'register'
    if (document.cookie.match(regex)&&window.location.pathname.split("/").pop()=='register') {
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
    return {};
}
checkCookie();
