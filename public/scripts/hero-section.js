
// This section handles changing the carousel's active slide
let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
initializeCarousel();

// Sets all formData to initial values 
// Arranges slides so that all but the first start off screen on the right
function initializeCarousel() {
    document.cookie = "clientData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Tabbing through the carousel breaks it, so this makes the carousel items untabbable
    let carouselContents = document.getElementById("carousel").querySelectorAll("*");
    for (let i =0; i<carouselContents.length; i++){
        carouselContents[i].setAttribute("tabindex", "-1");
        
    }
    formData = {
        employees: [],
        totalPayroll: 0,
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

// If the conditions are no longer met, the button for the next slide is deactivated
function deactivateSlide(slideIndex) {
    const next = document.getElementById('next' + slideIndex);
    next.style.opacity=0;
    next.style.cursor=""
    next.onclick = '';
}

/* ----------
   Slide 1
---------- */
const yes = document.getElementById('slide1Yes');
const no = document.getElementById('slide1No');

// If the user has employees
yes.onclick = () => {
    yes.classList.add('selected');
    no.classList.remove('selected');
    const lastYear = new Date().getFullYear()-1;
    const dSpan = document.getElementById('dynamicSpan');
    dSpan.innerText = `${lastYear}, my employees`;
    const slide3 = document.getElementById('slide3');
    const slide4 = document.getElementById('slide4');
    const slide5 = document.getElementById('slide5');
    const slide6 = document.getElementById('slide6');
    const slide7 = document.getElementById('slide7');
    slide3.style.display='grid';
    slide4.style.transform = "translateX(300vw)";
    slide5.style.transform = "translateX(400vw)";
    slide6.style.transform = "translateX(500vw)";
    slide7.style.transform = "translateX(600vw)";
    nextSlide(1);
}

// If the user does not have employees
no.onclick = () => {
    no.classList.add('selected');
    yes.classList.remove('selected');
    const lastYear = new Date().getFullYear()-1;
    const dSpan = document.getElementById('dynamicSpan');
    dSpan.innerText = `${lastYear}, I`;
    const slide3 = document.getElementById('slide3');
    const slide4 = document.getElementById('slide4');
    const slide5 = document.getElementById('slide5');
    const slide6 = document.getElementById('slide6');
    const slide7 = document.getElementById('slide7');
    slide3.style.display='none';
    slide4.style.transform = "translateX(200vw)";
    slide5.style.transform = "translateX(300vw)";
    slide6.style.transform = "translateX(400vw)";
    slide7.style.transform = "translateX(500vw)";
    nextSlide(1)
};

/* ----------
   Slide 2
---------- */

// For slides 2-5, the formData is updated based on the user's input.
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

function forwardProgress() {
    if (document.getElementById('slide4Zipcode').value && document.getElementById('slide4Mileage').value) {
        nextSlide(4);
    }
    if (document.getElementById('slide5Email')) {
        nextSlide(5);
    }
}


/* ----------
   Slide 3
---------- */

// This is the plus icon that sits beneath the employee information table
const newRow = document.getElementById('newRow');

// This function adds another row to the employee info table when the plus icon is pressed
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

// This function is called when the user is finished inputting data into the employee information table and presses the save button
// It ignores lines that are not complete
function saveEmployeeData(){
    formData.employees = [];
    formData.totalPayroll = 0;
    const formlines = document.getElementsByClassName('formline');
    for (let i=0; i<formlines.length; i++) {
        let type = document.getElementById('empType'+i).value;
        let number = document.getElementById('empNumber'+i).value;
        let payroll = document.getElementById('empPayroll'+i).value;
        if (type && number && payroll) {
            formData.employees.push({'type': type, 'number': number, 'payroll': payroll});
        }
        formData.totalPayroll+=parseInt(payroll);
    }
    if (formData.employees.length) {
        nextSlide(3);
    } else {
        deactivateSlide(3);
    }
}


/* ----------
   Slide 4
---------- */
const zip = document.getElementById('slide4Zipcode');
const miles = document.getElementById('slide4Mileage');

zip.addEventListener('keyup', async () => {
    const input = parseInt(zip.value);
    const zipError = document.getElementById('zipError');
    if (input>0 && Number.isInteger(input))  {
        if (zip.value.length>=5) {
            // const valid = await validateZIP(input);
            // if (valid) {
                formData.zipCode = input;
                zipError.style.visibility = 'hidden';
                checkSlide4();
            // } else {
            //     zipError.style.visibility = 'visible';
            // }
        }
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
    if (data.employees.length) {
        let empNum = 0;
        for (let i=0; i<data.employees.length; i++) {
            empNum+=parseInt(data.employees[i].number);
        }
        q1.innerText='Number of employees: ' + empNum;
        q2.innerText='Annual payroll: ' + data.totalPayroll;
    } else {
        q1.innerText = 'No employees'
        q2.innerText='Annual payroll: ' + "-";
    }
    switch (data.businessType) {
        case 1:
            q4.innerText='Type of business: Long-Haul Trucking';
            break;
        case 2:
            q4.innerText='Type of business: Sand & Gravel Trucking';
            break;
        case 3:
            q4.innerText='Type of business: Local Trucking';
            break;
        case 4:
            q4.innerText='Type of business: Towing Services';
            break;
        default:
            q4.innerText='Error';
            break;
    }
    q3.innerText='Zip code: '+ data.zipCode + '\n Number of miles driven: ' + data.mileage;
}


/* ----------
   Slide 5
---------- */

const email = document.getElementById('slide5Email');

email.addEventListener('keyup', () => {

    const input = email.value;
    const submit = document.getElementById('submit');
    // this regex tests for an email address
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const emailError = document.getElementById('emailError');
    if (input!='' && regex.test(input)) {
        formData.email = input;
        document.getElementById('spanEmail').innerText=input;
        setCookie('clientData', JSON.stringify(formData));
        emailError.style.visibility = 'hidden';
        submit.style.background='#EF8354';
        submit.style.cursor='pointer';
        submit.onclick=function() {
            nextSlide(5);
            nextSlide(6);
            populateRegistrationForm(formData);
            // changeSlide(1); 
            // this function sends the email
            sendQuote(formData);
        };
    } else {
        submit.style.background='#277EC3';
        submit.href = '';
        submit.style.cursor='unset';
        emailError.style.visibility = 'visible';
    }
});

// This is a method of determining the correct uriRoot for api calls.
// If it's serving on localhost, the test will trigger. Otherwise, the uriRoot will be the root address the site is served at
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
    let response = await fetchResult(data);
    let number = response.result;
    lowEnd.innerText=(number *0.8).toFixed(2);
    highEnd.innerText=(number *1.2).toFixed(2);
}


/* ----------
   Slide 6
---------- */

function sendQuote (data) {
    const uri = uriRoot+'send';

    fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
}

/* ----------
   Slide 7
---------- */


// If the cookie exists already, populate the email and the hidden inputs of the form with the values from the cookie.
function populateRegistrationForm(data) {

    document.getElementById('email').value=data.email;
    document.getElementById('employees').value=JSON.stringify(data.employees);
    document.getElementById('businessType').value=data.businessType;
    document.getElementById('totalPayroll').value=data.totalPayroll;
    document.getElementById('mileage').value=data.mileage;
    document.getElementById('zipCode').value=data.zipCode;
}



// Todo: determine if entered zip code is valid. 
// This code is not currently functional

function validateZIP(zipcode) {
    const uri = uriRoot+'zip';
    const zipCodeObj = {"zipcode": zipcode};
    // fetch(uri, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(zipCodeObj)
    // }).then(response => console.log(response.json()))
    // .catch((err)=>console.log("++",err));

    // return response;
    // return true;
}



function setCookie(name, value) {
    const today = new Date();
    const expiry = new Date(today.getTime() + 24 * 3600000); // saves cookie for 24 hours
    document.cookie=name + "=" + value + "; path=/; expires=" + expiry.toGMTString();
  }