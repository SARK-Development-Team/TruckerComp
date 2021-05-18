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

// These pull the dropdown menu options out of the script option, which are strings, and turn them into arrays
// And then populate the form with the applicable items
if (document.getElementById('dbScript').getAttribute('data-opType')) {
    let opClasses = JSON.parse(document.getElementById('dbScript').getAttribute('data-opType'));
    document.getElementById('opTypes').innerText = opClasses.join(", ");
}
if (document.getElementById('dbScript').getAttribute('data-cargo')) {
    let cargo = JSON.parse(document.getElementById('dbScript').getAttribute('data-cargo'));
    document.getElementById('cargo').innerText = cargo.join(", ");
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
    document.getElementById("userInfoStatic").style.display="none";
    populateDropDownBoxes();
    await delay(300);
    document.getElementById("userInfoUpdate").style.display="block";
}

function unToggleForm() {
    document.getElementById("userInfoUpdate").style.display="none";
    document.getElementById("userInfoStatic").style.display="grid";
}

function saveForm(e) {
    e.preventDefault;
    unToggleForm();
    saveLead(e);
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

function queryEvents(userID) {
    fetch('/queryAll', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userID)
    }).then(response => response.json());
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
            leadData.operationType.push(operationTypeChoices[i].innerText);
        }
        for (let j=0; j<cargoCarriedChoices.length; j++) {
            leadData.cargoCarried.push(cargoCarriedChoices[j].innerText);
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
        // document.getElementById('saveError').innerText='Please enter at least your Name, Email Address, DOT Number, and Phone Number';
    }
}

// This function populates the dropdown boxes with the appropriate data if there is any
function populateDropDownBoxes() {
    if (document.getElementById('dbScript').getAttribute('data-opType')) {
        let operationTypeChoices = document.querySelectorAll('.drop-options')[0].childNodes[0].childNodes;
        let opClasses = JSON.parse(document.getElementById('dbScript').getAttribute('data-opType'));
        for (const el of opClasses) {
            for (const a of operationTypeChoices) {
                if (a.textContent==el) {
                    opTypeDrop.addOption(event, a)
                }
            }
        }       
    }
    if (document.getElementById('dbScript').getAttribute('data-cargo')) { 
        let cargoCarriedChoices = document.querySelectorAll('.drop-options')[1].childNodes[0].childNodes;
        let cargo = JSON.parse(document.getElementById('dbScript').getAttribute('data-cargo'));
        for (const el of cargo) {
            for (const a of cargoCarriedChoices) {
                if (a.textContent==el) {
                    cargoDrop.addOption(event, a)
                }
            }
        }      
    }
}

// When the user logs in, the SARK DB is queried for any updates from the SARK side
// queryEvents();
