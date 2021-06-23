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


window.onload = async () => {
    let user = await loadUser(userEmail);

    try {
        let messages = await queryEvents(userDOT);
        if (messages) displayMessages(messages);
    } catch (err) {
        console.log("no messages");
    }
}