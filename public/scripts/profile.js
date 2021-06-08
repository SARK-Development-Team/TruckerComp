const userEmail = document.getElementById('dbScript').getAttribute('data-email');
const userDOT = document.getElementById('DOT').value;


const delay = ms => new Promise(res => setTimeout(res, ms));

// This changes the static profile to the editable version
async function toggleForm() {
    document.getElementById("userInfoStatic").style.display="none";
    await delay(300);
    document.getElementById("userInfoUpdate").style.display="block";
}

// This changes the editable form back to the static profile
function unToggleForm() {
    document.getElementById("userInfoUpdate").style.display="none";
    document.getElementById("userInfoStatic").style.display="grid";
}


// This runs when the save button is pressed
async function saveForm(e) {
    e.preventDefault;
    saveLead(e);
    let user = await loadUser(userEmail);
    displayUserData(user);
    unToggleForm();
}

// First clear all existing data in the dropdown fields if there is any
// This avoids duplicate display of data
function clearDropDownFields() {
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


// Assign the user data to both the static form as well as the editable form
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
    displayDDValues(user);
    populateDDBoxes(user);

}
// This function shows the static values for the profile display page
function displayDDValues(user) {
    // These pull the dropdown menu options out of the script option, which are strings, and turn them into arrays
    // And then populate the form with the applicable items
    if (user.operationType) {
        document.getElementById('opTypes').innerText = '';
        // let opClasses = JSON.parse(document.getElementById('dbScript').getAttribute('data-opType'));
        let opClasses = []
        for (let i=0; i<user.operationType.length; i++) {
            opClasses.push(user.operationType[i].replace(/[^A-Za-z, ]/g, ""));
        }
        document.getElementById('opTypes').innerText = opClasses.join(", ");
    }
    if (user.cargoCarried) {
        document.getElementById('cargo').innerText = '';
        // let opClasses = JSON.parse(document.getElementById('dbScript').getAttribute('data-opType'));
        let cargo = []
        for (let i=0; i<user.cargoCarried.length; i++) {
            cargo.push(user.cargoCarried[i].replace(/[^A-Za-z, ]/g, ""));
        }
        document.getElementById('cargo').innerText = cargo.join(", ");
    }
}

// This function populates the dropdown boxes in the edit section with the appropriate data if there is any
function populateDDBoxes(user) {
    clearDropDownFields();

    let operationTypeChoices = document.querySelectorAll('.drop-options')[0].childNodes[0].childNodes;
    var opTypeArray = [];
    let reg = /\[/
    if (reg.test(user.operationType)) {
        let otypes = user.operationType.join('');
        otypes = otypes.split('",');
        for (let i = 0; i < otypes.length; i++) {
            otypes[i].replace(/[^A-Za-z,. ]/g, "");
            opTypeArray.push(otypes[i]);
        }
    } else {
        opTypeArray=user.operationType
    }
    for (let el of opTypeArray) {
        el = el.replace(/[^A-Za-z,. ]/g, "")
        for (const a of operationTypeChoices) {
            if (a.textContent==el) {
                opTypeDrop.addOption(event, a)
            }
        }
    }       
    let cargoCarriedChoices = document.querySelectorAll('.drop-options')[1].childNodes[0].childNodes;
    var cargoArray = [];
    if (reg.test(user.cargoCarried)) {
        let ctypes = user.cargoCarried.join('');
        ctypes = ctypes.split('",');
        for (let i = 0; i < ctypes.length; i++) {
            ctypes[i].replace(/[^A-Za-z,. ]/g, "");
            cargoArray.push(ctypes[i]);
        }
    } else {
        cargoArray=user.cargoCarried
    }
    for (let el of cargoArray) {
        el = el.replace(/[^A-Za-z,. ]/g, "")
        for (const a of cargoCarriedChoices) {
            if (a.textContent==el) {
                cargoDrop.addOption(event, a)
            }
        }
    }      
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
        leadData.operationType = [];
        leadData.cargoCarried = [];
        // These lines establish the contents of the dropdown boxes 
        let operationTypeChoices = Array.from(document.querySelectorAll('.drop-display')[0].childNodes[0].childNodes);
        let cargoCarriedChoices = Array.from(document.querySelectorAll('.drop-display')[1].childNodes[0].childNodes);

        for (let i=0; i<operationTypeChoices.length; i++) {
            if (!operationTypeChoices[i].classList.contains('hide') && 
            // !operationTypeChoices[i].classList.contains('add') && 
            !operationTypeChoices[i].classList.contains('remove')) {
                leadData.operationType.push(operationTypeChoices[i].innerText);
            }
        }
        for (let j=0; j<cargoCarriedChoices.length; j++) {
            if (!cargoCarriedChoices[j].classList.contains('hide') && 
            // !cargoCarriedChoices[j].classList.contains('add') && 
            !cargoCarriedChoices[j].classList.contains('remove')) {
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

// Search the mongo DB for the current user data
async function mongoSearch(email) {
    const data = {'email': email};
    const result = await fetch('mongoSearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json())
    return result;
}

async function loadUser(email) {
    // search in Mongo DB
    const user = await mongoSearch(email);

    return user;
}


window.onload = async ()=> {
    // Determine the current user
    let user = await loadUser(userEmail);
    // Display relevant fields
    displayUserData(user);


}