

let uriRoot = '';


var leadData = {
    name: '',
    email: '',
    DOT: '',
    MC: '',
    totalPayroll: '',
    mileage: '',
    companyName: '',
    address: '',
    mailingAddress: '',
    phone: '',
    employees: '',
    powerUnits: '',
    stage: 1,
    _id: ''
}

function hideElement(...elements) {
    elements.forEach((e)=> document.getElementById(e).style.maxHeight='0');
}

function showElement(...elements) {
    elements.forEach((e)=> document.getElementById(e).style.maxHeight='4000px');
}

function showInfo() {
    showElement('infoDisplay');
    hideElement('two-column');
}

function hideInfo() {
    hideElement('infoDisplay', 'manualInput');
    showElement('two-column');
}

function editInfo() {
    hideElement('two-column', 'infoDisplay');
    showElement('manualInput');
}

function addRow(e) {
    if(e) e.preventDefault()
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
                document.getElementById('searchError').innerText=`No result found for ${dot['dot']}.`;
            // If a client is found
            } else {
                document.getElementById('DOT').value = client.result['DOT Number'];
                document.getElementById('companyName').value = client.result['Company Name'];
                document.getElementById('MC').value = client.result['MCP Number'];
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

// This deletes the error message when the field is typed into.
document.getElementById('DOTsearch').addEventListener('keyup', ()=> {
    document.getElementById('searchError').innerText='';
});

// This function makes the API call to the server, searching for the DOT number in the sark_client DB and returning one client that matches that number 
async function fetchDOT(dotObject) {
    const uri = uriRoot+'dot';

    const result = fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dotObject)
    }).then(response => response.json()).catch(err=>console.log(err));
    console.log(result);
    return result;
}

function saveLead(e) {
    e.preventDefault();
    if (document.getElementById('name').value &&
    document.getElementById('email').value &&
    document.getElementById('DOT').value &&
    document.getElementById('phone').value) {
        leadData.name = document.getElementById('name').value;
        leadData.email = document.getElementById('email').value;
        leadData.mileage = document.getElementById('mileage').value ?? '';
        leadData.DOT = document.getElementById('DOT').value;
        leadData.companyName = document.getElementById('companyName').value ?? '';
        leadData.MC = document.getElementById('MC').value ?? '';
        leadData.address = document.getElementById('address').value ?? '';
        leadData.mailingAddress = document.getElementById('mailingAddress').value ?? '';
        leadData.phone = document.getElementById('phone').value;
        leadData.powerUnits = document.getElementById('powerUnits').value ?? '';
        leadData._id = document.getElementById('userID').value;
        leadData.employees = saveEmployeeData();
        const formlines = document.getElementsByClassName('formline').length;
        var payrollSum = 0;
        for (let i=0; i<formlines; i++) {
            payrollSum+=parseInt(document.getElementById(`empPayroll${i}`).value);
        }
        leadData.totalPayroll=payrollSum;
        leadData.stage=2;
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
    } else {
        document.getElementById('saveError').innerText='Please enter at least your Name, Email Address, DOT Number, and Phone Number';
    }
}

function removeSaveError() {
    document.getElementById('saveError').innerText='';
}


// RESUME HERE
async function fetchUser(id) {
    const uri = uriRoot+'user';
    const idObj = {"id": id}; 
    const result = fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idObj)
    }).then(response => response.json())
    .catch(err=>console.log(err));

    return result;
}

// async function fetchUser(DOT) {
//     const uri = uriRoot+'user';

//     const result = fetch(uri, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(DOT)
//     }).then(response => response.json()).catch(err=>console.log(err));

//     return result;

// }



function setStages() {
    const steps = document.getElementsByClassName('step');
    for (let i=0; i<steps.length; i++) {
        steps[i].classList.remove('active')
    }
    const stage = document.getElementById('userStage').value;
    document.getElementsByClassName(`next-step${parseInt(stage)+1}`)[0].classList.add('active');
    
    for (var j = parseInt(stage)+2; j<5; j++) {
        document.getElementsByClassName(`upcoming-step${j}`)[0].classList.add('active');
    }

    for (let k = stage; k>0; k--) {
        document.getElementsByClassName(`completed-step${k}`)[0].classList.add('active');
    }

}


function displayEmployees(object) {
    const empObject = JSON.parse(object); 
    const numlines = empObject.length;
    for (let i = 0; i<numlines; i++) {
        document.getElementById(`empType${i}`).options[0].removeAttribute('selected');
        document.getElementById(`empType${i}`).value=empObject[i].type;
        document.getElementById(`empNumber${i}`).value= empObject[i].number ?? '';
        document.getElementById(`empPayroll${i}`).value= empObject[i].payroll ?? '';
        addRow();
    }
}


window.onload = async () => {
    const dot = document.getElementById('dbscript').getAttribute('data-user-dot');
    setStages();
    if (dot) {
        const id = document.getElementById('dbscript').getAttribute('data-user-id');
        const user = await fetchUser(id);
        // console.log(document.getElementById('dbscript').getAttribute('data-user-employees'));

        document.getElementById('name').value=user.user.name ?? '';
        document.getElementById('userName').value=user.user.name ?? '';
        document.getElementById('email').value=user.user.email ?? '';
        document.getElementById('userEmail').value=user.user.email ?? '';
        document.getElementById('userTotalPayroll').value=user.user.totalPayroll ?? '';
        document.getElementById('mileage').value=user.user.mileage ?? '';
        document.getElementById('userMileage').value=user.user.mileage ?? '';
        document.getElementById('DOT').value=user.user.DOT ?? '';
        document.getElementById('userDOT').value=user.user.DOT ?? '';
        document.getElementById('MC').value=user.user.MC ?? '';
        document.getElementById('userMC').value=user.user.MC ?? '';
        document.getElementById('companyName').value=user.user.companyName ?? '';
        document.getElementById('userCompanyName').value=user.user.companyName ?? '';
        document.getElementById('address').value=user.user.address ?? '';
        document.getElementById('userAddress').value=user.user.address ?? '';
        document.getElementById('phone').value=user.user.phone ?? '';
        document.getElementById('userPhone').value=user.user.phone ?? '';
        document.getElementById('mailingAddress').value=user.user.mailingAddress ?? '';
        document.getElementById('userMailingAddress').value=user.user.mailingAddress ?? '';
        document.getElementById('powerUnits').value=user.user.powerUnits ?? '';
        document.getElementById('userPowerUnits').value=user.user.powerUnits ?? '';
        if (user.user.employees.length) displayEmployees(user.user.employees);
    } else {
        console.log("no DOT exists for this user.");
        console.log(document.getElementById('dbscript').getAttribute('data-user-employees'));
        // displayEmployees();
    }
}

