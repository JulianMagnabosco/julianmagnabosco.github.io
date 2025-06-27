const scrollElements = document.querySelectorAll(".scroll-limit")

scrollElements.forEach((e)=>{
  const text = `<span>${e.innerHTML}</span>`
  e.innerHTML = `<div class="scroll">${text.repeat(30)}</div> <div class="scroll">${text.repeat(30)}</div>`
})