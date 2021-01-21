// This causes the about section to fade in when the user scrolls down

const body=document.getElementsByTagName("body")[0];
const about=document.getElementById("about");

body.onscroll = function(){
    console.log("scrollin")
    if(document.documentElement.scrollTop>=600) {
        // if (about.do
        about.style.opacity=1;
    }
};

