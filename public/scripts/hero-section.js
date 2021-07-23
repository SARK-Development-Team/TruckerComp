// ---- Initial Settings ---- //

// This section handles changing the form's active slide
let slideIndex;
const slides = document.getElementsByClassName("slide");
const digits = document.querySelector(".digits").children;
// const digits = Array.from(document.querySelectorAll(".digit"));

initializeForm();
let errorInstance;
function logError(data) {
    fetch('/logging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
}


// Sets all formData to initial values 
// Arranges slides so that all but the first start off screen on the right
// This function is also called when the reset button is pressed
function initializeForm() {
    try {
        // Tabbing through the form breaks it, so this makes the form items untabbable
        let formContents = document.getElementById("hero").querySelectorAll("*");
        for (let i =0; i<formContents.length; i++){
            formContents[i].setAttribute("tabindex", "-1");      
        }
        clearAllFields();
        // Resets the current slide displayed in the carousel
        // It starts at 3 because slides 1 and 2 are outside of the carousel
        slideIndex = 3;
        // Resets the formData
        formData = {
            totalPayroll: '',
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
        document.getElementById("hero").classList.remove('resultSlideHeight');
        document.getElementById("hero").classList.remove('dotSlideHeight');

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
    } catch (err) {
        errorInstance = {
            'function': 'initializeForm',
            'parameters': [], 
            'error': err
        }
        logError(errorInstance);
    }
}

// ---- General Functionality ---- //

// When the slides advance, the next slide moves in from the right and the old moves out to the left
function changeSlide(n) {
    try {
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
    } catch (err) {
        errorInstance = {
            'function': 'changeSlide',
            'parameters': [`slide ${n}`], 
            'error': err
        }
        logError(errorInstance);
    }
}

// moving a slide in the carousel off the left side of the screen
function moveSlideLeft(n) {
    try {
        document.getElementById(`slide${n}`).classList.add("move-left");
        document.getElementById(`slide${n}`).classList.remove("visible");
    } catch (err) {
        errorInstance = {
            'function': 'moveSlideLeft',
            'parameters': [`slide ${n}`], 
            'error': err
        }
        logError(errorInstance);
    }
}

// moving a slide in the carousel off the right side of the screen
function moveSlideRight(n) {
    try {
        document.getElementById(`slide${n}`).classList.add("move-right");
        document.getElementById(`slide${n}`).classList.remove("visible");
    } catch (err) {
        errorInstance = {
            'function': 'moveSlideRight',
            'parameters': [`slide ${n}`], 
            'error': err
        }
        logError(errorInstance);
    }
}

// moving a slide in the right margin into view
function moveSlideIn(n) {
    try {
        document.getElementById(`slide${n}`).classList.remove("move-right");
        document.getElementById(`slide${n}`).classList.remove("move-left");
        document.getElementById(`slide${n}`).classList.add("in-view");
    } catch (err) {
        errorInstance = {
            'function': 'moveSlideIn',
            'parameters': [`slide ${n}`], 
            'error': err
        }
        logError(errorInstance);
    }
}


// ---- Slide 1 ---- //

const towing = document.getElementById('slide1Towing');
const sand = document.getElementById('slide1Sand');
const longhaul = document.getElementById('slide1LongHaul');
const local = document.getElementById('slide1Local');

function moveSlide(number) {
    try {
        document.getElementById(`slide${number}`).classList.add('move-right');
        document.getElementById(`slide${number}`).classList.remove('visible');
    } catch (err) {
        errorInstance = {
            'function': 'moveSlide',
            'parameters': [`slide ${number}`], 
            'error': err
        }
        logError(errorInstance);
    }
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
    try {
        document.getElementById('intro-image').classList.remove('visible');
        document.getElementById('intro-image').classList.add('move-left');
        document.querySelector('.slide-area').style.opacity=1;
    } catch (err) {
        errorInstance = {
            'function': 'removeIntroImage',
            'parameters': [], 
            'error': err
        }
        logError(errorInstance);
    }
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

// This loop allows the user to backspace through the 7 separate fields
for (let i=1; i<digits.length; i++) {
    digits[i].addEventListener('keydown', (e) => {
        if (e.key=="Backspace") {
            e.target.value='';
            e.target.previousElementSibling.focus();
        }
        const intRegex = /[0-9]/
        if (e.target.value && intRegex.test(e.key)) e.target.value = e.key
    })
}
// This loop allows the user to overwrite existing field inputs 
for (let i=0; i<digits.length-1; i++) {
    digits[i].addEventListener('keydown', (e) => {
        const intRegex = /[0-9]/
        if (e.target.value && intRegex.test(e.key)) {
            e.target.value = e.key
            e.target.nextElementSibling.focus();
        }
    })
}

function expandPageHeight() {
    try {
        document.getElementById("hero").classList.add('dotSlideHeight');
    } catch (err) {
        errorInstance = {
            'function': 'expandPageHeight',
            'parameters': [], 
            'error': err
        }
        logError(errorInstance);
    }
}

function useInitialPageHeight() {
    try {
        document.getElementById("hero").classList.remove('dotSlideHeight');
    } catch (err) {
        errorInstance = {
            'function': 'useInitialPageHeight',
            'parameters': [], 
            'error': err
        }
        logError(errorInstance);
    }
}

// This event listener allows the DOT input to come together from the 7 separate fields
document.querySelector(".digits").addEventListener("input", (e) => {
    if (e.target.value) e.target.value ='';
    try {
        e.target.value = e.data.replace(/[^0-9]/g,'');
    } catch(err) {
        console.log(err);
    }
    if (e.target.value !== "" && e.target.nextElementSibling && e.target.nextElementSibling.nodeName === "INPUT" ){
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
        // When a value longer than 7 digits is pasted, the first 7 digits are kept and the rest discarded
        const values = e.clipboardData.getData("text").split("");
        const span = Math.min(values.length, 7)
        for (i=0; i<span; i++) {
            let inputBox = document.querySelectorAll('.digit')[i]

            inputBox.value= values[parseInt(i)];
        };
        if (values.length >= 7) {

            var total = '';
            for (let i=0; i<digits.length; i++) {
                total+=digits[i].value;
            }
            document.getElementById('slide3DOT').value= parseInt(total);
            // if (total.length=7) {
                searchDOT(event);
            // }
        }
    } catch(err) {
        console.log(err);
        errorInstance = {
            'function': 'pasteValues',
            'parameters': [`event ${e}`], 
            'error': err
        }
        logError(errorInstance);
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
    try {
        clearAllFields()
        document.getElementById("searchResult").classList.add("expandable-collapsed")
        for (let i=0; i<digits.length; i++) {
            digits[i].value = '';
        }
    } catch (err) {
        errorInstance = {
            'function': 'clearDOT',
            'parameters': [], 
            'error': err
        }
        logError(errorInstance);
    }
}


// This assures that all fields in the form (after the DOT entry fields) are returned to initial conditions
function clearAllFields() {
    try {
        document.getElementById('companyName').value = '' ;
        document.getElementById('DBAfield').value = '';
        document.getElementById('qName').innerText = '';
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
        // document.getElementById('q2').innerText = '';
        // document.getElementById('q3').innerText = '';
        document.getElementById('q4').innerText = '';
        document.getElementById('low-end').innerText = '';
        document.getElementById('high-end').innerText = '';
    } catch (err) {
        errorInstance = {
            'function': 'clearAllFields',
            'parameters': [], 
            'error': err
        }
        logError(errorInstance);
    }
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
            loadIcon.style.display = "flex";
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
                    const zipCodePattern = /\d{5}/g;
                    const zipCodeMatches = client.result['address'].match(zipCodePattern)
                    formData.zipCode = zipCodeMatches[zipCodeMatches.length-1];
                }
                // If a DBA name is returned, add a section that displays it
                if (client.result['DBA']) {
                    document.getElementById('DBAfield').value = client.result['DBA'];
                    // document.getElementById('DBAfield').style.visibility = "visible";
                } else {
                    document.getElementById('DBAfield').value = "";
                    // document.getElementById('DBAfield').style.visibility = "hidden";
                }
                document.getElementById('companyName').value = client.result['name'] ?? '' ;
                document.getElementById('qName').innerText = client.result['name'] ?? '';
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
            errorInstance = {
                'function': 'searchDOT',
                'parameters': [`event ${e}`], 
                'error': err
            }
            logError(errorInstance);
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
    try {
        // If an email address is given on the DOT slide, save it in the formData and add it to the input on slide 5
        formData.DOT=document.getElementById('slide3DOT').value;
        formData.email=document.getElementById('email').value;
        formData.phone=document.getElementById('phone').value;
        formData.address=document.getElementById('address').value;
        formData.mailingAddress=document.getElementById('mailingAddress').value;
        formData.powerUnits=document.getElementById('powerUnits').value;
        formData.drivers=document.getElementById('drivers').value;
        formData.carrierOperation=document.getElementById('carrierOperation').value;
        formData.companyName=document.getElementById('companyName').value;
        document.getElementById('qName').innerText = document.getElementById('companyName').value;

        // These lines establish the contents of the dropdown boxes 
        const operationTypeChoices = Array.from(document.querySelectorAll('.drop-display')[0].childNodes[0].childNodes);
        const cargoCarriedChoices = Array.from(document.querySelectorAll('.drop-display')[1].childNodes[0].childNodes);

        // These lines save their contents into the formData as arrays
        for (let i=0; i<operationTypeChoices.length; i++) {
            // nodes with the "hide" class get ignored
            if (!operationTypeChoices[i].classList.contains('hide')) {
                formData.operationType.push(operationTypeChoices[i].innerText.slice(0, -2));
            }
        }
        for (let j=0; j<cargoCarriedChoices.length; j++) {
            // nodes with the "hide" class get ignored
            if (!cargoCarriedChoices[j].classList.contains('hide')) {
                formData.cargoCarried.push(cargoCarriedChoices[j].innerText.slice(0, -2));
            }
        }
        document.getElementById('empAmount1').value = document.getElementById('drivers').value;
        if (formData.email) document.getElementById('slide5Email').value = formData.email;
        testEmail();
        changeSlide(1);
    } catch (err) {
        errorInstance = {
            'function': 'saveClientData',
            'parameters': [], 
            'error': err
        }
        logError(errorInstance);
    }         
}

// This function makes the API call to the server, searching for the DOT number in the FMCSA website and returning one client that matches that number 
async function fetchDOT(dotObject) {
    try {
        const result = fetch('/dot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dotObject)
        }).then(response => response.json()).catch(err=>console.log(err));
        return result;
    } catch (err) {
        errorInstance = {
            'function': 'fetchDOT',
            'parameters': [`DOT: ${dotObject}`], 
            'error': err
        }
        logError(errorInstance);
    }         
}

// ---- Slide 4 ---- //

function savePayrollData() {
    addPayrollUpdate();
    addTotalUpdate();
    try {
        if (formData.totalPayroll*1 != 0) {
            fillInfo(formData);
            requestQuoteSlide(formData)
            changeSlide(1);
            document.getElementById('emailError').style.visibility='hidden';
        }
        document.getElementById('hero').classList.add('resultSlideHeight');
    } catch(err) {
        console.log(err);
        errorInstance = {
            'function': 'savePayrollData',
            'parameters': [], 
            'error': err
        }
        logError(errorInstance);   
    }
}

function addPayrollUpdate() {
    try {
        formData.totalPayroll='';
        var payrollValue=0.00;
        const payrollLines = document.getElementsByClassName('remove-type').length;
        for (let i =0; i<payrollLines; i++) {
            document.getElementById(`empTotal${i+1}`).addEventListener("change", (e) => {
                document.getElementById(`empSalary${i+1}`).value =  parseFloat(e.target.value)/ parseInt(document.getElementById(`empAmount${i+1}`).value);            
            });
            payrollValue+=parseFloat(document.getElementById(`empTotal${i+1}`).value).toFixed(2);

        }
        formData.totalPayroll=parseFloat(payrollValue).toFixed(2);
        document.getElementById('total-payroll').innerText = formData.totalPayroll
    } catch (err) {
        errorInstance = {
            'function': 'addPayrollUpdate',
            'parameters': [], 
            'error': err
        }
        logError(errorInstance);
    }         
}

function addTotalUpdate() {
    try {
        formData.totalPayroll='';
        var payrollValue=0.00;
        const payrollLines = document.getElementsByClassName('remove-type').length;
        for (let i =0; i<payrollLines; i++) {
            document.getElementById(`empSalary${i+1}`).addEventListener("change", (e) => {  
                document.getElementById(`empTotal${i+1}`).value =  parseFloat(e.target.value) * parseInt(document.getElementById(`empAmount${i+1}`).value);            
            });

            payrollValue+=parseFloat(document.getElementById(`empTotal${i+1}`).value).toFixed(2);
        }
        formData.totalPayroll=parseFloat(payrollValue).toFixed(2);
        document.getElementById('total-payroll').innerText = formData.totalPayroll
    } catch (err) {
        errorInstance = {
            'function': 'addTotalUpdate',
            'parameters': [], 
            'error': err
        }
        logError(errorInstance);
    }         
}

// This sends the data to the backend and returns with a number for the quote
function fetchResult(data) {
    try {
        const result = fetch('/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => response.json());

        let number = result;
        return number;
    } catch (err) {
        errorInstance = {
            'function': 'fetchResult',
            'parameters': [data], 
            'error': err
        }
        logError(errorInstance);
    }         
}

function removeLine(e, number) {
    try {
        e.preventDefault();
        const thisRow = Array.from(document.getElementsByClassName(`row${number}`));
        thisRow.forEach((e)=> {
            e.classList.remove('currency');
            e.classList.remove('select-container');
        });
        document.getElementById(`removeLine${number}`).style.display="none";
        document.getElementById(`empType${number}`).style.display="none";
        document.getElementById(`empAmount${number}`).style.display="none";
        document.getElementById(`empSalary${number}`).style.display="none";
        document.getElementById(`empTotal${number}`).style.display="none";
        document.getElementById(`empType${number}`).value="Other";
        document.getElementById(`empAmount${number}`).value=0.000001;
        document.getElementById(`empSalary${number}`).value=0.000001;
        document.getElementById(`empTotal${number}`).value=0.000001;
        addPayrollUpdate();
        addTotalUpdate();
    } catch (err) {
        errorInstance = {
            'function': 'removeLine',
            'parameters': [`event ${e}`, `line number ${number}`], 
            'error': err
        }
        logError(errorInstance);
    }         
}

// This function adds another row to the employee info table only when the most recent line is completely filled in
function addRow(e) {
    try {
        e.preventDefault();
        const payrollLines = document.getElementsByClassName('remove-type').length;
        const lastLine = Array.from(document.getElementsByClassName(`table-field row${payrollLines}`));
        if (lastLine.every((e) => e.value)) {
        
            const line = `
                <img src="public/images/wrong.svg" loading="lazy" onclick="removeLine(event, ${payrollLines+1})"
                alt="" class="remove-type row${payrollLines+1}" id="removeLine${payrollLines+1}" >
                <div class="row${payrollLines+1} colType select-container">
                    <select class="table-field" style="appearance: none; width: 100%" id="empType${payrollLines+1}">
                        <option value="" disabled selected>Employee Type</option>
                        <option value="Driver" >Driver</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Accounting">Accounting</option>
                        <option value="Custodial">Custodial</option>
                        <option value="Clerical">Clerical</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <input type="number" class="table-field row${payrollLines+1} colAmount" id="empAmount${payrollLines+1}" value=0 min=0 onfocusout="addPayrollUpdate()"></input>
                
                <div class="currency row${payrollLines+1} colSalary">
                    <input type="number" class=" table-field" step="0.01" id="empSalary${payrollLines+1}" value=0 min=0.00 onfocusout="addPayrollUpdate()"></input>
                </div>
                <div class="currency row${payrollLines+1} colTotal">
                    <input type="number" class="table-field" step="0.01" id="empTotal${payrollLines+1}" value=0 min=0.00 onfocusout="addTotalUpdate()"></input>
                </div>
            `
            document.getElementById("payroll-columns").insertAdjacentHTML('beforeend', line);

        }
        else {
            lastLine.every((e) => console.log("e= ", e, " evalue= ", e.value))
        }
    } catch (err) {
        errorInstance = {
            'function': 'addRow',
            'parameters': [`event ${e}`], 
            'error': err
        }
        logError(errorInstance);
    }         
}

// ---- Slide 5 ---- //


// Fills in the data area on slide 5 for confirmation
function fillInfo(data) {
    try {
        const q0 = document.getElementById('q0');
        const q1 = document.getElementById('q1');
        // const q2 = document.getElementById('q2');
        // const q3 = document.getElementById('q3');
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
        q4.innerText=data.totalPayroll;
    } catch (err) {
        errorInstance = {
            'function': 'fillInfo',
            'parameters': [data], 
            'error': err
        }
        logError(errorInstance);
    }         
}

const email = document.getElementById('slide5Email');

function testEmail() {
    try {
        const input = email.value;
        const submit = document.getElementById('submit');
        // this regex tests for an email address
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const emailError = document.getElementById('emailError');
        emailError.style.visibility = 'hidden';
        if (input!='' && regex.test(input)) {
            formData.email = input;
            submit.classList.remove('disabled');
            submit.onclick=function() {
                alert("Thank you for your submission! We've sent an email to the address listed with more information!");
                sendQuote(formData);
                setCookie('clientData', JSON.stringify(formData));
            };
        } else {
            submit.classList.add('disabled');
            emailError.style.visibility = 'visible';
        }
    } catch (err) {
        errorInstance = {
            'function': 'testEmail',
            'parameters': [], 
            'error': err
        }
        logError(errorInstance);
    }         
}

email.addEventListener('keyup', () => {
    testEmail();
});

function sendQuote (data) {
    try {
        // const uri = uriRoot+'send';

        fetch('/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => response.json());
    } catch (err) {
        errorInstance = {
            'function': 'sendQuote',
            'parameters': [data], 
            'error': err
        }
        logError(errorInstance);
    }         
}


//This is the call for the quote
async function requestQuoteSlide(data) {
    try {
        const lowEnd = document.getElementById("low-end");
        const highEnd = document.getElementById("high-end");
        let response = await fetchResult(data);
        let number = response.result;
        lowEnd.innerText=(number *0.95).toFixed(2);
        highEnd.innerText=(number *1.05).toFixed(2);
    } catch (err) {
        errorInstance = {
            'function': 'requestQuoteSlide',
            'parameters': [data], 
            'error': err
        }
        logError(errorInstance);
    }   
}

// This saves the formData as a cookie in the browser
// Currently the cookie is not being used
function setCookie(name, value) {
    try {
        const today = new Date();
        const expiry = new Date(today.getTime() + 24 * 3600000); // saves cookie for 24 hours
        document.cookie=name + "=" + value + "; path=/; expires=" + expiry.toGMTString();
    } catch (err) {
        errorInstance = {
            'function': 'setCookie',
            'parameters': [name, value], 
            'error': err
        }
        logError(errorInstance);
    }   
  }

// On page load //
addPayrollUpdate();
addTotalUpdate();