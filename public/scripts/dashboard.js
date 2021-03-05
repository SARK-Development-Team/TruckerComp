const localPattern = /localhost/;
let uriRoot = '';
if (localPattern.test(window.location.href)) {
    uriRoot = 'http://localhost:5001/'
} else {
    uriRoot = window.location.href;
}

const resultField = document.getElementById('result');

const searchButton = document.getElementById('btn-search')

searchButton.onclick = () => searchDOT();

// When the button for the DOT search field is pressed
async function searchDOT() {
    document.getElementById('manualInput').style.display = 'none';
    let dot = {'dot': document.getElementById('DOT').value};
    // Only searches if a value is entered
    if (dot['dot']) {
        const client = await fetchDOT(dot);
        resultField.style.display='block';
        // If a client is not found
        if (!client.result) {
            resultField.innerHTML = `<p>No result found for ${dot['dot']}.</p>`
            document.getElementById('confirmation').style.display='none';
        // If a client is found
        } else {
            resultField.innerHTML = '';
            resultField.innerHTML += `<p>DOT Number: ${client.result['DOT Number']}</p>`;
            resultField.innerHTML += `<p>Company Name: ${client.result['Company Name']}</p>`;
            resultField.innerHTML += `<p>MCP Number: ${client.result['MCP Number']}</p>`;
            resultField.innerHTML += `<p>Address: ${client.result['Address']}</p>`;
            resultField.innerHTML += `<p>Phone Number: ${client.result['Phone']}</p>`;
            resultField.innerHTML += `<p>Power Units: ${client.result['Power Units']}</p>`;
            resultField.innerHTML += `<p>Drivers: ${client.result['Drivers']}</p>`;
            resultField.innerHTML += `<p>Authorized: ${client.result['Authorized']}</p>`;
            resultField.innerHTML += `<p>Mailing Address: ${client.result['Mailing Address']}</p>`;
            document.getElementById('confirmation').style.display='block';
        }
    }
}

// This function makes the API call to the server, searching for the DOT number in the sark_client DB and returning one client that matches that number 
async function fetchDOT(dotObject) {
    const uri = uriRoot+'dot';

    const result = fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dotObject)
    }).then(response => response.json()).catch(err=>console.log(err));

    return result;
}

function saveLead(e) {
    e.preventDefault();
    // If the user indicates the information is correct
    if (confirmed){
        resultField.innerHTML=`<p>Thank you for confirming! We will contact you shortly!</p>`
        const uri = uriRoot+'lead';
        const leadData = document.getElementById('');
        const result = fetch(uri, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
        }).then(response => response.json()).catch(err=>console.log(err));
    // If the user indicates it is not correct, they are given the chance to amend the fields 
    } else {
        document.getElementById('manualInput').style.display = 'block';
        document.getElementById('confirmation').style.display = 'none';
        resultField.style.display = 'none';
        
    }
}

let confirmed = false;

function confirm(boolean){
    confirmed = boolean;
    console.log(confirmed);
    return;
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
    // if (document.cookie.match(regex)&&window.location.pathname.split("/").pop()=='register') {
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
    // }
    // return {};
}
checkCookie();
