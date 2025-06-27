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
if(element) 
{
    const buttons = Array.from(element.children)

    buttons.forEach((ob) => ob.addEventListener('click', ()=>{
        element.classList.toggle('open')
    }));
}