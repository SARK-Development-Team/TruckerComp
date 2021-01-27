
// This sets the date for the first question as today
defaultDate();


// If the cookie exists already, populate the form with the values from the cookie.
function checkCookie() {
  if (document.cookie.length) {
    let formDataObj = processCookie(document.cookie)
    populateForm(formDataObj);
  }
}

function defaultDate() {
    document.getElementById("startDate").valueAsDate = new Date();
}

// Establishes the current time, which is used in the setCookie function
const today = new Date();
const expiry = new Date(today.getTime() + 24 * 3600000); // saves cookie for 24 hours

function setCookie(name, value) {
  document.cookie=name + "=" + encodeURIComponent(value) + "; path=/; expires=" + expiry.toGMTString();
}

// This function creates and returns an object from the saved formData cookie
function processCookie(cookieStr) {
  const regex = /\%+/g
  const formDataArray = cookieStr.split('%22').filter((e)=> !e.match(regex));
  const formDataObj = {};
  for (let i=0; i<formDataArray.length; i+=2) {
    formDataObj[formDataArray[i]]=formDataArray[i+1]
  }
  return formDataObj;
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
}

function populateForm(formDataObj) {
  const form = document.querySelector('form');
  const keys = Object.keys(formDataObj);
  const values = Object.values(formDataObj);
  for(let i = 0; i < keys.length; i++){
    form.elements[keys[i]].value=values[i];
  }
}