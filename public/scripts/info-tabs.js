const infoBlurb = document.getElementsByClassName('info-blurb')[0];
const rightTab =document.getElementById('right-tab');
const delay = ms => new Promise(res => setTimeout(res, ms));

var leftTabContent = `
    <h2 class="info-heading">Left Tab Heading</h2>
    <p>It’s your job to keep employees safe at work. However, accidents happen. Sometimes employees get injured or become ill on the job, and that’s why we have Workers Compensation Insurance.
    <p>This insurance covers medical costs and lost wages, as well as things like rehabilitation or physical therapy. It’s mandatory in many states, and highly recommended for all employers.</p>
    <p>Read on to find out more about this type of coverage and what your business should look for in a policy.</p> 
`

var centerTabContent = `
    <h2 class="info-heading">Center Tab Heading</h2>
    <p>Paragraph 1 ###################</p> 
    <p>Paragraph 2 ###################</p> 
    <p>Paragraph 3 ###################</p> 
`

var rightTabContent = `
    <h2 class="info-heading">Right Tab Heading</h2>
    <p>Paragraph 1 +++++++++++++++++++</p> 
    <p>Paragraph 2 +++++++++++++++++++</p> 
    <p>Paragraph 3 +++++++++++++++++++</p> 
`

async function changeTab(tabName) {
    if (!document.getElementById(tabName).classList.contains('chosen')) {
        const tabs = document.getElementsByClassName('info-tab')
        for (let i =0; i<tabs.length; i++) {
            tabs[i].classList.remove('chosen');
        }
        document.getElementById(tabName).classList.add('chosen');
        infoBlurb.style.opacity=0;
        await delay(500);
        infoBlurb.innerHTML=window[`${tabName}Content`];
        infoBlurb.style.opacity=1;
    }
}

