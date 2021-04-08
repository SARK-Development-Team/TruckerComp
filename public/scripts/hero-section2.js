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
        employees: [],
        totalPayroll: 0,
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

function openSlides() {
    document.getElementById('intro-image').style.left = "-100vw";
    document.getElementById('slide1').style.left = "100vw";
}

const towing = $('#slide1Towing');
const sand = $('#slide1Sand');
const longhaul = $('#slide1LongHaul');
const local = $('#slide1Local');

towing.click(() => {
    formData.businessType=1;
    showSlide2();
    openSlides();
});

sand.click(() => {
    formData.businessType=2;
    showSlide2();
    openSlides();
});

longhaul.click(() => {
    formData.businessType=3;
    showSlide2();
    openSlides();
});

local.click(() => {
    formData.businessType=4;
    hideSlide2();
    openSlides();
});


function showSlide2() {
    $('#slide2').css("display", "block");
    $('#slide3').css("transform", "translateX(100vw)")
    $('#slide4').css("transform", "translateX(200vw)")
    $('#slide5').css("transform", "translateX(300vw)")
}

function hideSlide2() {
    $('#slide2').css("display", "none");
    $('#slide3').css("transform", "translateX(0vw)")
    $('#slide4').css("transform", "translateX(100vw)")
    $('#slide5').css("transform", "translateX(200vw)")
}

// ---- Slide 2 ---- //


// ---- Slide 3 ---- //

const digits = document.querySelector(".digits").children;
for (let i=1; i<digits.length; i++) {
    digits[i].addEventListener('keydown', (e) => {

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
        console.log("it's filled");
        var total = '';
        for (let i=0; i<digits.length; i++) {
            total+=digits[i].value;
        }
        $('#slide3DOT').val(total);
        searchDOT(event);
        // $('#btn-search').css("display", "inline");
    }
});


// const DOTinput = document.getElementById('slide3DOT');

// DOTinput.addEventListener('keyup', () => {
//     const input = parseInt(DOTinput.value);
//     const DOTError = document.getElementById('DOTError');
//     if (input>0 && Number.isInteger(input)) {
//         formData.mileage = input;
//         DOTError.style.visibility = 'hidden';
//         // checkSlide4();
//     } else {
//         DOTError.style.visibility = 'visible';
//     }
// });

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
                $('#slide3-modal').modal('show');
                document.getElementById('DOT').value = client.result['DOT Number'];
                document.getElementById('companyName').value = client.result['Company Name'];
                document.getElementById('MC').value = client.result['MCP Number'];
                document.getElementById('address').value = client.result['Address'];
                document.getElementById('mailingAddress').value = client.result['Mailing Address'];
                document.getElementById('phone').value = client.result['Phone'];
                document.getElementById('powerUnits').value = client.result['Power Units'];
                document.getElementById('drivers').value = client.result['Drivers'];
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


function closeModal() {
    $('#slide3-modal').modal('hide');
}

// ---- Slide 4 ---- //

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
        <input class="empPayroll" name="empPayroll${formlines}" type="number" min="0.01" id="empPayroll${formlines}">
    </p>
    `

    let lineElement = document.createElement('div');
    lineElement.innerHTML=line;
    document.getElementById("employeeInfoTable").appendChild(lineElement);
}