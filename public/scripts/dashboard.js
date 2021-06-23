// class Lead {
//     constructor(name, email, companyName, phone, DOT, address, mailingAddress,
//     powerUnits, drivers, totalPayroll, mileage, carrierOperation, operationType, 
//     cargoCarried, stage, _id) {
//         this.name = name;
//         this.email = email;
//         this.companyName = companyName;
//         this.phone = phone;
//         this.DOT = DOT;
//         this.address = address;
//         this.mailingAddress = mailingAddress;
//         this.powerUnits = powerUnits;
//         this.drivers = drivers;
//         this.totalPayroll = totalPayroll;
//         this.mileage = mileage;
//         this.carrierOperation = carrierOperation;
//         this.operationType = operationType;
//         this.cargoCarried = cargoCarried;
//         this.stage = stage;
//         this._id = _id;
//     }
//     method() {
//         return something;
//     }
// }

// let user = new Lead(user.name, 


const delay = ms => new Promise(res => setTimeout(res, ms));


// const dButtons = Array.from(document.getElementsByClassName('dashboard-nav-button'));
// const dSections = Array.from(document.getElementsByClassName('dashboard-section'));

// async function dashboardToggle(e, id) {
//     dSections.forEach(async (sec) => {
//         sec.style.opacity=0;
//         sec.classList.add("hidden");
//     });
//     dButtons.forEach((button) => {
//         button.style.background="rgb(55, 147, 255)";
//     });
//     if (e.target.nodeName=="DIV") {;
//         e.target.style.background="#1C2541";
//     } else {
//         e.target.parentNode.style.background="#1C2541";
//     }
//     document.getElementById(id).classList.remove("hidden")
//     await delay(300);
//     unToggleForm();
//     if (e.target.parentNode.querySelector('.alert')) {
//         removeAlertIcon(e.target.parentNode);
//     }
//     document.getElementById(id).style.opacity=1;
// }


// Upload files and display the title
// document.getElementById('file-upload').addEventListener("change", (event) => {
//     const file = URL.createObjectURL(event.target.files[0]);
//     const aTag = document.createElement('a');
//     aTag.setAttribute("href", file);
//     aTag.setAttribute("target", "_blank");
//     aTag.innerText = event.target.files[0].name;
//     document.getElementById('file-preview').append(aTag);
// });

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

function requestSignature() {
    let data = { };
    fetch('/events/requestSig', {
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
// function displayMessages(messages) {

//     for (const [key, value] of Object.entries(messages)) {
//         if (key=="document") {
//             addAlertIcon('progressButton')
//             let block = document.createElement('div')
//             block.classList.add('events-area');
//             block.innerText=value;
//             document.getElementById('progress-messages').append(block)
//         }
//         if (key=="profile") {
//             addAlertIcon('profileButton')
//             let block = document.createElement('div')
//             block.classList.add('events-area');
//             block.innerText=value;
//             document.getElementById('profile-messages').append(block)
//         }
//         if (key=="contact") {
//             addAlertIcon('policyButton')
//             let block = document.createElement('div')
//             block.classList.add('events-area');
//             block.innerText=value;
//             document.getElementById('policy-messages').append(block)
//         }
//         // console.log(`${key}: ${value}`);
//       }
// }

const userEmail = document.getElementById('dbScript').getAttribute('data-email');

async function loadUser(email) {
    // search in Mongo DB
    const user = await mongoSearch(email);

    return user;
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

// This adds an alert to the element that is passed into it
function addAlertIcon(elementID) {
    const alertIcon = document.createElement('div');
    alertIcon.classList.add('alert');
    alertIcon.innerText="!";
    document.getElementById(elementID).append(alertIcon);
}

// This removes the alert from the button that is passed into it
function removeAlertIcon(node) {
    const alertIcon = node.lastElementChild;
    if (alertIcon.classList.contains('alert')) alertIcon.remove();
}


// When the user logs in, the SARK DB is queried for any updates from the SARK side
// queryEvents(userDOT);
function displayVisualProgress(stage) {
    const progressValue = `${stage * 20}%`;
    document.getElementById('progress-bar').style.width=progressValue;
    document.getElementById('progress-value').innerText=progressValue;
}

function giveInstructions(stage) {

    switch(stage) {
        case 1:
            instructions = `<p>Thank you for signing up with TruckerComp!</p> 
            <p>We can help you find the best possible rates for workers compensation.</p>
            <p>To move forward with your application, please</p>
            <p>click on Profile to review and update your profile.</p>`;
            break;
        case 2:
            instructions = `<p>Thank you for signing up with TruckerComp!</p> 
            <p>We can help you find the best possible rates for workers compensation.</p>
            <p>To move forward with your application, please</p>
            <p>click on Profile to view and update your profile.</p>`;
            break;
        case 3:
            instructions = `<p>We have recieved your profile!</p> 
            <p>In order to complete your application, please submit</p>
            <p>the following documents:</p>
            <ul>
            <li>2020 W-2 Form</li>
            <li>2020 1099 Form</li>
            <li>XXXXXXX</li>
            </ul>`;
            break;
        case 4:
            instructions = `<p>Thank you for your submission!</p>
            <p>We are processing your documents and will reach out to you</p>
            <p>with confirmation when all paperwork is complete.</p>
            <p>We thank you for your patience</p>`;
            break;
        case 5:
            instructions = `<p>All documents have been received.</p> 
            <p>Please review the attached form carefully, </p>
            <p>and provide your signature to purchase your policy!</p>`;
            break;
        default:
            instructions = `<p>There has been an error. Please logout and reload your profile.</p>`;
            break;
    }
    document.getElementById('progress-instructions').innerHTML = instructions;
}


window.onload = async ()=> {
    let user = await loadUser(userEmail);
    // Determine user stage
    if (user.stage) {
        console.log("loaded stage: ", user.stage);
        
        displayVisualProgress(user.stage);
        giveInstructions(user.stage);
    } else {
        displayVisualProgress(1);
        giveInstructions(1);
    }
    // addAlertIcon('progress-instructions');
    // 1-- create profile
    // 2-- edit & submit profile
    // 3-- submit necessary docs
    // 4-- sign forms
    // 5-- get approved

    // if (user.stage) {
    // Show messages if any exist
    // if (user.DOT) {
    // requestSignature();

    try {
        let messages = await queryEvents(userDOT);
        if (messages) displayMessages(messages);
    } catch (err) {
        console.log("no messages");
    }

}