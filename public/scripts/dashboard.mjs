let uriRoot = '';

const ctx = document.getElementById('myChart').getContext('2d');

async function fetchChart(percentage) {
    const uri = uriRoot+'chart';

    const result = fetch(uri, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(percentage)
    }).then(response => response.json()).catch(err=>console.log(err));

    return result;
}

fetchChart('20');
