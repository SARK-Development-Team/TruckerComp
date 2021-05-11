// ---- Initial Settings ---- //

// This section handles changing the form's active slide
let slideIndex;
const slides = document.getElementsByClassName("slide");
const digits = document.querySelector(".digits").children;
// const digits = Array.from(document.querySelectorAll(".digit"));

initializeForm();

// Sets all formData to initial values 
// Arranges slides so that all but the first start off screen on the right
// This function is also called when the reset button is pressed
function initializeForm() {

    // Tabbing through the form breaks it, so this makes the form items untabbable
    let formContents = document.getElementById("hero").querySelectorAll("*");
    for (let i =0; i<formContents.length; i++){
        formContents[i].setAttribute("tabindex", "-1");      
    }
    // Resets the current slide displayed in the carousel
    // It starts at 3 because slides 1 and 2 are outside of the carousel
    slideIndex = 3;
    // Resets the formData
    formData = {
        totalPayroll: 0,
        businessType: 0,
        zipCode: 0,
        mileage: 0,
        email: '',
        DOT: '',
        companyName: '',
        DBA: '',
        address: '',
        mailingAddress: '',
        phone: '',
        powerUnits: '',
        drivers: '',
        carrierOperation: '',
        operationType: [],
        cargoCarried: [],
    }
    // Resets the DOT digits input area on slide 3
    for (let i=0; i<digits.length; i++) {
        digits[i].value='';
    }
    document.getElementById("hero").classList.remove('tall');
    document.getElementById("hero").classList.remove('taller');

    // Places the slides correctly and removes any classes 
    document.getElementById("intro-image").classList.remove('move-left');
    document.getElementById("intro-image").classList.add('visible');
    
    document.getElementById("slide1").classList.remove('move-right');
    document.getElementById("slide1").classList.add('visible');

    document.getElementById("slide2").classList.remove('move-right');
    document.getElementById("slide2").classList.add('visible');

    document.getElementById("slide3").classList.add("visible");
    document.querySelector(".slide-area").style.opacity=0;
    document.getElementById("slide3").classList.remove("move-left");
    document.getElementById("searchResult").classList.add("expandable-collapsed");
    
    document.getElementById("slide4").classList.remove("move-left");
    document.getElementById("slide4").classList.add("move-right");
    document.getElementById("slide4").classList.remove("visible");

    document.getElementById("slide5").classList.add("move-right");
    document.getElementById("slide5").classList.remove("visible");
}

// ---- General Functionality ---- //

// When the slides advance, the next slide moves in from the right and the old moves out to the left
function changeSlide(n) {
    // hide the search result
    document.getElementById("searchResult").classList.add("expandable-collapsed");
    useInitialPageHeight();
    window.scrollTo(0,0);
    // When the back button is pressed, the parameter is -1
    if (n<0) {
        moveSlideRight(slideIndex);
        moveSlideIn(slideIndex-1);
        slideIndex-=1;
    // When the continue button is pressed, the parameter is 1
    } else if (n>0) {
        moveSlideLeft(slideIndex);
        moveSlideIn(slideIndex+1);
        slideIndex+=1;
    }
}

// moving a slide in the carousel off the left side of the screen
function moveSlideLeft(n) {
    document.getElementById(`slide${n}`).classList.add("move-left");
    document.getElementById(`slide${n}`).classList.remove("visible");
}

// moving a slide in the carousel off the right side of the screen
function moveSlideRight(n) {
    document.getElementById(`slide${n}`).classList.add("move-right");
    document.getElementById(`slide${n}`).classList.remove("visible");
}

// moving a slide in the right margin into view
function moveSlideIn(n) {
    document.getElementById(`slide${n}`).classList.remove("move-right");
    document.getElementById(`slide${n}`).classList.remove("move-left");
    document.getElementById(`slide${n}`).classList.add("in-view");
}


// ---- Slide 1 ---- //

const towing = document.getElementById('slide1Towing');
const sand = document.getElementById('slide1Sand');
const longhaul = document.getElementById('slide1LongHaul');
const local = document.getElementById('slide1Local');

function moveSlide(number) {
    document.getElementById(`slide${number}`).classList.add('move-right');
    document.getElementById(`slide${number}`).classList.remove('visible');
}

towing.addEventListener("click", () => {
    formData.businessType=1;
    moveSlide(1);
});

sand.addEventListener("click", () => {
    formData.businessType=2;
    moveSlide(1);
});

