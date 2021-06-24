// Need:
// a). question content
// b). what is the current state of the application
// c). 


function toggleSection(sectionID, tab) {
    const appSections = Array.from(document.getElementsByClassName('application-section'));
    const tabs = Array.from(document.getElementsByClassName('application-nav-tab'));
    appSections.forEach(element => {
        element.classList.remove('visible');    
    });
    // tabs.forEach(element => {
    //     element.classList.remove(''
    // });
    document.getElementById(sectionID).classList.add('visible');

}

// Search the mongo DB for the current user data
async function mongoSearch(email) {
    const data = {'email': email};
    const result = await fetch('mongoSearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json())
    return result;
}

const userEmail = document.getElementById('dbScript').getAttribute('data-email');

async function loadUser(email) {
    // search in Mongo DB
    const user = await mongoSearch(email);

    return user;
}

function displayVisualProgress(stage) {
    const progressValue = `${stage * 20}%`;
    document.getElementById('progress-bar').style.width=progressValue;
    document.getElementById('progress-value').innerText=progressValue;
}

window.onload = async ()=> {
    let user = await loadUser(userEmail);
    // Determine user stage
    if (user.stage) {
        
        displayVisualProgress(user.stage);

    } else {
        displayVisualProgress(1);
    }


}