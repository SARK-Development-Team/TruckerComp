// ---- Initial Settings ---- //

// This section handles changing the carousel's active slide
let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
const digits = document.querySelector(".digits").children;

initializeCarousel();

// Sets all formData to initial values 
// Arranges slides so that all but the first start off screen on the right
function initializeCarousel() {

    // Tabbing through the carousel breaks it, so this makes the carousel items untabbable
    let carouselContents = document.getElementById("carousel").querySelectorAll("*");
    for (let i =0; i<carouselContents.length; i++){
        carouselContents[i].setAttribute("tabindex", "-1");
        
    }
    // Resets the formData
    formData = {
        // employees: [],
        totalPayroll: 0,
        businessType: 0,
        zipCode: 0,
        mileage: 0,
        email: ''
    }
    // Resets the DOT digits
    for (let i=0; i<digits.length; i++) {
        digits[i].value='';
    }

    document.getElementById("slide1").classList.remove('move-right');
    document.getElementById("slide1").classList.add('in-place');
    document.getElementById("slide2").classList.remove('move-right');
    document.getElementById("slide2").classList.add('in-place');
    document.getElementById("intro-image").classList.remove('move-left');
    document.getElementById("intro-image").classList.add('present');
    document.getElementById('searchResult').style.display="none";
    for (let i = 0; i < slides.length; i++) {
        let multiplier = i*100;
        slides[i].style.transform= "translateX(" + multiplier +"vw)";  
    }
}

// ---- General Functionality ---- //

// When the slides advance, the next slide moves in from the right and the old moves out to the left
function changeSlide(n) {
    for (let i = 0; i < slides.length; i++) {
        let value = slides[i].style.transform;
        let numValue = parseInt(value.replace("translateX(", "").replace("vw",""));
        if (n<0) {
            numValue+=200;
        } else if (n>0) {
            numValue-=200;
        }
        let newValue = "translateX(" + numValue.toString() +"vw)";
        slides[i].style.transform= newValue;  
    }
}


// ---- Slide 1 ---- //

const towing = document.getElementById('slide1Towing');
const sand = document.getElementById('slide1Sand');
const longhaul = document.getElementById('slide1LongHaul');
const local = document.getElementById('slide1Local');

function moveSlide1() {
    document.getElementById('slide1').classList.add('move-right');
    document.getElementById('slide1').classList.remove('in-place');
}

towing.addEventListener("click", () => {
    formData.businessType=1;
    moveSlide1();
});

sand.addEventListener("click", () => {
    formData.businessType=2;
    moveSlide1();
});

longhaul.addEventListener("click", () => {
    formData.businessType=3;
    moveSlide1();
});

local.addEventListener("click", () => {
    formData.businessType=4;
    moveSlide1();
    document.getElementById('slide2').classList.add('move-right');
    document.getElementById('slide2').classList.remove('in-place');
    openSlides();
});

// ---- Slide 2 ---- //

function openSlides() {
    document.getElementById('intro-image').classList.remove('present');
    document.getElementById('intro-image').classList.add('move-left');
    document.getElementById('slide2').classList.remove('in-place');
    document.getElementById('slide2').classList.add('move-right');
}

const lowMileage = document.getElementById('slide2Low');
const mediumMileage = document.getElementById('slide2Medium');
const highMileage = document.getElementById('slide2High');

lowMileage.addEventListener("click", () => {
    formData.mileage=1;
    openSlides()
});

mediumMileage.addEventListener("click", () => {
    formData.mileage=2;
    openSlides()
});
highMileage.addEventListener("click", () => {
    formData.mileage=3;
    openSlides()
});


function allowProgress(slideIndex) {
        document.getElementById('searchResult').style.display="none";
        changeSlide(1);
}

// ---- Slide 3 ---- //

