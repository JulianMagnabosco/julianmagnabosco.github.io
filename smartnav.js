document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

let toggle = false

const element = document.querySelector(".nav-bar")
const buttons = Array.from(element.children)


// button.addEventListener('click', toggleOpen);
buttons.forEach((ob) => ob.addEventListener('click', ()=>{
  element.classList.toggle('open')
}));