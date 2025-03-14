const options = {
  rootMargin: "0px",
  threshold: 0.01,
};
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      writeText(entry.target);
    }
  });
}, options);

let listStrings = [];
const timing = 5;
const timingScale = 2;
const listSections = document.getElementsByClassName("typing");
let index = 0;
for (let i = 0; i < listSections.length; i++) {
  const sectionTiming = timing / listSections[i].innerHTML.length / timingScale;
  const step = sectionTiming <= 0.1 ? 4 : 1;
  if (listSections[i].id == "photo") continue;
  listStrings.push({
    text: listSections[i].innerHTML,
    timing: sectionTiming,
    step: step,
    index: 0,
  });
  const oldNode = document.createElement("span");
  oldNode.classList.add("transparent-part")
  oldNode.innerHTML=listSections[i].innerHTML
  listSections[i].innerHTML=""
  listSections[i].appendChild(oldNode);

  const node = document.createElement("span");
  node.classList.add("visible-part")
  listSections[i].appendChild(node);
  listSections[i].style.position="relative"
  node.style.left=(oldNode.getBoundingClientRect().x-node.getBoundingClientRect().x)+"px"
  node.style.top=(oldNode.getBoundingClientRect().y-node.getBoundingClientRect().y)+"px"
  node.style.width=(oldNode.getBoundingClientRect().width)+"px"
  node.style.height=(oldNode.getBoundingClientRect().height)+"px"
  node.setAttribute("data-id", index);
  observer.observe(node);
  index++;
}

//Write
const regexString = /&lt;([^&]*)&gt;([^&]*)&lt;([^&]*)&gt;/g;
const replaceString = "<$1>$2<$3>";
// const charEnds = ["@#$€/(!?)¿","!?¿@#/()$€","¿)€#/!?@($"];
const charEnds = [
  "8UnIMToHNt",
  "O95jgla55d",
  "HQApfksue4",
  "KhWufqY8JH",
  "OjZGkrdfbs",
  "rIxpGRGaLt",
  "yJpbJjvhgh",
  "yJWwi2Ov6w",
  "9gF4wMgiId",
  "JN5HURC8Cl",
];
const charEndSize = 10;
function writeText(e) {
  const textId = e.getAttribute("data-id")
  const oldTextString = listStrings[textId].text;

  if (oldTextString.length <= listStrings[textId].index) {
    return;
  }

  const maxLen = oldTextString.length - listStrings[textId].index;


  e.innerHTML = oldTextString.substring(0,listStrings[textId].index);

  listStrings[textId].index += listStrings[textId].step;
  
  e.innerHTML = e.innerHTML.replace(regexString, replaceString);

  // console.log(oldTextString.length+" - "+(oldTextString.length+ charEndSize)+" - "+listStrings[textId].index)
  
  if (oldTextString.length > listStrings[textId].index) {
    e.innerHTML +=
      "<span>" +
      charEnds[Math.floor(Math.random() * charEnds.length)].substring(
        0,
        maxLen
      ) +
      "</span>";
  }else{
    return
  }

  setTimeout(() => {
    writeText(e);
  }, listStrings[textId].timing * 1000);
}