longhaul.addEventListener("click", () => {
    formData.businessType=3;
    moveSlide(1);
});

// Choosing local skips slide 2
local.addEventListener("click", () => {
    formData.businessType=4;
    moveSlide(1);
    moveSlide(2);
    removeIntroImage();
});

// ---- Slide 2 ---- //

function removeIntroImage() {
    document.getElementById('intro-image').classList.remove('visible');
    document.getElementById('intro-image').classList.add('move-left');
    document.querySelector('.slide-area').style.opacity=1;
}

const lowMileage = document.getElementById('slide2Low');
const mediumMileage = document.getElementById('slide2Medium');
const highMileage = document.getElementById('slide2High');

lowMileage.addEventListener("click", () => {
    formData.mileage=1;
    moveSlide(2);
    removeIntroImage();
});

mediumMileage.addEventListener("click", () => {
    formData.mileage=2;
    moveSlide(2);
    removeIntroImage();
});
highMileage.addEventListener("click", () => {
    formData.mileage=3;
    moveSlide(2);
    removeIntroImage();
});

// ---- Slide 3 ---- //

// This function allows the user to backspace through the 7 separate fields
for (let i=1; i<digits.length; i++) {
    digits[i].addEventListener('keydown', (e) => {
        if (e.key=="Backspace") {
            e.target.previousElementSibling.focus();
        }
    })

}

function expandPageHeight() {
    document.getElementById("hero").classList.add('taller');
}

function useInitialPageHeight() {
    document.getElementById("hero").classList.remove('taller');
}

// This is the function that allows the DOT input to come together from the 7 separate fields
document.querySelector(".digits").addEventListener("input", (e) => {
    try {
        e.target.value = e.data.replace(/[^0-9]/g,'');
    } catch(err) {
        console.log(err);
    }
    if ( e.target.value !== "" && e.target.nextElementSibling && e.target.nextElementSibling.nodeName === "INPUT" ){
      e.target.nextElementSibling.focus();
    } 
    if (!e.target.nextElementSibling) {
        var total = '';
        for (let i=0; i<digits.length; i++) {
            total+=digits[i].value;
        }
        document.getElementById('slide3DOT').value= total;
        searchDOT(event);
    }
});


// Parses the individual digits into the individual boxes when a value is pasted into any of the input boxes.
function pasteValues(e) {
    e.stopPropagation();
    e.preventDefault();
    try {
        const values = e.clipboardData.getData("text").split("");
        for (i=0; i<values.length-1; i++) {
            let inputBox = document.querySelectorAll('.digit')[i]

            inputBox.value= values[parseInt(i)];
        };
        // When a value longer than 7 digits is pasted, the first 7 digits are kept and the rest discarded
        if (values.length >= 7) {

            var total = '';
            for (let i=0; i<digits.length; i++) {
                total+=digits[i].value;
            }
            document.getElementById('slide3DOT').value= parseInt(total);
            if (total.length=7) {
                searchDOT(event);
            }
        }
    } catch(err) {
        console.log(err);
    }

}

// One of these two is inserted in the result header when a DOT search is performed
const successHeader = `<p><span>Found record for DOT </span><span id="DOT-success-header"></span></p>`
const failureHeader = `
    <p><span>No record found for DOT </span><span id="DOT-failure-header"></span></p>
    <p>Please enter the information below</p>
`

// This clears the DOT input fields
function clearDOT() {
    document.getElementById("searchResult").classList.add("expandable-collapsed")
    for (let i=0; i<digits.length; i++) {
        digits[i].value = '';
    }
}


// This assures that all fields in the form (after the DOT entry fields) are returned to initial conditions
function clearAllFields() {
    document.getElementById('companyName').innerText = '' ;
    document.getElementById('DBA').innerText = '';
    document.getElementById('slide5Name').innerText = '';
    document.getElementById('email').value = '';
    document.getElementById('slide5Email').value = '';
    document.getElementById('address').value = '';
    document.getElementById('mailingAddress').value = '';
    document.getElementById('milesTraveled').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('powerUnits').value = '';
    document.getElementById('drivers').value = '';
    document.getElementById('carrierOperation').value = '';
    // Clears out the drop-down menus
    const operationTypeChoices = Array.from(document.querySelectorAll('.drop-options')[0].childNodes[0].childNodes);
    const cargoCarriedChoices = Array.from(document.querySelectorAll('.drop-options')[1].childNodes[0].childNodes);
    for (const el of operationTypeChoices) {
        opTypeDrop.removeOption(event, el)
    }                 
    for (const el of cargoCarriedChoices) {
        cargoDrop.removeOption(event, el)
    }       
    document.getElementById('empAmount1').value = 0;
    document.getElementById('q0').innerText = '';
    document.getElementById('q1').innerText = '';
    document.getElementById('q2').innerText = '';
    document.getElementById('q3').innerText = '';
    document.getElementById('q4').innerText = '';
    document.getElementById('low-end').innerText = '';
    document.getElementById('high-end').innerText = '';
}


