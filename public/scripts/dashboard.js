

// Upload files and display the title
document.getElementById('file-upload').addEventListener("change", (event) => {
    const file = URL.createObjectURL(event.target.files[0]);
    const aTag = document.createElement('a')
    aTag.setAttribute("href", file)
    aTag.setAttribute("target", "_blank")
    aTag.innerText = event.target.files[0].name
    document.getElementById('file-preview').append(aTag);
});