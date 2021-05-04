
const dButtons = Array.from(document.getElementsByClassName('dashboard-nav-button'));
const dSections = Array.from(document.getElementsByClassName('dashboard-section'));

function dashboardToggle(e, id) {
    dSections.forEach((sec) => {
        sec.classList.add("hidden");
    });
    dButtons.forEach((button) => {
        button.style.background="rgb(55, 147, 255)";
    });
    e.target.style.background="#1C2541";
    document.getElementById(id).classList.remove("hidden");
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