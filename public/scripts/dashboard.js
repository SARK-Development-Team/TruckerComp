var leadData = {
    name: '',
    email: '',
    companyName: '',
    phone: '',
    DOT: '',
    address: '',
    mailingAddress: '',
    powerUnits: '',
    drivers: '',
    totalPayroll: '',
    mileage: '',
    carrierOperation: '',
    operationType: [],
    cargoCarried: [],
    stage: 1,
    _id: ''
}

let dataOpType = document.getElementById('dbScript').getAttribute('data-opType');
let opClasses = [];

if (dataOpType) {
    if (dataOpType.includes('')) {
        opClasses = dataOpType.replace(',', '').split('');     
        opClasses.pop();
    } else {
        opClasses = JSON.parse(document.getElementById('dbScript').getAttribute('data-opType'));
    }
}
document.getElementById('opTypes').innerText=opClasses;
let dataCargo = document.getElementById('dbScript').getAttribute('data-cargo');
let cargo = [];

if (dataCargo) { 
    if (dataCargo.includes('')) {
        cargo = dataCargo.replace(',', '').split('');     
        cargo.pop();
    } else {
        cargo = JSON.parse(document.getElementById('dbScript').getAttribute('data-cargo'));
    }
}
document.getElementById('cargo').innerText=cargo;


// First clear all existing data in the dropdown fields if there is any
// This avoids duplicate display of data
function clearDropDownFields() {
    // if (document.querySelectorAll('.drop-display')[0].childNodes[0].innerText) {
    if (document.querySelectorAll('.drop-display')[0].firstChild.innerText) {
        const operationTypeChoices = Array.from(document.querySelectorAll('.drop-options')[0].childNodes[0].childNodes);
        for (const el of operationTypeChoices) {
            opTypeDrop.removeOption(event, el)
        }   
    }
    if (document.querySelectorAll('.drop-display')[1].childNodes[0].innerText) {
        const cargoCarriedChoices = Array.from(document.querySelectorAll('.drop-options')[1].childNodes[0].childNodes);
        for (const el of cargoCarriedChoices) {
            cargoDrop.removeOption(event, el)
        }    
    }       
}
 


const delay = ms => new Promise(res => setTimeout(res, ms));

const dButtons = Array.from(document.getElementsByClassName('dashboard-nav-button'));
const dSections = Array.from(document.getElementsByClassName('dashboard-section'));

async function dashboardToggle(e, id) {
    dSections.forEach(async (sec) => {
        sec.style.opacity=0;
        sec.classList.add("hidden");
    });
    dButtons.forEach((button) => {
        button.style.background="rgb(55, 147, 255)";
    });
    if (e.target.nodeName=="DIV") {;
        e.target.style.background="#1C2541";
    } else {
        e.target.parentNode.style.background="#1C2541";
    }
    document.getElementById(id).classList.remove("hidden")
    await delay(300);
    unToggleForm();
    document.getElementById(id).style.opacity=1;
}


// Upload files and display the title
document.getElementById('file-upload').addEventListener("change", (event) => {
    const file = URL.createObjectURL(event.target.files[0]);
    const aTag = document.createElement('a');
    aTag.setAttribute("href", file);
    aTag.setAttribute("target", "_blank");
    aTag.innerText = event.target.files[0].name;
    document.getElementById('file-preview').append(aTag);
});


async function toggleForm() {
    populateDropDownBoxes();
    document.getElementById("userInfoStatic").style.display="none";
    await delay(300);
    document.getElementById("userInfoUpdate").style.display="block";
}

function unToggleForm() {
    document.getElementById("userInfoUpdate").style.display="none";
    document.getElementById("userInfoStatic").style.display="grid";
}

function saveForm(e) {
    e.preventDefault;
    saveLead(e);
    unToggleForm();
}


function addMessage(message) {
    const mess = document.createElement('div')
    mess.innerHTML=message;
    document.getElementById('messages-area').append(mess);
}

