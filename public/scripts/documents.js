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


window.onload = async () => {
    let user = await loadUser(userEmail);


}