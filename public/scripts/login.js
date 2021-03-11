let emailField = document.getElementById('email');

function checkCookie() {
    const regex = /clientData={(.*?)}/ //This finds only the clientData string from document.cookie, which may have multiple others
    try {
        let clientData= document.cookie.match(regex).input.substring(11); // This trims off the "clientData=" portion 
    } catch (err) {
        return null;
    }
    let clientDataObj = JSON.parse(clientData);
    // Here the value gets assigned from the cookie
    emailField.value=clientDataObj.email;
}
checkCookie();