const startDelay = 1
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
  if (listSections[i].id == "photo") continue;
  const sectionTiming = timing / listSections[i].innerHTML.length / timingScale;
  const step = sectionTiming <= 0.1 ? 4 : 1;
  listStrings.push({
    text: listSections[i].innerHTML,
    timing: sectionTiming,
    step: step,
    index: 0,
  });

  const transparentElement = document.createElement("span");
  transparentElement.classList.add("transparent-part")
  transparentElement.innerHTML = listSections[i].innerHTML
  listSections[i].innerHTML = ""
  listSections[i].appendChild(transparentElement);

  const visibleElement = document.createElement("span");
  visibleElement.classList.add("visible-part")
  listSections[i].appendChild(visibleElement);
  listSections[i].style.position = "relative"
  visibleElement.style.left = (transparentElement.getBoundingClientRect().x - visibleElement.getBoundingClientRect().x) + "px"
  if (window.getComputedStyle(listSections[i], null).getPropertyValue('padding-top') != "0px") {
    visibleElement.style.top = (transparentElement.getBoundingClientRect().y - visibleElement.getBoundingClientRect().y) + "px"
  }
  visibleElement.style.width = (transparentElement.offsetWidth + 4) + "px"
  visibleElement.style.height = (transparentElement.offsetHeight + 4) + "px"
  visibleElement.setAttribute("data-id", index);
  setTimeout(() => {
    observer.observe(visibleElement);
  }, startDelay * 1000);
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


  e.innerHTML = oldTextString.substring(0, listStrings[textId].index);

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
  } else {
    return
  }

  setTimeout(() => {
    writeText(e);
  }, listStrings[textId].timing * 1000);
}
const oldRezize = document.body.onresize
function rezizeTyping() {
  oldRezize()
  for (let i = 0; i < listSections.length; i++) {
    if (listSections[i].id == "photo") continue;
    const transparentElement = listSections[i].getElementsByClassName("transparent-part")[0];
    const visibleElement = listSections[i].getElementsByClassName("visible-part")[0];
    visibleElement.style.width = (transparentElement.offsetWidth + 4) + "px"
    visibleElement.style.height = (transparentElement.offsetHeight + 4) + "px"
  }
}
document.body.onresize = rezizeTyping;