function requestDocument(data) {
    console.log(data);
    const message = fetch('/requestDoc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: (data)
    }).then(response => response.json());
    addMessage(message);
}

function requestInformation(data) {
    fetch('/requestInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
}

function requestSignature(data) {

    if(true) {
        eversign.open({
            url: "YOUR_EMBEDDED_SIGNING_URL",  //<----replace with correct url
            containerID: "container",
            width: 600,
            height: 600,
            events: {
              loaded: function () {
                console.log("loaded Callback");
              },
              signed: function () {
                console.log("signed Callback");
              },
              declined: function () {
                console.log("declined Callback");
              },
              error: function () {
                console.log("error Callback");
              }
            }
        });
    }
    fetch('/requestSig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
}

async function queryEvents(DOT) {
    const user = {'DOT': DOT};
    const events = await fetch('/events/queryAll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    }).then(response => response.json());
    return events;
}

// receives an array of messages and displays them in the dashboard
function displayMessages(messages) {
    for (const [key, value] of Object.entries(messages)) {
        console.log(`${key}: ${value}`);
      }
}

const userEmail =document.getElementById('dbScript').getAttribute('data-email');

async function loadUser(email) {
    // search in Mongo DB
    const user = await mongoSearch(email);

    return user;
}

async function mongoSearch(email) {
    const data = {'email': email};
    const result = await fetch('mongoSearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json())
    // .json())
    // console.log("res: ", result)
    return result;
}

function displayUserData(user) {
    document.getElementById('name').value = user.name;
    document.getElementById('userName').innerText = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('userEmail').innerText = user.email;
    document.getElementById('companyName').value = user.companyName;
    document.getElementById('userCompanyName').innerText = user.companyName;
    document.getElementById('phone').value = user.phone;
    document.getElementById('userPhone').innerText = user.phone;
    document.getElementById('DOT').value = user.DOT;
    document.getElementById('userDOT').innerText = user.DOT;
    document.getElementById('address').value = user.address;
    document.getElementById('userAddress').innerText = user.address;
    document.getElementById('mailingAddress').value = user.mailingAddress;
    document.getElementById('userMailingAddress').innerText = user.mailingAddress;
    document.getElementById('powerUnits').value = user.powerUnits;
    document.getElementById('userPowerUnits').innerText = user.powerUnits;
    document.getElementById('drivers').value = user.drivers;
    document.getElementById('userDrivers').innerText = user.drivers;
    document.getElementById('totalPayroll').value = user.totalPayroll;
    document.getElementById('userTotalPayroll').innerText = user.totalPayroll;
    document.getElementById('mileage').value = user.mileage;
    document.getElementById('userMileage').innerText = user.mileage;
    document.getElementById('carrierOperation').value = user.carrierOperation;
    document.getElementById('userCarrierOperation').innerText = user.carrierOperation;
    displayDDValues();
}


// saves the dashboard form data to the Azure DB 
function saveLead(e) {
    e.preventDefault;
    if (document.getElementById('name').value &&
    document.getElementById('email').value &&
    document.getElementById('DOT').value &&
    document.getElementById('phone').value) {
        leadData.name = document.getElementById('name').value;
        leadData.email = document.getElementById('email').value;
        leadData.mileage = document.getElementById('mileage').value;
        leadData.DOT = document.getElementById('DOT').value;
        leadData.companyName = document.getElementById('companyName').value;
        leadData.address = document.getElementById('address').value;
        leadData.mailingAddress = document.getElementById('mailingAddress').value;
        leadData.phone = document.getElementById('phone').value;
        leadData.powerUnits = document.getElementById('powerUnits').value;
        leadData._id = document.getElementById('userID').value;
        leadData.totalPayroll = document.getElementById('totalPayroll').value;
        leadData.drivers = document.getElementById('drivers').value;
        leadData.carrierOperation = document.getElementById('carrierOperation').value;
        // These lines establish the contents of the dropdown boxes 
        let operationTypeChoices = Array.from(document.querySelectorAll('.drop-display')[0].childNodes[0].childNodes);
        let cargoCarriedChoices = Array.from(document.querySelectorAll('.drop-display')[1].childNodes[0].childNodes);

        for (let i=0; i<operationTypeChoices.length; i++) {
            if (!operationTypeChoices[i].classList.contains('hide')) {
                leadData.operationType.push(operationTypeChoices[i].innerText);
            }
        }
        for (let j=0; j<cargoCarriedChoices.length; j++) {
            if (!cargoCarriedChoices[j].classList.contains('hide')) {
                leadData.cargoCarried.push(cargoCarriedChoices[j].innerText);
            }
        }
        leadData.stage=2;
        // const uri = uriRoot+'lead';
        const result = fetch('update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
        }).then(
            alert('Thank you for confirming! We will contact you shortly!'),
            // location.reload()
        )
        .catch(err=>console.log(err));
    } else {
        alert('Please enter a name, email address, DOT Number, and phone number');
        // document.getElementById('saveError').innerText='Please enter at least your Name, Email Address, DOT Number, and Phone Number';
    }
}

function displayDDValues() {
//    These pull the dropdown menu options out of the script option, which are strings, and turn them into arrays
// And then populate the form with the applicable items
if (dataOpType) {
    document.getElementById('opTypes').innerText = '';
    console.log(typeof dataOpType);
    let opClasses = JSON.parse(document.getElementById('dbScript').getAttribute('data-opType'));
    document.getElementById('opTypes').innerText = opClasses.join(", ");

}
if (document.getElementById('dbScript').getAttribute('data-cargo')) {
    document.getElementById('cargo').innerText = '';
    let cargo = JSON.parse(document.getElementById('dbScript').getAttribute('data-cargo'));
    document.getElementById('cargo').innerText = cargo.join(", ");
}

}

// This adds an alert to the button that is passed into it
function addAlertIcon(buttonID) {
    const alertIcon = document.createElement('div');
    alertIcon.classList.add('alert');
    alertIcon.innerText="!";
    document.getElementById(buttonID).append(alertIcon);
}

// This removes the alert from the button that is passed into it
function removeAlertIcon(buttonID) {
    const alertIcon = document.getElementById(buttonID).lastElementChild;
    if (alertIcon.classList.contains('alert')) alertIcon.remove();
}



// This function populates the dropdown boxes in the edit section with the appropriate data if there is any
function populateDropDownBoxes() {
    clearDropDownFields();
    
    // A new account that only exists in MongoDB stores the values slightly differently than one that has been updated and 
    // saved to the Azure DB
    // These lines sort out which pattern the values are stored as and turns them into arrays appropriately.
    let operationTypeChoices = document.querySelectorAll('.drop-options')[0].childNodes[0].childNodes;
    for (const el of opClasses) {
        for (const a of operationTypeChoices) {
            if (a.textContent==el) {
                opTypeDrop.addOption(event, a)
            }
        }
    }       
    let cargoCarriedChoices = document.querySelectorAll('.drop-options')[1].childNodes[0].childNodes;
    for (const el of cargo) {
        for (const a of cargoCarriedChoices) {
            if (a.textContent==el) {
                cargoDrop.addOption(event, a)
            }
        }
    }      
}

const userDOT = document.getElementById('DOT').value;

// When the user logs in, the SARK DB is queried for any updates from the SARK side
// queryEvents(userDOT);



window.onload = async ()=> {
    let user = await loadUser(userEmail);
    // Display relevant fields
    displayUserData(user);
    // Determine user stage
    // Stages:
    // 1-- create profile
    // 2-- edit & submit profile
    // 3-- submit necessary docs
    // 4-- sign forms
    // 5-- get approved
    // If user has 

    // Show progress
    // Load progress
    // if (user.stage) {
    // Show messages if any exist
    // if (user.DOT) {
        let messages = await queryEvents(userDOT);
    // }
    console.log("mess: ", messages);
    if (messages) displayMessages(messages);
}