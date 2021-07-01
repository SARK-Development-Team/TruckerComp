let contactInfo = {
    name:'',
    phone:'',
    email:'',
    typeOfInsurance:'',
    comments:''
}

function sendContact(e) {
    e.preventDefault();
    contactInfo.name = document.getElementById('name').value;
    contactInfo.email = document.getElementById('email').value;
    contactInfo.phone = document.getElementById('phone').value;
    contactInfo.typeOfInsurance = document.getElementById('type').value;
    contactInfo.comments = document.getElementById('comment').value;
    fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactInfo)
    }).then(response => response.json()).catch(err=>console.log(err));
    alert("Thank you! A SARK employee will reach out to you within 1-2 business days");
    window.location.reload();
}