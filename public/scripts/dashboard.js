// import Chart from '/chart.js';
var Chart = require('chart.js');

// RUN this command in CLI when updating this file:
// browserify public/scripts/dashboard.js -o public/scripts/bundle.js

let uriRoot = '';


var leadData = {
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
    employees: '',
    powerUnits: '',
}


const ctx = document.getElementById('myChart').getContext('2d');

const percentage = 20;

var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [{
            label: '% complete',
            data: [percentage, 100-percentage],
            backgroundColor: [
                'red',
                'white'
            ],
            borderColor: [
                'black',
                'black'
            ],
            borderWidth: 1
        }],
        labels: ['Complete']
    },
    options: {
        legend: {
            display: true,
            position: 'bottom'
        },
        animation: {
            animateRotate: true
        },
        responsive: false
    }
});

function hideElement(...elements) {
    elements.forEach((e)=> document.getElementById(e).style.display='none')
}

function showElement(...elements) {

    elements.forEach((e)=> {
        if (e=='two-column') {
            document.getElementById(e).style.display='flex';
        } else {
            document.getElementById(e).style.display='block';
        }
    })
}

function showInfo() {
    showElement('infoDisplay');
    hideElement('two-column');
}

function hideInfo() {
    hideElement('infoDisplay');
    showElement('two-column');
}

function editInfo() {
    hideElement('two-column', 'infoDisplay');
    showElement('manualInput');
}

function addRow(e) {
    e.preventDefault()
    const formlines = document.getElementsByClassName('formline').length;
    const line = `                                
    <p class="formline">
        <select class="empType" id="empType${formlines}">
            <option value="" disabled selected>Employee Type</option>
            <option value="Driver">Driver</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Accounting">Accounting</option>
            <option value="Custodial">Custodial</option>
            <option value="Clerical">Clerical</option>
            <option value="Other">Other</option>
        </select>
        <input class="empNumber" name="empNumber${formlines}" type="number" min="1" id="empNumber${formlines}" >
        <input class="empPayroll" name="empPayroll${formlines}" type="number" min="0.01" id="empPayroll${formlines}">
    </p>
    `
    let lineElement = document.createElement('div');
    lineElement.innerHTML=line;
    document.getElementById("employeeInfoTable").appendChild(lineElement);
}

function saveEmployeeData(){
    let empArray = [];
    const formlines = document.getElementsByClassName('formline');
    for (let i=0; i<formlines.length; i++) {
        let type = document.getElementById('empType'+i).value;
        let number = document.getElementById('empNumber'+i).value;
        let payroll = document.getElementById('empPayroll'+i).value;
        if (type && number && payroll) {
            empArray.push({'type': type, 'number': number, 'payroll': payroll});
        }
    }
    return empArray;
}

// When the button for the DOT search field is pressed
async function searchDOT() {
    let dot = {'dot': document.getElementById('DOTsearch').value};
    // Only searches if a value is entered
    if (dot['dot']) {
        try {
            const client = await fetchDOT(dot);

            // If a client is not found
            if (!client.result) {
                // resultField.innerHTML = `<p>No result found for ${dot['dot']}.</p>`
                alert(`No result found for ${dot['dot']}.`);
            // If a client is found
            } else {
                document.getElementById('name').value = client.result['Name'];
                document.getElementById('DOT').value = client.result['DOT Number'];
                document.getElementById('companyName').value = client.result['Company Name'];
                document.getElementById('MCP').value = client.result['MCP Number'];
                document.getElementById('address').value = client.result['Address'];
                document.getElementById('mailingAddress').value = client.result['Mailing Address'];
                document.getElementById('phone').value = client.result['Phone'];
                document.getElementById('powerUnits').value = client.result['Power Units'];
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

function saveLead(e) {
    e.preventDefault();
    leadData.name = document.getElementById('name').value;
    leadData.email = document.getElementById('email').value;
    leadData.totalPayroll = document.getElementById('totalPayroll').value;
    leadData.mileage = document.getElementById('mileage').value;
    leadData.DOT = document.getElementById('DOT').value;
    leadData.companyName = document.getElementById('companyName').value;
    leadData.MCP = document.getElementById('MCP').value;
    leadData.address = document.getElementById('address').value;
    leadData.mailingAddress = document.getElementById('mailingAddress').value;
    leadData.phoneNumber = document.getElementById('phone').value;
    leadData.powerUnits = document.getElementById('powerUnits').value;
    leadData.employees = saveEmployeeData();
    const uri = uriRoot+'lead';
    const result = fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
    }).then(
        alert('Thank you for confirming! We will contact you shortly!'),
        location.reload()
    )
    .catch(err=>console.log(err));
}

async function fetchUser() {
    const uri = uriRoot+'dot';

    const result = fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dotObject)
    }).then(response => response.json()).catch(err=>console.log(err));

    return result;
}


// window.onload=generateChart();