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

var dotResult = {
    name: '',
    email: '',
    DOT: '',
    MCP: '',
    totalPayroll: '',
    mileage: '',
    companyName: '',
    address: '',
    mailingAddress: '',
    phoneNumber: '',
    drivers: '',
    powerUnits: '',
}

// When the button for the DOT search field is pressed
async function searchDOT() {
    document.getElementById('manualInput').style.display = 'none';
    let dot = {'dot': document.getElementById('DOTsearch').value};
    // Only searches if a value is entered
    if (dot['dot']) {
        try {
            const client = await fetchDOT(dot);
            resultField.style.display='block';
            // If a client is not found
            if (!client.result) {
                resultField.innerHTML = `<p>No result found for ${dot['dot']}.</p>`
                document.getElementById('confirmation').style.display='none';
            // If a client is found
            } else {

                dotResult.name = document.getElementById('userName').innerText;
                dotResult.email = document.getElementById('userEmail').innerText;
                dotResult.totalPayroll = document.getElementById('userTotalPayroll').innerText;
                dotResult.mileage = document.getElementById('userMileage').innerText;
                dotResult.DOT = client.result['DOT Number'];
                dotResult.companyName = client.result['Company Name'];
                dotResult.MCP = client.result['MCP Number'];
                dotResult.address = client.result['Address'];
                dotResult.mailingAddress = client.result['Mailing Address'];
                dotResult.phoneNumber = client.result['Phone'];
                dotResult.drivers = client.result['Drivers'];
                dotResult.powerUnits = client.result['Power Units'];
                resultField.innerHTML = '';
                resultField.innerHTML += `<p>DOT Number: ${client.result['DOT Number']}</p>`;
                resultField.innerHTML += `<p>Company Name: ${client.result['Company Name']}</p>`;
                resultField.innerHTML += `<p>MCP Number: ${client.result['MCP Number']}</p>`;
                resultField.innerHTML += `<p>Address: ${client.result['Address']}</p>`;
                resultField.innerHTML += `<p>Phone Number: ${client.result['Phone']}</p>`;
                resultField.innerHTML += `<p>Power Units: ${client.result['Power Units']}</p>`;
                resultField.innerHTML += `<p>Drivers: ${client.result['Drivers']}</p>`;
                // resultField.innerHTML += `<p>Authorized: ${client.result['Authorized']}</p>`;
                resultField.innerHTML += `<p>Mailing Address: ${client.result['Mailing Address']}</p>`;
                document.getElementById('confirmation').style.display='block';
            }
        } catch (err) {
            console.log(err);
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

// This function runs when the user runs the DOT search and presses the submit button
// It only works if the user has pressed either 'yes' or 'no' when prompted to confirm the result of the DOT search
function saveInitialLead(e) {
    e.preventDefault();
    document.getElementById('confirmation').style.display = 'none';
    // If the user indicates the information is correct
    if (confirmed.value&&confirmed.pressed){

        const uri = uriRoot+'lead';
        const result = fetch(uri, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dotResult)
        }).then(
            // response => response.json()
            resultField.innerHTML=`<p>Thank you for confirming! We will contact you shortly!</p>`
            )
        .catch(err=>console.log(err));
    // If the user indicates it is not correct, they are given the chance to amend the fields 
    } else if (confirmed.pressed){
        document.getElementById('manualInput').style.display = 'block';
        document.getElementById('DOT').value=dotResult.DOT;
        document.getElementById('companyName').value=dotResult.companyName;
        document.getElementById('MCP').value=dotResult.MCP;
        document.getElementById('address').value=dotResult.address;
        document.getElementById('phone').value=dotResult.phoneNumber;
        document.getElementById('powerUnits').value=dotResult.powerUnits;
        document.getElementById('drivers').value=dotResult.drivers;
        document.getElementById('mailingAddress').value=dotResult.mailingAddress;

        resultField.style.display = 'none';

    }
}

// This function runs when the user indicates that the information returned from the DOTsearch is not correct and is given the chance to edit the fields.
function saveSecondLead(e) {
    e.preventDefault();
    dotResult.name = document.getElementById('name').value;
    dotResult.email = document.getElementById('email').value;
    dotResult.totalPayroll = document.getElementById('totalPayroll').value;
    dotResult.mileage = document.getElementById('mileage').value;
    dotResult.DOT = document.getElementById('DOT').value;
    dotResult.companyName = document.getElementById('companyName').value;
    dotResult.MCP = document.getElementById('MCP').value;
    dotResult.address = document.getElementById('address').value;
    dotResult.mailingAddress = document.getElementById('mailingAddress').value;
    dotResult.phoneNumber = document.getElementById('phone').value;
    dotResult.drivers = document.getElementById('drivers').value;
    dotResult.powerUnits = document.getElementById('powerUnits').value;
    const uri = uriRoot+'lead';
    const result = fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dotResult)
    }).then(
        // response => response.json()
        document.getElementById('manualInput').style.display = 'none',
        resultField.style.display = 'block',
        resultField.innerHTML=`<p>Thank you for confirming! We will contact you shortly!</p>`
        )
    .catch(err=>console.log(err));
}

let confirmed = {
    value: false,
    pressed: 0   
};

function confirm(boolean){
    confirmed.value = boolean;
    confirmed.pressed++;
    document.getElementById('save1').style.backgroundColor="green";
    document.getElementById('save1').style.cursor="pointer";
    document.getElementById('save2').style.backgroundColor="green";
    document.getElementById('save2').style.cursor="pointer";
    return confirmed;
}   