for (let i=1; i<digits.length; i++) {
    digits[i].addEventListener('keydown', (e) => {
        document.getElementById('DOTError').style.visibility="hidden";
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
const searchResultBody = `            
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <p>Based on the DOT you entered, this is what we found...</p>
            </div>
            <div class="modal-body">
                <div class="modal-left">
                    <h4 id="companyName"></h4>
                    <h5 id="DBA"></h5>
                    <div id="manualInput">
                        <div id="manualInputForm">
                            <p class="blueText">DOT:  <span id="DOT"></span></p>
                            <fieldset>
                                <label for="address">Address</label>
                                <input class="modal-input" id="address" name="address" type="text">
                            </fieldset>
                            <fieldset>
                                <label for="mailingAddress">Mailing Address</label>
                                <input class="modal-input" id="mailingAddress" name="mailingAddress" type="text" >
                            </fieldset>
                            <fieldset>
                                <label for="phone">Phone Number</label>
                                <input class="modal-input" id="phone" name="phone" type="tel" >
                            </fieldset>
                            <fieldset>
                                <label for="email">Email</label>
                                <input class="modal-input" id="email" name="email" type="email" >
                            </fieldset>
                        </div>
                    </div>
                </div>  
                <div style ="background: var(--light);">
                    <div class="modal-right">
                        <p class="blueText">Vehicle Miles Traveled</p>
                        <p id="milesTraveled"></p>
                        <p class="blueText">Carrier Operation</p>
                        <p id="carrierOperation"></p>
                        <p class="blueText">Trucks</p>
                        <p id="powerUnits"></p>
                        <p class="blueText">Drivers</p>
                        <p id="drivers"></p>
                        <p class="blueText">Operation Type</p>
                        <p id="operationType"></p>
                        <p class="blueText">Cargo Carried</p>
                        <p id="cargoCarried"></p>
                    </div>
                    <div class="btn-next" onclick="allowProgress(3)">Continue ></div>

                </div>

            </div>

        </div>
    </div>
`


// When the button for the DOT search field is pressed
async function searchDOT(e) {
    e.preventDefault();
    document.getElementById('searchResult').innerHTML='';
    let dotvalue = parseInt(document.getElementById('slide3DOT').value);
    let dot = {'dot': dotvalue};
    // Only searches if a value is entered
    if (dot['dot']) {
        try {
            const client = await fetchDOT(dot);

            // If a client is not found
            if (!client.result) {
                document.getElementById('DOTError').innerText=`No result found for ${dot['dot']}.`;
                document.getElementById('DOTError').style.visibility="visible";
            // If a client is found
            } else {
                document.getElementById('searchResult').innerHTML=searchResultBody;
                document.getElementById('searchResult').style.display="block";
                const zipCodePattern = /\d{5}/;
                formData.zipCode = client.result['Address'].match(zipCodePattern)[0];
                // document.getElementById('DOTError').style.visibility="hidden";
                document.getElementById('DOT').innerText = client.result['DOT Number'];
                document.getElementById('companyName').innerText = client.result['Company Name'];
                document.getElementById('slide5Name').innerText = client.result['Company Name'];
                document.getElementById('email').value = client.result['Email'];
                document.getElementById('slide5Email').value = client.result['Email'];
                document.getElementById('address').value = client.result['Address'];
                document.getElementById('mailingAddress').value = client.result['Mailing Address'];
                document.getElementById('phone').value = client.result['Phone'];
                document.getElementById('powerUnits').innerText = client.result['Power Units'];
                document.getElementById('drivers').innerText = client.result['Drivers'];
                document.getElementById('empNumber0').value = client.result['Drivers'];
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

addPayrollUpdate();
addTotalUpdate();

function addPayrollUpdate() {
    formData.totalPayroll = 0;
    var payrollValue =0;
    for (let i =0; i<formlines.length; i++) {
        document.getElementById(`empTotal${i}`).addEventListener("change", (e) => {
            document.getElementById(`empPayroll${i}`).value =  parseInt(e.target.value)/ parseInt(document.getElementById(`empNumber${i}`).value);            
        });
        payrollValue+=parseInt(document.getElementById(`empTotal${i}`).value);
        console.log("payrollValue is ", formData.totalPayroll); 
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
        console.log("-->payrollValue is ", formData.totalPayroll); 
    }
    formData.totalPayroll=payrollValue;
    document.getElementById('totalPayroll').innerText = formData.totalPayroll
}



function saveEmployeeData() {
    // formData.employees = [];
    // formData.totalPayroll = 0;
    // let formlines = document.getElementsByClassName('formline');
    try {
        // for (let i=0; i<formlines.length; i++) {
        //     let type = document.getElementById('empType'+i).value;
        //     let number = document.getElementById('empNumber'+i).value;
        //     let payroll = document.getElementById('empPayroll'+i).value;
        //     let totalpr = document.getElementById('empTotal'+i).value;
        //     if (type && number && payroll) {
                // formData.employees.push({'type': type, 'number': number, 'payroll': payroll});
            //     formData.totalPayroll+=parseInt(totalpr);
            // }
            
        // }
        if (formData.totalPayroll) {
            fillInfo(formData);
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