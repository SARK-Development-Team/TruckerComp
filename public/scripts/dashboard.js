
const delay = ms => new Promise(res => setTimeout(res, ms));

const dButtons = Array.from(document.getElementsByClassName('dashboard-nav-button'));
const dSections = Array.from(document.getElementsByClassName('dashboard-section'));

async function dashboardToggle(e, id) {
    dSections.forEach(async (sec) => {
        sec.style.opacity=0;
        sec.classList.add("hidden");
    });
    unToggleForm();
    dButtons.forEach((button) => {
        button.style.background="rgb(55, 147, 255)";
    });
    if (e.target.nodeName=="DIV") {;
        e.target.style.background="#1C2541";
    } else {
        e.target.parentNode.style.background="#1C2541";
    }
    document.getElementById(id).classList.remove("hidden")
    await delay(300);
    document.getElementById(id).style.opacity=1;
}


// Upload files and display the title
document.getElementById('file-upload').addEventListener("change", (event) => {
    const file = URL.createObjectURL(event.target.files[0]);
    const aTag = document.createElement('a');
    aTag.setAttribute("href", file);
    aTag.setAttribute("target", "_blank");
    aTag.innerText = event.target.files[0].name;
    document.getElementById('file-preview').append(aTag);
});


function toggleForm() {
    document.getElementById("userInfoStatic").style.display="none";
    document.getElementById("userInfoUpdate").style.display="block";
}

function unToggleForm() {
    document.getElementById("userInfoUpdate").style.display="none";
    document.getElementById("userInfoStatic").style.display="grid";
}

function saveForm() {
    unToggleForm();
}