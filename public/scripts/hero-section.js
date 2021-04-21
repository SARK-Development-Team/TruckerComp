// ---- Initial Settings ---- //

// This section handles changing the form's active slide
let slideIndex;
const slides = document.getElementsByClassName("slide");
const digits = document.querySelector(".digits").children;

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
        email: ''
    }
    // Resets the DOT digits input area on slide 3
    for (let i=0; i<digits.length; i++) {
        digits[i].value='';
    }
    // Places the slides correctly and removes any classes 
    document.getElementById("intro-image").classList.remove('move-left');
    document.getElementById("intro-image").classList.add('visible');
    
    document.getElementById("slide1").classList.remove('move-right');
    document.getElementById("slide1").classList.add('visible');

    document.getElementById("slide2").classList.remove('move-right');
    document.getElementById("slide2").classList.add('visible');

    // document.getElementById("hero").style.minHeight="500px";

    document.getElementById("slide3").classList.add("visible");
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


function allowProgress(slideIndex) {
        document.getElementById('searchResult').classList.add("expandable-collapsed");
        document.getElementById("hero").style.minHeight="500px";
        changeSlide(1);
}

// ---- Slide 3 ---- //

for (let i=1; i<digits.length; i++) {
    digits[i].addEventListener('keydown', (e) => {
        // document.getElementById('DOTError').style.visibility="hidden";
        if (e.key=="Backspace") {
            e.target.previousElementSibling.focus();
        }
    })

}

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

const successHeader = `<p><i class="fas fa-check-circle" style="color: green"></i><span>Found record for DOT </span><span id="DOT-success-header"></span></p>`
const failureHeader = `
    <p><i class="fas fa-times-circle" style="color: red"></i><span>No record found for DOT </span><span id="DOT-failure-header"></span></p>
    <p>Please enter the information below</p>
`

// When the button for the DOT search field is pressed
async function searchDOT(e) {
    e.preventDefault();
    document.getElementById('searchResult').classList.add("expandable-collapsed");
    const loadIcon = document.getElementById('loading-icon');
    let dotvalue = parseInt(document.getElementById('slide3DOT').value);
    let dot = {'dot': dotvalue};
    // Only searches if a value is entered
    if (dot['dot']) {
        try {
            loadIcon.style.display = "block";
            const client = await fetchDOT(dot);

            // If a client is not found
            if (Object.keys(client.result).length === 0) {
            // if (client.result =={}) {
                // document.getElementById('DOTError').innerText=`No result found for ${dot['dot']}.`;
                // document.getElementById('DOTError').style.visibility="visible";
                loadIcon.style.display = "none";
                document.getElementById('result-header').innerHTML= failureHeader;
                document.getElementById('DOT-failure-header').innerText = dot['dot']
                document.getElementById('searchResult').classList.remove("expandable-collapsed");
                console.log("failure client: ", client.result)
                // If a client is found
            } else {
                console.log("success client: ", client.result)
                loadIcon.style.display = "none";
                document.getElementById('result-header').innerHTML= successHeader;
                document.getElementById('DOT-success-header').innerText = dot['dot']
                document.getElementById('searchResult').classList.remove("expandable-collapsed");

                // document.getElementById('searchResult').style.display="block";
                document.getElementById("hero").style.minHeight="1000px";

                const zipCodePattern = /\d{5}/;
                formData.zipCode = client.result['address'].match(zipCodePattern)[0];
                // document.getElementById('DOTError').style.visibility="hidden";
                if (client.result['DBA']) {
                    document.getElementById('DBA').innerText = "DBA: "+ client.result['DBA'];
                }
                document.getElementById('DOT').innerText = client.result['DOT'];
                document.getElementById('companyName').innerText = client.result['name'];
                document.getElementById('slide5Name').innerText = client.result['name'];
                document.getElementById('email').value = client.result['email'];
                document.getElementById('slide5Email').value = client.result['email'];
                document.getElementById('address').value = client.result['address'];
                document.getElementById('carrierOperation').innerText = client.result['carrierOperation'];
                document.getElementById('milesTraveled').innerText = client.result['milesTraveled'];
                // document.getElementById('mailingAddress').value = client.result['Mailing Address'];
                document.getElementById('phone').value = client.result['phone'];
                document.getElementById('powerUnits').innerText = client.result['powerUnits'];
                document.getElementById('drivers').innerText = client.result['drivers'];
                document.getElementById('empNumber0').value = client.result['drivers'];
            }
        } catch (err) {
            console.log(err);
        }           
    }
}

