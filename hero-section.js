// This section handles changing the carousel's active slide and the color of the icons

let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
initializeCarousel();

// Sets all initialFormData to initial values 
// Arranges all slides but the first start off the screen on the right
function initializeCarousel() {
    initialFormData = {
        employees: 0,
        businessLocation: 0,
        zipCode: 0
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
            numValue+=168;
        } else if (n>0) {
            numValue-=168;
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
    // next.style.background = "#3499cc";
    next.onclick = () => changeSlide(1);
}

function deactivateSlide(slideIndex) {
    const next = document.getElementById('next' + slideIndex);
    next.style.opacity=0;
    // next.style.background = "#666";
    next.style.cursor=""
    next.onclick = '';
}

//------Slide 1 
const aff = document.getElementById('slide1Yes');
const neg = document.getElementById('slide1No');

aff.onclick = () => {
    const slide2 = document.getElementById('slide2');
    const slide3 = document.getElementById('slide3');
    const slide4 = document.getElementById('slide4');
    slide2.style.display='block';
    slide3.style.transform = "translateX(200vw)";
    slide4.style.transform = "translateX(300vw)";
    nextSlide(1);
}
// Todo: add a function to skip slide 2 if "neg" is active
neg.onclick = () => {
    const slide2 = document.getElementById('slide2');
    const slide3 = document.getElementById('slide3');
    const slide4 = document.getElementById('slide4');
    slide2.style.display='none';
    slide3.style.transform = "translateX(100vw)";
    slide4.style.transform = "translateX(200vw)";
    nextSlide(1)
};

//------Slide 2
// For slides 2-4, the initialFormData is updated based on the user's input.
const employees = document.getElementById('slide2EmployeesNumber');

employees.addEventListener('keyup', () => {
    const input = parseInt(employees.value);
    const empError = document.getElementById('empError');
    if (input>0 && Number.isInteger(input)) {
        initialFormData.employees = input;
        empError.style.visibility='hidden';
        nextSlide(2);
    } else {
        empError.style.visibility='visible';
        deactivateSlide(2)
    }
});

//------Slide 3 
const home = document.getElementById('slide3Home');
const lease = document.getElementById('slide3Lease');
const site = document.getElementById('slide3Site');
const property = document.getElementById('slide3Property');
const own = document.getElementById('slide3Own');

home.onclick = () => {
    initialFormData.businessLocation = 0;
    nextSlide(3);
}
lease.onclick = () => {
    initialFormData.businessLocation = 1;
    nextSlide(3);
}
site.onclick = () => {
    initialFormData.businessLocation = 2;
    nextSlide(3);
}
property.onclick = () => {
    initialFormData.businessLocation = 3;
    nextSlide(3);
}
own.onclick = () => {
    initialFormData.businessLocation = 4;
    nextSlide(3);
}

//------Slide 4 
const zip = document.getElementById('slide4Zipcode');

zip.addEventListener('keyup', () => {
    const input = parseInt(zip.value);
    const zipError = document.getElementById('zipError');
    const submit = document.getElementById('submit');
    if (input>0 && Number.isInteger(input)) {
        initialFormData.zipCode = input;
        zipError.style.visibility = 'hidden';
        submit.style.background='#4ca846';
        submit.href='main-form.html';
        setCookie("initialForm", JSON.stringify(initialFormData));
    } else {
        submit.style.background='red';
        submit.href = '';
        zipError.style.visibility = 'visible';
    }
});

// Todo: determine if entered zip code is valid. 
zipCodeError = "Please enter a valid zip code."
// Consider this API: https://smartystreets.com/docs/cloud/us-zipcode-api

// This is the same setCookie function as in form-submission.js
function setCookie(name, value) {
    const today = new Date();
    const expiry = new Date(today.getTime() + 24 * 3600000); // saves cookie for 24 hours
    document.cookie=name + "=" + value + "; path=/; expires=" + expiry.toGMTString();
  }