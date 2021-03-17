let uriRoot = '';

const ctx = document.getElementById('myChart').getContext('2d');

async function fetchChart(percentage) {
    const uri = uriRoot+'chart';

    const result = fetch(uri, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(percentage)
    }).then(response => response.json()).catch(err=>console.log(err));

    return result;
}

fetchChart('20');

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

function saveInfo() {
    
}