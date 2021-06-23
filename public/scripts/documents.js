// needs methods to query 
// a) submitted documents and 
// b) documents that need to be submitted




async function loadUser(email) {
    // search in Mongo DB
    const user = await mongoSearch(email);

    return user;
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



function displayDocs(documentArray, blockid) {
    documentArray.forEach(e=> {
        let docDisplay = `
        <div class="dashboard-link-button">
            <h5>${e.title}</h5>
            <p>${e.type}</p>
        </div>
    `;
        document.getElementById(blockid).append(docDisplay);
    })
}

window.onload = async () => {
    let user = await loadUser(userEmail);
    if (user.submittedDocuments.length) {
        displayDocs(user.submittedDocuments, "submitted-docs");
    } else {
        document.getElementById('submitted-docs').innerHTML = `<p>No documents have been submitted.</p>`
    }


    if (user.neededDocuments.length) {
        displayDocs(user.neededDocuments, "needed-docs");
    } else {
        document.getElementById('needed-docs').innerHTML = `<p>There are no documents that are required at this time.</p>`
    }

}