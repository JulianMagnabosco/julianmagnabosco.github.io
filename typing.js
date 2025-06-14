const options = {
  rootMargin: "0px",
  threshold: 0.01,
};
const delayPerChar = 0.02

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      // console.log(entry)
    }
  });
}, options);

const elements = document.querySelectorAll(".typing");
elements.forEach((e)=>{
  const oldText=e.innerHTML;
  let newText="";
  
  let foundInner=false;
  let delay =0
  for(let i=0;i<oldText.length;i++){
  console.log(oldText[i])
    if(oldText[i]===" "&&oldText[i+1]===" ") {
      continue
    } 
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
  // setTimeout(() => {
  //   observer.observe(e);
  // }, startDelay * 1000);
})

   document.querySelector("body").classList.add("typing-started")
