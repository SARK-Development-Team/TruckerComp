// This causes the about section to fade in when the user scrolls down

const body=document.getElementsByTagName("body")[0];
const about=document.getElementById("about");
const bottom=document.getElementById("bottom");

body.onscroll = function(){
    if (document.documentElement.scrollTop>=550) {
        about.style.opacity=1;
    }
    if (document.documentElement.scrollTop>=900) {
        bottom.style.opacity=1;
    }

};

