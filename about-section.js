// This causes the about section to fade in when the user scrolls down

const body=document.getElementsByTagName("body")[0];
// const about=document.getElementById("about");

// I overtly set these values at the beginning in order to guarantee that toggleBlurb functions on the first click 
const blurb1 = document.getElementById('blurb1');
const blurb2 = document.getElementById('blurb2');
blurb1.style.opacity=1;
blurb2.style.opacity=0;

// This toggles the display of the two-item info blurb
function toggleBlurb() {

    if (blurb1.style.opacity!=1) {
        blurb2.style.opacity=0;
        setTimeout(() => {
            blurb1.style.opacity=1;
        }, 300);

    } else {
        blurb1.style.opacity=0;
        setTimeout(() => {
            blurb2.style.opacity=1;
        }, 300);
    }
}