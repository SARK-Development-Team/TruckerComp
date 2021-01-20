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
function plusSlides(n) {
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


// Todo: only allow the user to progress if the content is valid.


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

const affirmative = document.getElementById('slide1Yes');
const negative = document.getElementById('slide1No');

const employees = document.getElementById('slide2EmployeesNumber');

const home = document.getElementById('slide3Home');
const lease = document.getElementById('slide3Lease');
const site = document.getElementById('slide3Site');
const property = document.getElementById('slide3Property');
const own = document.getElementById('slide3Own');

const zip = document.getElementById('slide4Zipcode')

// if a choice is made, the next button is activated

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

