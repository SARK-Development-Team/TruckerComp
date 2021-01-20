// This section handles changing the carousel's active slide and the color of the icons
// Todo: add animation

let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
positionSlides();
showSlide(slideIndex);

// all slides but the first start off the screen on the right
function positionSlides() {
    for (let i = 0; i < slides.length; i++) {
        let multiplier = i*100;
        slides[i].style.transform= "translateX(" + multiplier +"vw)";  
    }
}

// When the slides advance, the next slid moves in from the right and the old moves out to the left
function plusSlides(n) {
    showSlide(slideIndex += n);
    if (n<0) {
        for (let i = 0; i < slides.length; i++) {
            let value = slides[i].style.transform;
            let numValue = parseInt(value.replace("translateX(", "").replace("vw",""));
            numValue+=178;
            let newValue = "translateX(" + numValue.toString() +"vw)";
            console.log(newValue);
            slides[i].style.transform= newValue;  
        }
    } else if (n>0) {
        for (let i = 0; i < slides.length; i++) {
            let value = slides[i].style.transform;
            let numValue = parseInt(value.replace("translateX(", "").replace("vw",""));
            numValue-=178;
            let newValue = "translateX(" + numValue.toString() +"vw)";
            console.log(newValue);
            slides[i].style.transform= newValue;  
        }
    }
}

// function currentSlide(n) {
//   showSlides(slideIndex = n);
// }

function showSlide(n) {
    const circles = document.getElementsByClassName("fa-circle");
    const back = document.getElementById("btn-back");
    const next = document.getElementById("btn-next");

    //   when on the first slide, the Back button is not visible
    if (n!=0) {
        back.style.visibility="visible";
    }

    // when on the last slide, the Next button changes to Submit
    if (n == slides.length-1) {
        next.innerText = "Submit";
        next.onclick = sendData;
    }    

    for (let i = 0; i < circles.length; i++) {
        circles[i].className = circles[i].className.replace(" active", "");
    }

    circles[slideIndex].className += " active";
}


// Todo: only allow the user to progress if the content is valid.


// Todo: determine if entered zip code is valid. If not, do not allow to move forward and add error message.
zipCodeError = "Please enter a valid zip code."
// Consider this API: https://smartystreets.com/docs/cloud/us-zipcode-api


// Todo: when on slide 4, 'Next' button becomes 'Submit' and sends the form data object.
function sendData() {
    // some code
}

// Form data object
// Based on the user's input, this object will be updated and passed 

data = {
    employees: 0,
    businessLocation: 0,
    zipCode: 0
}