// This function makes the API call to the server, searching for the DOT number in the sark_client DB and returning one client that matches that number 
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

let formlines = document.getElementsByClassName('formline');



function addPayrollUpdate() {
    formData.totalPayroll = 0;
    var payrollValue =0;
    for (let i =0; i<formlines.length; i++) {
        document.getElementById(`empTotal${i}`).addEventListener("change", (e) => {
            document.getElementById(`empPayroll${i}`).value =  parseInt(e.target.value)/ parseInt(document.getElementById(`empNumber${i}`).value);            
        });
        payrollValue+=parseInt(document.getElementById(`empTotal${i}`).value);
    }
    formData.totalPayroll=payrollValue;
    document.getElementById('totalPayroll').innerText = formData.totalPayroll
}

function addTotalUpdate() {
    formData.totalPayroll = 0;
    var payrollValue =0;
    for (let i =0; i<formlines.length; i++) {
        document.getElementById(`empPayroll${i}`).addEventListener("change", (e) => {  
            document.getElementById(`empTotal${i}`).value =  parseInt(e.target.value) * parseInt(document.getElementById(`empNumber${i}`).value);            
        });
        payrollValue+=parseInt(document.getElementById(`empTotal${i}`).value);
    }
    formData.totalPayroll=payrollValue;
    document.getElementById('totalPayroll').innerText = formData.totalPayroll
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

function saveEmployeeData() {

    try {

        if (formData.totalPayroll) {
            fillInfo(formData);
            requestQuoteSlide(formData)
            changeSlide(1);
        }
    } catch(err) {
        console.log(err);
    }
}

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
        <input class="empNumber" name="empNumber${formlines}" type="number" min="1" id="empNumber${formlines}" value=1>
        <input class="empPayroll" name="empPayroll${formlines}" type="number" min="1" id="empPayroll${formlines}" value=50000>
        <span>|</span>
        <input class="empTotal" name="empTotal${formlines}" type="number" min="1" id="empTotal${formlines}" value=50000>

    </p>

    `

    let lineElement = document.createElement('div');
    lineElement.innerHTML=line;
    document.getElementById("employeeInfoTable").appendChild(lineElement);
    addPayrollUpdate();
    addTotalUpdate();
}

// ---- Slide 5 ---- //


// Fills in the data area on slide 5 for confirmation
function fillInfo(data) {

    const q0 = document.getElementById('q0');
    const q1 = document.getElementById('q1');
    const q2 = document.getElementById('q2');
    const q3 = document.getElementById('q3');
    const q4 = document.getElementById('q4');
    
    q0.innerText = document.getElementById('DOT').innerText;
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

    q3.innerText=data.zipCode;

    q4.innerText=data.totalPayroll;
}

const email = document.getElementById('slide5Email');

email.addEventListener('keyup', () => {

    const input = email.value;
    const submit = document.getElementById('submit');
    // this regex tests for an email address
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const emailError = document.getElementById('emailError');
    if (input!='' && regex.test(input)) {
        formData.email = input;
        // setCookie('clientData', JSON.stringify(formData));
        emailError.style.visibility = 'hidden';
        submit.style.background='#EF8354';
        submit.style.cursor='pointer';
        submit.onclick=function() {
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

// On page load //

addPayrollUpdate();
addTotalUpdate();