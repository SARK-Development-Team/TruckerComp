
const delay = ms => new Promise(res => setTimeout(res, ms));

const dButtons = Array.from(document.getElementsByClassName('dashboard-nav-button'));
const dSections = Array.from(document.getElementsByClassName('dashboard-section'));

async function dashboardToggle(e, id) {
    dSections.forEach(async (sec) => {
        sec.style.opacity=0;
        sec.classList.add("hidden");
    });
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
    unToggleForm();
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


async function toggleForm() {
    document.getElementById("userInfoStatic").style.display="none";
    await delay(300);
    document.getElementById("userInfoUpdate").style.display="block";
}

function unToggleForm() {
    document.getElementById("userInfoUpdate").style.display="none";
    document.getElementById("userInfoStatic").style.display="grid";
}

function saveForm() {
    unToggleForm();
}


function requestDocument(data) {
    fetch('/requestDoc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
}

function requestInformation(data) {
    fetch('/requestInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
}

function requestSignature(data) {

    if(true) {
        eversign.open({
            url: "YOUR_EMBEDDED_SIGNING_URL",  //<----replace with correct url
            containerID: "container",
            width: 600,
            height: 600,
            events: {
              loaded: function () {
                console.log("loaded Callback");
              },
              signed: function () {
                console.log("signed Callback");
              },
              declined: function () {
                console.log("declined Callback");
              },
              error: function () {
                console.log("error Callback");
              }
            }
        });
    }
    fetch('/requestSig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
}