
// This sets the date for the first question as today
defaultDate();

function defaultDate() {
    document.getElementById("startDate").valueAsDate = new Date();
}

// The following code saves the form data in document.cookie

const today = new Date();
const expiry = new Date(today.getTime() + 24 * 3600000); // saves cookie for 24 hours

function setCookie(name, value) {
  document.cookie=name + "=" + escape(value) + "; path=/; expires=" + expiry.toGMTString();
}


//serialize formdata

// formData.JSON
// for (var pair of formData.entries()) {
//   console.log(pair[0] + ': ' + pair[1]);
// }

function saveFormData (e) {
  e.preventDefault();
  const formData = new FormData(document.querySelector('form'));
  
  const object = {};
  formData.forEach((value, key) => object[key] = value);
  var json = JSON.stringify(object);

  // console.log(json);
  alert('updated-2')
  setCookie("clientData", json);
}