// When the button for the DOT search field is pressed
async function searchDOT(e) {
    e.preventDefault();
    clearAllFields();
    document.getElementById('searchResult').classList.add("expandable-collapsed");
    const loadIcon = document.getElementById('loading-icon');
    let dotvalue = parseInt(document.getElementById('slide3DOT').value);
    let dot = {'dot': dotvalue};
    // Only searches if a value is entered
    if (dot['dot']) {
        try {
            loadIcon.style.display = "block";
            const client = await fetchDOT(dot);
            document.getElementById('DOT').innerText = parseInt(document.getElementById('slide3DOT').value);
            expandPageHeight();
            // If a client is not found
            if (!client.result.name) {
                loadIcon.style.display = "none";
                document.getElementById('DOT-check-icon').style.display="none";
                document.getElementById('DOT-wrong-icon').style.display="block";
                document.getElementById('result-header').innerHTML= failureHeader;
                document.getElementById('DOT-failure-header').innerText = dot['dot'];
                document.getElementById('searchResult').classList.remove("expandable-collapsed");
            // If a client is found
            } else {
                console.log("success--> client: ", client.result)
                loadIcon.style.display = "none";
                document.getElementById('DOT-check-icon').style.display="block";
                document.getElementById('DOT-wrong-icon').style.display="none";
                document.getElementById('result-header').innerHTML= successHeader;
                document.getElementById('DOT-success-header').innerText = dot['dot'];
                document.getElementById('searchResult').classList.remove("expandable-collapsed");
                // If an address is returned, pull the zipcode out of it and add it to the form data
                if (client.result['address']) { 
                    const zipCodePattern = /\d{5}/;
                    formData.zipCode = client.result['address'].match(zipCodePattern)[0];
                }
                // If a DBA name is returned, add a section that displays it
                if (client.result['DBA']) {
                    document.getElementById('DBA').innerText = "DBA";
                    document.getElementById('DBAfield').value = client.result['DBA'];
                    document.getElementById('DBAfield').style.visibility = "visible";
                } else {
                    document.getElementById('DBA').innerText = "";
                    document.getElementById('DBAfield').style.visibility = "hidden";
                }
                document.getElementById('companyName').innerText = client.result['name'] ?? '' ;
                document.getElementById('slide5Name').innerText = client.result['name'] ?? '';
                document.getElementById('email').value = client.result['email'] ?? '';
                document.getElementById('address').value = client.result['address'] ?? '';
                document.getElementById('milesTraveled').value = client.result['milesTraveled'] ?? '';
                // document.getElementById('mailingAddress').value = client.result['Mailing Address'];
                document.getElementById('phone').value = client.result['phone'] ?? '';
                document.getElementById('powerUnits').value = client.result['powerUnits'] ?? '';
                document.getElementById('drivers').value = client.result['drivers'] ?? '';
                const operationTypeChoices = document.querySelectorAll('.drop-options')[0].childNodes[0].childNodes;
                const cargoCarriedChoices = document.querySelectorAll('.drop-options')[1].childNodes[0].childNodes;
                const opClasses = client.result.opClass;
                const cargo = client.result.cargo;
                for (const el of opClasses) {
                    for (const a of operationTypeChoices) {
                        if (a.textContent.toUpperCase()==el) {
                            opTypeDrop.addOption(event, a)
                        }
                    }
                }                 
                for (const el of cargo) {
                    for (const a of cargoCarriedChoices) {
                        if (a.textContent.toUpperCase()==el) {
                            cargoDrop.addOption(event, a)
                        }
                    }
                }                 
            }
        } catch (err) {
            console.log(err);
        }           
    }
}

