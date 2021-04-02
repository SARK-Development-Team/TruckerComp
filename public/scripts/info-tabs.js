const infoBlurb = document.getElementsByClassName('info-blurb')[0];
const rightTab =document.getElementById('right-tab');
const delay = ms => new Promise(res => setTimeout(res, ms));

var leftTabContent = `
    <h2>Left Tab Heading</h2>
    <p>Paragraph 1 -------------------</p> 
    <p>Paragraph 2 -------------------</p> 
    <p>Paragraph 3 -------------------</p> 
`

var centerTabContent = `
    <h2>Center Tab Heading</h2>
    <p>Paragraph 1 ###################</p> 
    <p>Paragraph 2 ###################</p> 
    <p>Paragraph 3 ###################</p> 
`

var rightTabContent = `
    <h2>Right Tab Heading</h2>
    <p>Paragraph 1 +++++++++++++++++++</p> 
    <p>Paragraph 2 +++++++++++++++++++</p> 
    <p>Paragraph 3 +++++++++++++++++++</p> 
`

async function changeTab(tabName) {
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

