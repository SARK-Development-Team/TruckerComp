// import Chart from '/chart.js';
var Chart = require('chart.js');

// RUN this command in CLI when updating this file:
// browserify public/scripts/dashboard.js -o public/scripts/bundle.js
const stage = document.getElementById('stage').nodeValue;

const ctx = document.getElementById('myChart').getContext('2d');

const percentage = stage*20 || 50;

var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [{
            label: '% complete',
            data: [percentage, 100-percentage],
            backgroundColor: [
                'red',
                'white'
            ],
            borderColor: [
                'black',
                'black'
            ],
            borderWidth: 1
        }],
        labels: ['Complete']
    },
    options: {
        legend: {
            display: true,
            position: 'bottom'
        },
        animation: {
            animateRotate: true
        },
        responsive: false
    }
});