document.getElementById('milesTraveled').addEventListener('keydown', (e) => {
    // If the input for Vehicle Miles Traveled is manually changed, save it to the formData
    const formMileage = document.getElementById('milesTraveled').value
    if (formMileage < 200) {
        formData.mileage = 1;
    } else if (formMileage > 500) {
        formData.mileage = 3;
    } else {
        formData.mileage = 2;
    }
});

// This function saves the client data into the formData object when the users progresses from the dotslide to the payrollslide
function saveClientData() {
    // If an email address is given on the DOT slide, save it in the formData and add it to the input on slide 5
    formData.DOT=document.getElementById('slide3DOT').value;
    formData.email = document.getElementById('email').value;
    formData.phone=document.getElementById('phone').value;
    formData.address=document.getElementById('address').value;
    formData.mailingAddress=document.getElementById('mailingAddress').value;
    formData.powerUnits=document.getElementById('powerUnits').value;
    formData.drivers=document.getElementById('drivers').value;
    formData.carrierOperation=document.getElementById('carrierOperation').value;

    // These lines establish the contents of the dropdown boxes 
    const operationTypeChoices = Array.from(document.querySelectorAll('.drop-display')[0].childNodes[0].childNodes);
    const cargoCarriedChoices = Array.from(document.querySelectorAll('.drop-display')[1].childNodes[0].childNodes);

    // These lines save their contents into the formData as arrays
    for (let i=0; i<operationTypeChoices.length; i++) {
        formData.operationType.push(operationTypeChoices[i].innerText.slice(0, -2));
    }
    for (let j=0; j<cargoCarriedChoices.length; j++) {
        formData.cargoCarried.push(cargoCarriedChoices[j].innerText.slice(0, -2));
    }
    document.getElementById('empAmount1').value = document.getElementById('drivers').value;

    document.getElementById('slide5Email').value = formData.email;
    testEmail();
    // } 
    changeSlide(1);
}

// This function makes the API call to the server, searching for the DOT number in the FMCSA website and returning one client that matches that number 
async function fetchDOT(dotObject) {
    // const uri = uriRoot+'dot';

    const result = fetch('/dot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dotObject)
    }).then(response => response.json()).catch(err=>console.log(err));
    return result;
}

// ---- Slide 4 ---- //

function savePayrollData() {
    addPayrollUpdate();
    addTotalUpdate();
    try {
        if (formData.totalPayroll) {
            fillInfo(formData);
            requestQuoteSlide(formData)
            changeSlide(1);
        }
        document.getElementById('hero').classList.add('tall');
    } catch(err) {
        console.log(err);
    }
}

function addPayrollUpdate() {
    formData.totalPayroll=0;
    var payrollValue=0;
    const payrollLines = document.getElementsByClassName('remove-type').length;
    for (let i =0; i<payrollLines; i++) {
        document.getElementById(`empTotal${i+1}`).addEventListener("change", (e) => {
            document.getElementById(`empSalary${i+1}`).value =  parseInt(e.target.value)/ parseInt(document.getElementById(`empAmount${i+1}`).value);            
        });
        payrollValue+=parseInt(document.getElementById(`empTotal${i+1}`).value);

    }
    formData.totalPayroll=payrollValue;
    document.getElementById('total-payroll').innerText = formData.totalPayroll
}

function addTotalUpdate() {
    formData.totalPayroll=0;
    var payrollValue=0;
    const payrollLines = document.getElementsByClassName('remove-type').length;
    for (let i =0; i<payrollLines; i++) {
        document.getElementById(`empSalary${i+1}`).addEventListener("change", (e) => {  
            document.getElementById(`empTotal${i+1}`).value =  parseInt(e.target.value) * parseInt(document.getElementById(`empAmount${i+1}`).value);            
        });

        payrollValue+=parseInt(document.getElementById(`empTotal${i+1}`).value);
    }
    formData.totalPayroll=payrollValue;
    document.getElementById('total-payroll').innerText = formData.totalPayroll
}

