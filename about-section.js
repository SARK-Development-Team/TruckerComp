// This causes the about section to fade in when the user scrolls down

const body=document.getElementsByTagName("body")[0];
// const about=document.getElementById("about");

const float1 = document.getElementById('floating-tile1')
const float2 = document.getElementById('floating-tile2')
const float3 = document.getElementById('floating-tile3')
const info=document.getElementById("info");


// I overtly set these values at the beginning in order to guarantee that toggleBlurb functions on the first click 
const blurb1 = document.getElementById('blurb1');
const blurb2 = document.getElementById('blurb2');
blurb1.style.opacity=1;
blurb2.style.opacity=0;

body.onscroll = function(){
    if (document.documentElement.scrollTop>=550) {
        setTimeout(function () {
            float1.style.top = 0;
            float1.style.opacity =1;
        }, 200);
        setTimeout(function () {
            float2.style.top = 0;
            float2.style.opacity =1;
        }, 1400);
        setTimeout(function () {
            float3.style.top = 0;
            float3.style.opacity =1;
        }, 2600);
    }
    if (document.documentElement.scrollTop>=1000) {
        info.style.opacity=1;
    }

};

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