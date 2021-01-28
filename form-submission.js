
// This sets the date for the first question as today
defaultDate();

function defaultDate() {
  document.getElementById("startDate").valueAsDate = new Date();
}


// Depending on input from the initial form, hide certain questions
function hideQuestions(input) {
  const payroll = document.getElementById('payroll');
  const nonDrivers = document.getElementById('nonDrivers');
  if (input.employees>0) {
    let toggle = 'block';
  } else {
    let toggle = 'none';
  }
    payroll.style.display = toggle;
    nonDrivers.style.display = toggle;
}

// If the cookie exists already, populate the form with the values from the cookie.
function checkCookie() {
  hideQuestions()  //<--------------
  const regex = /clientData={(.*?)}/ //This finds only the clientData string from document.cookie, which may have multiple others

  if (document.cookie.match(regex)) {
    let clientData= document.cookie.match(regex)[0].substring(11); // This trims off the "clientData=" portion 
    let formDataObj = JSON.parse(clientData);
    populateForm(formDataObj);
  }
}

// Establishes the current time, which is used in the setCookie function
const today = new Date();
const expiry = new Date(today.getTime() + 24 * 3600000); // saves cookie for 24 hours

function setCookie(name, value) {
  document.cookie=name + "=" + value + "; path=/; expires=" + expiry.toGMTString();
}

// This function creates and returns an object from the saved formData cookie
// function processCookie(clientData) {
//   const formDataObj = JSON.parse(clientData);
//   return formDataObj;
// }


// This function takes in the submitted form and saves it as a cookie
function saveFormData (e) {
  e.preventDefault(); //stop the button from reloading the page
  const formData = new FormData(document.querySelector('form'));
  const obj = {};
  for (let key of formData.keys()) {
		obj[key] = formData.get(key);
	}
  const json = JSON.stringify(obj); 

  setCookie("clientData", json);
}

function populateForm(formDataObj) {
  const form = document.querySelector('form');
  const keys = Object.keys(formDataObj);
  const values = Object.values(formDataObj);
  for(let i = 0; i < keys.length; i++){
    form.elements[keys[i]].value=values[i];
  }
}