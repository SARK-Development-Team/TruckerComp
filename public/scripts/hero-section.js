


// This section handles changing the carousel's active slide and the color of the icons

let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
initializeCarousel();

// Sets all initialFormData to initial values 
// Arranges slides so that all but the first start off screen on the right
function initializeCarousel() {
    initialFormData = {
        employees: 0,
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
    slide3.style.display='grid';
    slide4.style.transform = "translateX(300vw)";
    slide5.style.transform = "translateX(400vw)";
    nextSlide(1);
}
// Todo: add a function to skip slide 2 if "neg" is active
neg.onclick = () => {
    neg.classList.add('selected');
    aff.classList.remove('selected');
    const empOrSelf = document.getElementById('empOrSelf');
    empOrSelf.innerText = 'I';
    const slide3 = document.getElementById('slide3');
    const slide4 = document.getElementById('slide4');
    const slide5 = document.getElementById('slide5');
    slide3.style.display='none';
    slide4.style.transform = "translateX(200vw)";
    slide5.style.transform = "translateX(300vw)";
    nextSlide(1)
};

//------Slide 2
// For slides 2-4, the initialFormData is updated based on the user's input.
const longhaul = document.getElementById('slide2LongHaul');
const sand = document.getElementById('slide2Sand');
const local = document.getElementById('slide2Local');
const towing = document.getElementById('slide2Towing');

longhaul.onclick = () => {
    longhaul.classList.add('selected');
    sand.classList.remove('selected');
    local.classList.remove('selected');
    towing.classList.remove('selected');
    initialFormData.businessType = 1;
    nextSlide(2);
}
sand.onclick = () => {
    longhaul.classList.remove('selected');
    sand.classList.add('selected');
    local.classList.remove('selected');
    towing.classList.remove('selected');
    initialFormData.businessType = 2;
    nextSlide(2);
}
local.onclick = () => {
    longhaul.classList.remove('selected');
    sand.classList.remove('selected');
    local.classList.add('selected');
    towing.classList.remove('selected');
    initialFormData.businessType = 3;
    nextSlide(2);
}
towing.onclick = () => {
    longhaul.classList.remove('selected');
    sand.classList.remove('selected');
    local.classList.remove('selected');
    towing.classList.add('selected');
    initialFormData.businessType = 4;
    nextSlide(2);
}

//------Slide 3 
const employees = document.getElementById('slide3EmployeesNumber');
const payroll = document.getElementById('slide3Payroll');

employees.addEventListener('keyup', () => {
    const input = parseInt(employees.value);
    const empError = document.getElementById('empError');
    if (input>0 && Number.isInteger(input)) {
        initialFormData.employees = input;
        empError.style.visibility='hidden';
        checkSlide3();
    } else {
        empError.style.visibility='visible';
        deactivateSlide(3)
    }
});

payroll.addEventListener('keyup', () => {
    const input = parseInt(payroll.value);
    const payrollError = document.getElementById('payrollError');
    if (input>0 && Number.isInteger(input)) {
        initialFormData.payroll = input;
        payrollError.style.visibility='hidden';
        checkSlide3();
    } else {
        payrollError.style.visibility='visible';
        deactivateSlide(3)
    }
});

// Checks to see if values have been entered for slide 3; if so, allows progress to next slide
function checkSlide3() {
    if (initialFormData.employees>0&&initialFormData.payroll>0){
        nextSlide(3);
    }
}

//------Slide 4 
const zip = document.getElementById('slide4Zipcode');
const miles = document.getElementById('slide4Mileage');

zip.addEventListener('keyup', () => {
    const input = parseInt(zip.value);
    const zipError = document.getElementById('zipError');
    if (input>0 && Number.isInteger(input)) {
        initialFormData.zipCode = input;
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
        initialFormData.mileage = input;
        milesError.style.visibility = 'hidden';
        checkSlide4();
    } else {
        milesError.style.visibility = 'visible';
    }
});



// Checks to see if values have been entered for slide 4; if so, allows progress to next slide
function checkSlide4() {
    if (initialFormData.zipCode>0&&initialFormData.mileage>0){
        nextSlide(4);
        fillInfo(initialFormData);
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
    if (initialFormData.employees>0) {
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
    const loc = window.location.pathname;
    const dir = loc.substring(0, loc.lastIndexOf('/'));
    const input = email.value;
    const submit = document.getElementById('submit');
    // this regex tests for an email address
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const emailError = document.getElementById('emailError');
    if (input!='' && regex.test(input)) {
        initialFormData.email = input;
        emailError.style.visibility = 'hidden';
        submit.style.background='#4ca846';
        submit.onclick=function () {requestQuote(dir + '/send', initialFormData)};
        setCookie("initialForm", JSON.stringify(initialFormData));
    } else {
        submit.style.background='red';
        submit.href = '';
        emailError.style.visibility = 'visible';
    }
});


//This is the call for the quote

// function requestQuote(data) {
//     alert('Quote requested!');

// }

function requestQuote (path, params, method='post') {

    const form = document.createElement('form');
    form.method = method;
    form.action = path;

  
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];
  
        form.appendChild(hiddenField);
      }
    }
  
    document.body.appendChild(form);
    form.submit();
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