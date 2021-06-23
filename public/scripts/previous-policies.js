// needs methods to query 
// a) current policies and 
// b) expired policies


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

function displayPolicies(policyArray, blockid) {
    policyArray.forEach(e=> {
        let policyDisplay = `
        <div class="dashboard-link-button">
            <h5>${e.title}</h5>
            <p>${e.type}</p>
        </div>
    `;
        document.getElementById(blockid).append(policyDisplay);
    })
}



window.onload = async () => {
    let user = await loadUser(userEmail);

    if (user.previousPolicies.length) {
        displayPolicies(user.currentPolicies, "current-policies");
    } else {
        document.getElementById('current-policies').innerHTML = `<p>You do not currently have a policy with us.</p>`
    }


    if (user.expiredPolicies.length) {
        displayDocs(user.expiredPolicies, "expired-policies");
    } else {
        document.getElementById('expired-policies-section').style.display = 'none';
    }
}