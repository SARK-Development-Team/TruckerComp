
// This section handles changing the carousel's active slide

let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
initializeCarousel();

// Sets all formData to initial values 
// Arranges slides so that all but the first start off screen on the right
function initializeCarousel() {
    formData = {
        employees: [],
        payroll: 0,
        businessType: 0,
        zipCode: 0,
        mileage: 0,
        email: ''
    }
    for (let i = 0; i < slides.length; i++) {
        let multiplier = i*100;
        slides[i].style.transform= "translateX(" + multiplier +"vw)";  
    }
}

// When the slides advance, the next slide moves in from the right and the old moves out to the left
function changeSlide(n) {
    for (let i = 0; i < slides.length; i++) {
        let value = slides[i].style.transform;
        let numValue = parseInt(value.replace("translateX(", "").replace("vw",""));
        if (n<0) {
            numValue+=178;
        } else if (n>0) {
            numValue-=178;
        }
        let newValue = "translateX(" + numValue.toString() +"vw)";
        slides[i].style.transform= newValue;  
    }
}

function resetForm() {
    initializeCarousel();
    deactivateSlide(1);
}

// Only allow the user to progress if the content is valid.
// If a choice is made, the next button is activated

function nextSlide(slideIndex) {
    const next = document.getElementById('next' + slideIndex);
    next.style.opacity=1;
    next.style.cursor="pointer"
    next.onclick = () => changeSlide(1);
}

function deactivateSlide(slideIndex) {
    const next = document.getElementById('next' + slideIndex);
    next.style.opacity=0;
    next.style.cursor=""
    next.onclick = '';
}

//------Slide 1 
const aff = document.getElementById('slide1Yes');
const neg = document.getElementById('slide1No');

aff.onclick = () => {
    aff.classList.add('selected');
    neg.classList.remove('selected');
    const empOrSelf = document.getElementById('empOrSelf');
    empOrSelf.innerText = 'my employees';
    const slide3 = document.getElementById('slide3');
    const slide4 = document.getElementById('slide4');
    const slide5 = document.getElementById('slide5');
    const slide6 = document.getElementById('slide6');
    slide3.style.display='grid';
    slide4.style.transform = "translateX(300vw)";
    slide5.style.transform = "translateX(400vw)";
    slide6.style.transform = "translateX(500vw)";
    nextSlide(1);
}
// Todo: add a function to skip slide 3 if "neg" is active
neg.onclick = () => {
    neg.classList.add('selected');
    aff.classList.remove('selected');
    const empOrSelf = document.getElementById('empOrSelf');
    empOrSelf.innerText = 'I';
    const slide3 = document.getElementById('slide3');
    const slide4 = document.getElementById('slide4');
    const slide5 = document.getElementById('slide5');
    const slide6 = document.getElementById('slide6');
    slide3.style.display='none';
    slide4.style.transform = "translateX(200vw)";
    slide5.style.transform = "translateX(300vw)";
    slide6.style.transform = "translateX(400vw)";
    nextSlide(1)
};

//------Slide 2
// For slides 2-4, the formData is updated based on the user's input.
const longhaul = document.getElementById('slide2LongHaul');
const sand = document.getElementById('slide2Sand');
const local = document.getElementById('slide2Local');
const towing = document.getElementById('slide2Towing');

longhaul.onclick = () => {
    longhaul.classList.add('selected');
    sand.classList.remove('selected');
    local.classList.remove('selected');
    towing.classList.remove('selected');
    formData.businessType = 1;
    nextSlide(2);
}
sand.onclick = () => {
    longhaul.classList.remove('selected');
    sand.classList.add('selected');
    local.classList.remove('selected');
    towing.classList.remove('selected');
    formData.businessType = 2;
    nextSlide(2);
}
local.onclick = () => {
    longhaul.classList.remove('selected');
    sand.classList.remove('selected');
    local.classList.add('selected');
    towing.classList.remove('selected');
    formData.businessType = 3;
    nextSlide(2);
}
towing.onclick = () => {
    longhaul.classList.remove('selected');
    sand.classList.remove('selected');
    local.classList.remove('selected');
    towing.classList.add('selected');
    formData.businessType = 4;
    nextSlide(2);
}

//------Slide 3 
const employeesField = document.getElementById('empNumber0');
const payrollField = document.getElementById('empPayroll0');
const newRow = document.getElementById('newRow');

function saveEmployeeData(){
    formData.employees = [];
    const formlines = document.getElementsByClassName('formline');
    for (let i=0; i<formlines.length; i++) {
        let type = document.getElementById('empType'+i).value;
        let number = document.getElementById('empNumber'+i).value;
        let payroll = document.getElementById('empPayroll'+i).value;
        if (type && number && payroll) {
            formData.employees.push({'type: ': type, 'number: ': number, 'payroll: ': payroll});
        }
    }
    if (formData.employees.length) {
        nextSlide(3);
    } else {
        deactivateSlide(3);
    }
}

// employeesField.addEventListener('keyup', () => {
//     const input = parseInt(employees.value);
//     const empError = document.getElementById('empError');
//     if (input>0 && Number.isInteger(input)) {
//         formData.employees = input;
//         empError.style.visibility='hidden';
//         checkSlide3();
//     } else {
//         empError.style.visibility='visible';
//         deactivateSlide(3)
//     }
// });

