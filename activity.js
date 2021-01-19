// This section handles changing the carousel's active slide and the color of the icons
// Todo: add animation

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName("slide");
  const circles = document.getElementsByClassName("fa-circle");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < circles.length; i++) {
      circles[i].className = circles[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  circles[slideIndex-1].className += " active";
}

// This section handles changing the color of a tile that has been clicked on

const tiles = document.getElementsByClassName("tile");

// tiles.onclick = selectTile;

// function selectTile(n) {

// }


