// ---- Initial Settings ---- //

// This section handles changing the carousel's active slide
let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
initializeCarousel();

// Sets all formData to initial values 
// Arranges slides so that all but the first start off screen on the right
function initializeCarousel() {

    // Tabbing through the carousel breaks it, so this makes the carousel items untabbable
    let carouselContents = document.getElementById("carousel").querySelectorAll("*");
    for (let i =0; i<carouselContents.length; i++){
        carouselContents[i].setAttribute("tabindex", "-1");
        
    }
    formData = {
        // employees: [],
        totalPayroll: 0,
        businessType: 0,
        zipCode: 0,
        mileage: 0,
        email: ''
    }
    document.getElementById("slide1").style.left="36vw";
    document.getElementById("intro-image").style.left="0vw";
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



const towing = $('#slide1Towing');
const sand = $('#slide1Sand');
const longhaul = $('#slide1LongHaul');
const local = $('#slide1Local');

towing.on("click", () => {
    formData.businessType=1;
    showSlide2();
    document.getElementById('slide1').style.left = "100vw";

});

sand.on("click", () => {
    formData.businessType=2;
    showSlide2();
    document.getElementById('slide1').style.left = "100vw";

});

longhaul.on("click", () => {
    formData.businessType=3;
    showSlide2();
    document.getElementById('slide1').style.left = "100vw";
    // openSlides();
});

local.on("click", () => {
    formData.businessType=4;
    hideSlide2();
    document.getElementById('slide1').style.left = "100vw";
    openSlides();
});


function showSlide2() {
    $('#slide2').css("display", "block");
    $('#slide3').css("transform", "translateX(0vw)")
    $('#slide4').css("transform", "translateX(100vw)")
    $('#slide5').css("transform", "translateX(200vw)")
}

function hideSlide2() {
    $('#slide2').css("display", "none");
    $('#slide3').css("transform", "translateX(0vw)")
    $('#slide4').css("transform", "translateX(100vw)")
    $('#slide5').css("transform", "translateX(200vw)")
}

// ---- Slide 2 ---- //

function openSlides() {
    document.getElementById('intro-image').style.left = "-100vw";
    document.getElementById('slide2').style.left = "100vw";
}

const lowMileage = $('#slide2Low');
const mediumMileage = $('#slide2Medium');
const highMileage = $('#slide2High');

lowMileage.on("click", () => {
    formData.mileage=1;
    openSlides()
});

mediumMileage.on("click", () => {
    formData.mileage=2;
    openSlides()
    // changeSlide(1)
});
highMileage.on("click", () => {
    formData.mileage=3;
    openSlides()
});


function allowProgress(slideIndex) {
    const next = document.getElementById('next' + slideIndex);
    next.style.opacity=1;
    next.style.cursor="pointer"
    next.onclick = () => {
        document.getElementById('searchResult').style.display="none";
        changeSlide(1);
    }
}

// If the conditions are no longer met, the button for the next slide is deactivated
function stopProgress(slideIndex) {
    const next = document.getElementById('next' + slideIndex);
    next.style.opacity=0;
    next.style.cursor=""
    next.onclick = '';
}


// document.getElementById("slide2Mileage").addEventListener("keydown", (e) => {
//     if(e.target.value!=0) {
//         formData.mileage=e.target.value;
//         allowProgress(2);
//     } else {
//         stopProgress(2)
//     }
// })

// ---- Slide 3 ---- //

const digits = document.querySelector(".digits").children;
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
        $('#slide3DOT').val(total);
        searchDOT(event);
        // $('#btn-search').css("display", "inline");
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
                            <p class="accentText">DOT:  <span id="DOT"></span></p>
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
                        </div>
                    </div>
                </div>  
                <div class="modal-right">
                    <p class="accentText">Vehicle Miles Traveled</p>
                    <p id="milesTraveled"></p>
                    <p class="accentText">Carrier Operation</p>
                    <p id="carrierOperation"></p>
                    <p class="accentText">Trucks</p>
                    <p id="powerUnits"></p>
                    <p class="accentText">Drivers</p>
                    <p id="drivers"></p>
                    <p class="accentText">Operation Type</p>
                    <p id="operationType"></p>
                    <p class="accentText">Cargo Carried</p>
                    <p id="cargoCarried"></p>

                </div>
                <div class="btn-next" onclick="">Continue ></div>

            </div>
            <div class="modal-footer">
                <p>Is this information correct?</p>
            </div>
        </div>
    </div>
`


// When the button for the DOT search field is pressed
async function searchDOT(e) {
    e.preventDefault();
    let dotvalue = parseInt(document.getElementById('slide3DOT').value);
    let dot = {'dot': dotvalue};
    // Only searches if a value is entered
    if (dot['dot']) {
        try {
            const client = await fetchDOT(dot);

            // If a client is not found
            if (!client.result) {
                // resultField.innerHTML = `<p>No result found for ${dot['dot']}.</p>`
                document.getElementById('DOTError').innerText=`No result found for ${dot['dot']}.`;
                document.getElementById('DOTError').style.visibility="visible";
            // If a client is found
            } else {
                // $('#slide3-modal').modal('show');
                document.getElementById('searchResult').innerHTML=searchResultBody;
                const zipCodePattern = /\d{5}/;
                formData.zipCode = client.result['Address'].match(zipCodePattern)[0];
                // document.getElementById('DOTError').style.visibility="hidden";
                document.getElementById('DOT').innerText = client.result['DOT Number'];
                document.getElementById('companyName').innerText = client.result['Company Name'];
                document.getElementById('slide5Name').innerText = client.result['Company Name'];
                // document.getElementById('MC').value = client.result['MCP Number'];
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

const inputFields = document.getElementsByClassName('modal-input');
for (let i = 0; i < inputFields.length; i++) {
    inputFields[i].addEventListener('change', () => {
        $('#btn-save').attr('value', 'Update');
    })
}

// This function will have more to do later (saving the lead)
function confirmModalInfo() {
    $('#slide3-modal').modal('hide');
    allowProgress(3);
}

function closeModal() {
    $('#slide3-modal').modal('hide');
    $('#slide5-modal').modal('hide');
}

// ---- Slide 4 ---- //

function saveEmployeeData() {
    formData.employees = [];
    formData.totalPayroll = 0;
    const formlines = document.getElementsByClassName('formline');
    try {
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
        <input class="empNumber" name="empNumber${formlines}" type="number" min="1" id="empNumber${formlines}" >
        <select class="empPayroll" id="empPayroll${formlines}" name="empPayroll${formlines}">
            <option value="" disabled selected>Please select</option>
            <option value="4.5">Less than $45,000</option>
            <option value="5.0">$45,001 ~ $55,000</option>
            <option value="6.0">$55,001 ~ $65,000</option>
            <option value="7.0">$65,001 ~ $75,000</option>
            <option value="8.0">$75,001 ~ 85,000</option>
            <option value="10">$85,001 ~ 100,000</option>
            <option value="12">More than $100,000</option>
        </select>
        <span>|</span>
        <span id="empTotal${formlines}"></span>

    </p>

    `

    let lineElement = document.createElement('div');
    lineElement.innerHTML=line;
    document.getElementById("employeeInfoTable").appendChild(lineElement);
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
            $('#slide5-modal').modal('show');
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