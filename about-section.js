// This causes the about section to fade in when the user scrolls down

const body=document.getElementsByTagName("body")[0];
// const about=document.getElementById("about");

const float1 = document.getElementById('floating-tile1')
const float2 = document.getElementById('floating-tile2')
const float3 = document.getElementById('floating-tile3')
const info=document.getElementById("info");

body.onscroll = function(){
    if (document.documentElement.scrollTop>=550) {
        float1.style.top = 0;
        float2.style.top = 0;
        float3.style.top = 0;
    }
    if (document.documentElement.scrollTop>=1000) {
        info.style.opacity=1;
    }

};

// This toggles the display of the two-item info blurb
function toggleBlurb() {
    const blurb1 = document.getElementById('blurb1');
    const blurb2 = document.getElementById('blurb2');
    if (blurb1.style.display=='block') {
        console.log('trigger1');
        blurb1.style.display='none';
        blurb1.style.opacity=0;
        blurb2.style.display='block';
        blurb2.style.opacity=1;
    } else {
        console.log('trigger2');
        blurb1.style.display='block';
        blurb1.style.opacity=1;
        blurb2.style.display='none';
        blurb2.style.opacity=0;
    }
}