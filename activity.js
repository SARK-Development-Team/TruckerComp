// This section handles changing the carousel's active slide and the color of the icons

let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
positionSlides();

// all slides but the first start off the screen on the right
function positionSlides() {
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


// Only allow the user to progress if the content is valid.
// If a choice is made, the next button is activated

function nextSlide(slideIndex) {
    const next = document.getElementById('next' + slideIndex);
    next.style.background = "#3499cc";
    next.onclick = () => changeSlide(1);
}

//------Slide 1 
const aff = document.getElementById('slide1Yes');
const neg = document.getElementById('slide1No');

aff.onclick = () => nextSlide(1);
// Todo: add a function to skip slide 2 if "neg" is active
neg.onclick = () => nextSlide(1);

//------Slide 2
// For slides 2-4, the formData is updated based on the user's input.
const employees = document.getElementById('slide2EmployeesNumber');

employees.addEventListener('keyup', () => {
    const input = parseInt(employees.value);
    const empError = document.getElementById('empError');
    if (input>0 && Number.isInteger(input)) {
        formData.employees = input;
        empError.style.display='none';
        nextSlide(2);
    } else {
        empError.style.display='block';
        //Todo: deactivate next button
    }
});

//------Slide 3 
const home = document.getElementById('slide3Home');
const lease = document.getElementById('slide3Lease');
const site = document.getElementById('slide3Site');
const property = document.getElementById('slide3Property');
const own = document.getElementById('slide3Own');

home.onclick = () => {
    formData.businessLocation = 0;
    nextSlide(3);
}
lease.onclick = () => {
    formData.businessLocation = 1;
    nextSlide(3);
}
site.onclick = () => {
    formData.businessLocation = 2;
    nextSlide(3);
}
property.onclick = () => {
    formData.businessLocation = 3;
    nextSlide(3);
}
own.onclick = () => {
    formData.businessLocation = 4;
    nextSlide(3);
}

//------Slide 4 
const zip = document.getElementById('slide4Zipcode');

zip.addEventListener('keyup', () => {
    const input = parseInt(zip.value);
    const zipError = document.getElementById('zipError');
    const submit = document.getElementById('submit');
    if (input>0 && Number.isInteger(input)) {
        formData.zipCode = input;
        zipError.style.display = 'none';
        submit.style.background='#4ca846';
        submit.onclick= () => sendData();
    } else {
        submit.style.background='';
        submit.onclick = '';
        zipError.style.display = 'block';
    }
});
// Todo: determine if entered zip code is valid. If not, do not allow to move forward and add error message.
zipCodeError = "Please enter a valid zip code."
// Consider this API: https://smartystreets.com/docs/cloud/us-zipcode-api


// Todo: when on slide 4, 'Next' button becomes 'Submit' and sends the form data object.
function sendData() {
    updateFormData();
    // some code
}

// Form data object
// Based on the user's input, this object will be updated and passed 

// Each form element has a unique id, and clicking it changes the corresponding value in the object


formData = {
    employees: 0,
    businessLocation: 0,
    zipCode: 0
}

function updateFormData(key, value) {
    formData.key = value;
}

formData.employees = employees.value;
formData.businessLocation = '';
formData.zipCode = zip.value;

