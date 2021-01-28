
// This sets the date for the first question as today
defaultDate();

function defaultDate() {
  document.getElementById("startDate").valueAsDate = new Date();
}


// Depending on input from the initial form, hide certain questions
function hideQuestions() {
  const regex = /initialForm={(.*?)}/ //This finds only the initialForm string from document.cookie, which may have multiple others
  const initialForm = document.cookie.match(regex)[0].substring(12); // This trims off the "initialForm=" portion
  const initialFormObj = JSON.parse(initialForm);
  const payroll = document.getElementById('payroll');
  const nonDrivers = document.getElementById('nonDrivers');
  const zipCode = document.getElementById('zip');
  let toggle = '';
  if (initialFormObj.employees>0) {
    toggle = 'block';
  } else {
    toggle = 'none';
  }
    payroll.style.display = toggle;
    nonDrivers.style.display = toggle;
    zip.value = initialFormObj.zipCode;
}

// If the cookie exists already, populate the form with the values from the cookie.
function checkCookie() {
  hideQuestions()  
  const regex = /clientData={(.*?)}/ //This finds only the clientData string from document.cookie, which may have multiple others

  if (document.cookie.match(regex)) {
    let clientData= document.cookie.match(regex)[0].substring(11); // This trims off the "clientData=" portion 
    let formDataObj = JSON.parse(clientData);
    populateForm(formDataObj);
  }
}

function setCookie(name, value) {
  const today = new Date();
  const expiry = new Date(today.getTime() + 24 * 3600000); // Establishes the current time + 24 hours
  document.cookie=name + "=" + value + "; path=/; expires=" + expiry.toGMTString();
}

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
  alert("Thank you for your submission! An agent will contact you shortly.");
}

function populateForm(formDataObj) {
  const form = document.querySelector('form');
  const keys = Object.keys(formDataObj);
  const values = Object.values(formDataObj);
  for(let i = 0; i < keys.length; i++){
    form.elements[keys[i]].value=values[i];
  }
}