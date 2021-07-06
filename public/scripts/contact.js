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

// document.getElementById('chat-window').addEventListener('mouseenter', (e) => {
//     console.log(e)
//     console.log(e.target)
// })

window.onload = () => {
    defineChatWindow();

}
// setTimeout(()=> defineChatWindow(), 3000);

function defineChatWindow() {
    const chatWindow = document.getElementsByTagName('iframe')[0]
    chatWindow.addEventListener('mouseenter', (e) => {
        e.target.style.height='500px';
    })
    chatWindow.addEventListener('mouseleave', (e) => {
        e.target.style.height='220px';
    })
}