// This sends the data to the backend and returns with a number for the quote
function fetchResult(data) {

    const result = fetch('/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());

    let number = result;
    return number;
}

function removeLine(e, number) {
    e.preventDefault();
    document.getElementById(`removeLine${number}`).style.display="none";
    document.getElementById(`empType${number}`).style.display="none";
    document.getElementById(`empAmount${number}`).style.display="none";
    document.getElementById(`empSalary${number}`).style.display="none";
    document.getElementById(`empTotal${number}`).style.display="none";
    document.getElementById(`empType${number}`).value="Other";
    document.getElementById(`empAmount${number}`).value=0.000001;
    document.getElementById(`empSalary${number}`).value=0.000001;
    document.getElementById(`empTotal${number}`).value=0.000001;
}

// This function adds another row to the employee info table only when the most recent line is completely filled in
function addRow(e) {
    e.preventDefault();
    const payrollLines = document.getElementsByClassName('remove-type').length;
    const lastLine = Array.from(document.getElementsByClassName(`table-field row${payrollLines}`));
    if (lastLine.every((e) => e.value)) {
        const line = `
            <img src="public/images/wrong.svg" loading="lazy" onclick="removeLine(event, ${payrollLines+1})"
            alt="" class="remove-type row${payrollLines+1}" id="removeLine${payrollLines+1}" >
            <select class="table-field row${payrollLines+1} colType" id="empType${payrollLines+1}">
                <option value="" disabled selected>Employee Type</option>
                <option value="Driver" >Driver</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Accounting">Accounting</option>
                <option value="Custodial">Custodial</option>
                <option value="Clerical">Clerical</option>
                <option value="Other">Other</option>
            </select>
            <input type="number" class="table-field row${payrollLines+1} colAmount" id="empAmount${payrollLines+1}" value=0 onfocusout="addPayrollUpdate()"></input>
            <input type="number" class="table-field row${payrollLines+1} colSalary" id="empSalary${payrollLines+1}" value=0 onfocusout="addPayrollUpdate()"></input>
            `
        const totalBox = `
            <input type="number" class="table-field total" id="empTotal${payrollLines+1}" value=0 onfocusout="addTotalUpdate()"></input>
        `
        document.getElementById("payroll-columns").insertAdjacentHTML('beforeend', line);
        document.getElementById("total-column").insertAdjacentHTML('beforeend', totalBox);
    }
    else {
        lastLine.every((e) => console.log("e= ", e, " evalue= ", e.value))
    }
    // addPayrollUpdate();
    // addTotalUpdate();
}

// ---- Slide 5 ---- //


// Fills in the data area on slide 5 for confirmation
function fillInfo(data) {

    const q0 = document.getElementById('q0');
    const q1 = document.getElementById('q1');
    const q2 = document.getElementById('q2');
    const q3 = document.getElementById('q3');
    const q4 = document.getElementById('q4');
    
    q0.innerText = parseInt(document.getElementById('slide3DOT').value);
    switch (data.businessType) {
        case 1:
            q1.innerText='Long-Haul Trucking';
            break;
        case 2:
            q1.innerText='Sand & Gravel Trucking';
            break;
        case 3:
            q1.innerText='Local Trucking';
            break;
        case 4:
            q1.innerText='Towing Services';
            break;
        default:
            q1.innerText='Error';
            break;
    }

    switch (data.mileage) {
        case 0:
            q2.innerText='Not provided';
            break;
        case 1:
            q2.innerText='< 200 miles';
            break;
        case 2:
            q2.innerText='200 - 500 miles';
            break;
        case 3:
            q2.innerText='> 500 miles';
            break;
        default:
            q2.innerText='Error';
            break;
    }
    if (formData.zipcode) {
        q3.innerText=data.zipCode;
    } else {
        q3.innerText='Not provided';
    }

    q4.innerText=data.totalPayroll;
}

const email = document.getElementById('slide5Email');

function testEmail() {
    const input = email.value;
    const submit = document.getElementById('submit');
    // this regex tests for an email address
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const emailError = document.getElementById('emailError');
    emailError.style.visibility = 'hidden';
    if (input!='' && regex.test(input)) {
        submit.classList.remove('disabled');
        submit.onclick=function() {
            // this function sends the email
            sendQuote(formData);
            purchasePolicy(formData);
            setCookie('clientData', JSON.stringify(formData));
        };
    } else {
        submit.classList.add('disabled');
        emailError.style.visibility = 'visible';
    }
}

email.addEventListener('keyup', () => {
    testEmail();
});

function purchasePolicy(data) {
    fetch('/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
}


function sendQuote (data) {
    // const uri = uriRoot+'send';

    fetch('/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
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

// This saves the formData as a cookie in the browser
function setCookie(name, value) {
    const today = new Date();
    const expiry = new Date(today.getTime() + 24 * 3600000); // saves cookie for 24 hours
    document.cookie=name + "=" + value + "; path=/; expires=" + expiry.toGMTString();
  }

// On page load //

addPayrollUpdate();
addTotalUpdate();