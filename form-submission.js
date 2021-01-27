
// This sets the date for the first question as today
defaultDate();

function defaultDate() {
    document.getElementById("startDate").valueAsDate = new Date();
}

// The following code saves the form data in document.cookie

const today = new Date();
const expiry = new Date(today.getTime() + 24 * 3600000); // saves cookie for 24 hours

function setCookie(name, value) {
  document.cookie=name + "=" + encodeURIComponent(value) + "; path=/; expires=" + expiry.toGMTString();
}


//serialize formdata


function saveFormData (e) {
  e.preventDefault();
  const formData = new FormData(document.querySelector('form'));
  // const submittedForm = e.target;
  // const formData = new FormData(submittedForm);
  const obj = {};
  for (var key of formData.keys()) {
		obj[key] = formData.get(key);
	}
  // formData.forEach((value, key) => object[key] = value);
  var json = JSON.stringify(obj);

  alert('updated-3')
  setCookie("clientData", json);
}