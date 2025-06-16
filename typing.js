const options = {
  rootMargin: "0px",
  threshold: 0.01,
};
const delayPerChar = 0.02
const delayPerWord = 0.07
const delayPerElement = 0.2

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      // console.log(entry)
      entry.target.classList.add("start")
    }
  });
}, options);

const typingElements = document.querySelectorAll(".typing");
typingElements.forEach((e)=>{
  const oldText=e.innerHTML.replace(/\n/g," ").replace(/\s+/g," ");
  let newText="";
  
  let foundInner=false;
  let delay =0
  for(let i=0;i<oldText.length;i++){
    if(oldText[i]=="<") {
      foundInner=true;
    } 
    if(foundInner){
      newText+=oldText[i];
    }else{
      delay+=delayPerChar
      newText+=`<span style="animation-delay: ${delay}s">${oldText[i]}</span>`;
    }
    if(oldText[i]==">"){
      foundInner=false;
    }
  }

  e.innerHTML=newText;

  observer.observe(e);
})

const wordElements = document.querySelectorAll(".typing-word");
wordElements.forEach((e)=>{
  const oldText=e.innerHTML.replace(/\n/g," ").replace(/\s+/g," ").split(" ");
  let newText="";
  
  let foundInner=false;
  let delay =0
  for(let i=0;i<oldText.length;i++){
    // if(oldText[i]===" "&&oldText[i+1]===" ") {
    //   continue
    // } 
    if(oldText[i].includes("<")) {
      foundInner=true;
    } 
    if(foundInner){
      newText+=oldText[i]+" ";
    }else{
      delay+=delayPerWord
      newText+=`<span style="animation-delay: ${delay}s">${oldText[i]}</span> `;
    }
    if(oldText[i].includes(">")){
      foundInner=false;
    }
  }

  e.innerHTML=newText;

  observer.observe(e);
})


const listFaded = document.querySelectorAll(".fade-list");
listFaded.forEach((e)=>{
  const children=e.children;
  
  let delay =0
  for(let i=0;i<children.length;i++){
    delay+=delayPerElement
    children[i].style=`animation-delay: ${delay}s`;
  }

  observer.observe(e);
})

document.querySelector("body").classList.add("typing-started")
