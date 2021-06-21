const navbar = document.getElementById("navbar");
// const comp = document.getElementById("comp");


window.onscroll = () => { 
    "use strict";
    if (document.body.scrollTop >= 20 || document.documentElement.scrollTop >= 20 ) {
        // comp.style.color=("#F5F3F5");
        navbar.classList.add("darkNav");
        navbar.classList.remove("lightNav");
    } 
    else {
        // comp.style.color=("rgb(33, 115, 209)");
        navbar.classList.add("lightNav");
        navbar.classList.remove("darkNav");
    }
};

const dbPathnames = ["/users/dashboard", 
"/users/profile", 
"/users/previous-policies", 
"/users/documents",
"/users/application",
"/users/new-policy"]


// if (window.location.pathname=="/users/dashboard" || window.location.pathname=="/users/profile") {
if (dbPathnames.includes(window.location.pathname)) {
    document.getElementById('login-button').innerText="Log Out";
    document.getElementById('login-button').setAttribute('href', '/users/logout');
}
