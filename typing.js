
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
    const size = sectionTiming <= 0.1 ? 4 : 1;
    if (listSections[i].id == "photo") continue;
    listStrings.push({
      text: listSections[i].innerHTML,
      timing: sectionTiming,
      size: size,
      index: 0,
    });
  
    listSections[i].innerHTML = "";
    listSections[i].setAttribute("data-id", index);
    observer.observe(listSections[i]);
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
    let oldTextString = listStrings[e.getAttribute("data-id")].text;
  
    const maxLen =
      listStrings[e.getAttribute("data-id")].text.length -
      listStrings[e.getAttribute("data-id")].index;
  
    if (
      oldTextString.length + charEndSize <=
      listStrings[e.getAttribute("data-id")].index
    ) {
      e.innerHTML = e.innerHTML.replace(regexString, replaceString);
      // console.log(e.getAttribute("data-id")+ " - " +oldTextString.length + " - " +listStrings[e.getAttribute("data-id")].timing);
      return;
    }
  
    e.innerHTML = oldTextString.substring(
      0,
      listStrings[e.getAttribute("data-id")].index
    );
  
    if (oldTextString.length > listStrings[e.getAttribute("data-id")].index) {
      e.innerHTML +=
        "<span>" +
        charEnds[Math.floor(Math.random() * charEnds.length)].substring(
          0,
          maxLen
        ) +
        "</span>";
    }
    listStrings[e.getAttribute("data-id")].index +=
      listStrings[e.getAttribute("data-id")].size;
  
    e.innerHTML = e.innerHTML.replace(regexString, replaceString);
  
    setTimeout(() => {
      writeText(e);
    }, listStrings[e.getAttribute("data-id")].timing * 1000);
  }
  