function addRow(e) {
    e.preventDefault()
    const formlines = document.getElementsByClassName('formline').length;
    const line = `                                
    <p class="formline">
        <select class="empType" id="empType${formlines}">
            <option value="" disabled selected>Employee Type</option>
            <option value="driver">Driver</option>
            <option value="maintenance">Maintenance</option>
            <option value="accounting">Accounting</option>
            <option value="custodial">Custodial</option>
            <option value="clerical">Clerical</option>
            <option value="other">Other</option>
        </select>
        <input class="empNumber" name="empNumber${formlines}" type="number" id="empNumber${formlines}">
        <input class="empPayroll" name="empPayroll${formlines}" type="number" id="empPayroll${formlines}">
    </p>
    `
    // const line = document.getElementById("employeeInfoTable").firstElementChild;

    let lineElement = document.createElement('div');
    lineElement.innerHTML=line;
    // lineElement = lineElement.firstChild;
    document.getElementById("employeeInfoTable").appendChild(lineElement);
}

// Checks to see if values have been entered for slide 3; if so, allows progress to next slide
// function checkSlide3() {
//     if (formData.employees>0&&formData.payroll>0){
//         nextSlide(3);
//     }
// }

//------Slide 4 
const zip = document.getElementById('slide4Zipcode');
const miles = document.getElementById('slide4Mileage');

zip.addEventListener('keyup', () => {
    const input = parseInt(zip.value);
    const zipError = document.getElementById('zipError');
    if (input>0 && Number.isInteger(input)) {
        formData.zipCode = input;
        zipError.style.visibility = 'hidden';
        checkSlide4();
    } else {
        zipError.style.visibility = 'visible';
    }
});

miles.addEventListener('keyup', () => {
    const input = parseInt(miles.value);
    const milesError = document.getElementById('milesError');
    if (input>0 && Number.isInteger(input)) {
        formData.mileage = input;
        milesError.style.visibility = 'hidden';
        checkSlide4();
    } else {
        milesError.style.visibility = 'visible';
    }
});



// Checks to see if values have been entered for slide 4; if so, allows progress to next slide
// Also populates the quote on slide 6.
function checkSlide4() {
    if (formData.zipCode>0&&formData.mileage>0){
        nextSlide(4);
        fillInfo(formData);
        requestQuoteSlide(formData);
    } else {
        deactivateSlide(4);
    }
}

// Fills in the data area on slide 5 for confirmation
function fillInfo(data) {
    const q1 = document.getElementById('q1');
    const q2 = document.getElementById('q2');
    const q3 = document.getElementById('q3');
    const q4 = document.getElementById('q4');
    if (formData.employees>0) {
        q1.innerText='Number of employees: ' + data.employees;
        q2.innerText='Annual payroll: ' + data.payroll;
    } else {
        q1.innerText = 'No employees'
    }
    switch (data.businessType) {
        case 1:
            q3.innerText='Type of business: Long-Haul Trucking';
            break;
        case 2:
            q3.innerText='Type of business: Sand & Gravel Trucking';
            break;
        case 3:
            q3.innerText='Type of business: Local Trucking';
            break;
        case 4:
            q3.innerText='Type of business: Towing Services';
            break;
        default:
            q3.innerText='Error';
            break;
    }
    q4.innerText='Zip code: '+ data.zipCode + '\n Number of miles driven: ' + data.mileage;
}


//------Slide 5

const email = document.getElementById('slide5Email');

email.addEventListener('keyup', () => {

    const input = email.value;
    const submit = document.getElementById('submit');
    // this regex tests for an email address
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const emailError = document.getElementById('emailError');
    if (input!='' && regex.test(input)) {
        formData.email = input;
        emailError.style.visibility = 'hidden';
        submit.style.background='#4ca846';
        submit.onclick=function() {
            changeSlide(1); 
            // this function sends the email
            sendQuote(formData);
        };
        setCookie("Form", JSON.stringify(formData));
    } else {
        submit.style.background='red';
        submit.href = '';
        emailError.style.visibility = 'visible';
    }
});

// This is a method of determining the correct uriRoot for api calls
const lhPattern = /localhost/;
let uriRoot = '';
if (lhPattern.test(window.location.href)) {
    uriRoot = 'http://localhost:5001/'
} else {
    uriRoot = window.location.href;
}


// This sends the data to the backend and returns with a number for the quote
function fetchResult(data) {
    const uri = uriRoot+'quote';

    const result = fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());

    let number = result;
    return number;
}


//This is the call for the quote
async function requestQuoteSlide(data) {
    const lowEnd = document.getElementById("low-end");
    const highEnd = document.getElementById("high-end");
    const emailAdd = document.getElementById("email");

    let response = await fetchResult(data);
    let number = response.result;
    lowEnd.innerText=(number *0.8).toFixed(2);
    highEnd.innerText=(number *1.2).toFixed(2);
    emailAdd.innerText=data.email;
}

function sendQuote (data) {
    const uri = uriRoot+'send';

    fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
}


// Todo: determine if entered zip code is valid. 
zipCodeError = "Please enter a valid zip code."
// Consider this API: https://smartystreets.com/docs/cloud/us-zipcode-api

// This is the same setCookie function as in form-submission.js
function setCookie(name, value) {
    const today = new Date();
    const expiry = new Date(today.getTime() + 24 * 3600000); // saves cookie for 24 hours
    document.cookie=name + "=" + value + "; path=/; expires=" + expiry.toGMTString();
  }