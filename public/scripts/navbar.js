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

if (window.location.pathname=="/users/dashboard") {
    document.getElementById('login-button').innerText="Log Out";
    document.getElementById('login-button').setAttribute('href', '/users/logout');
}
