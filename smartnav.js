document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
console.log(window.innerWidth)
let toggle = false
const element = document.getElementsByClassName("nav-bar")[0]
const button = document.getElementsByClassName("nav-bar-button")[0]
const otherbuttons = Array.from(element.getElementsByTagName("a"))
console.log(otherbuttons)

function toggleOpen() {
  element.classList.add('open');
  if (toggle) {
    element.classList.remove('open');
  }
  toggle=!toggle
}
function toggleClose() {
  element.classList.remove('open');
}

button.addEventListener('click', toggleOpen);
otherbuttons.forEach((ob) => ob.addEventListener('click', toggleClose));