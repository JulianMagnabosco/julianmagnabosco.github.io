import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/src/geometries/TextGeometry.js";
import { FontLoader } from "three/src/loaders/FontLoader.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.setZ(50);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
const canvas = renderer.domElement;

// Background

// const spaceTexture = new THREE.TextureLoader().load("space.jpg");
// scene.background = spaceTexture;

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

//Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  let [x, y, z] = [0, 0, 0];

  x = THREE.MathUtils.randFloatSpread(100);
  y = THREE.MathUtils.randFloatSpread(200);
  z = THREE.MathUtils.randFloatSpread(100);

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

//asdasd
const options = {
  rootMargin: "0px",
  threshold: 0.01,
};
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      writeText(entry.target,"&&&");
    }
  });
}, options);
const listSections = document.getElementsByTagName("section");
for (let i = 0; i < listSections.length; i++) {
  for (let j = 0; j < listSections[i].children.length; j++) {
    const newDiv = document.createElement("div")
    newDiv.setAttribute("class","newtext")
  
    const oldDiv = document.createElement("div")
    oldDiv.setAttribute("class","oldtext")
    oldDiv.innerHTML=listSections[i].children[j].innerHTML
  
    listSections[i].children[j].innerHTML=""
    listSections[i].children[j].appendChild(oldDiv);
    listSections[i].children[j].appendChild(newDiv);
    observer.observe(listSections[i].children[j]);
  }
}

//Write
function writeText(e,textReplace) {
  let oldTextString=String(textReplace)
  if(oldTextString.includes("&&&")){
    console.log(oldTextString);
    oldTextString = e.getElementsByClassName("oldtext")[0].innerHTML;
    console.log(oldTextString);
  }
  e.getElementsByClassName("newtext")[0].innerHTML += oldTextString.charAt(0);
  // e.getElementsByClassName("newtext")[0].innerText = e.getElementsByClassName("newtext")[0].innerText.replace("&",">");
  
  oldTextString = oldTextString.slice(1);
  e.getElementsByClassName("oldtext")[0].innerHTML = oldTextString
  // if(oldTextString.includes("unbr")) console.log(oldTextString);
  if(oldTextString=="") return;
  setTimeout(() => {
    writeText(e);
  }, 100);
}

//Rezize

function rezize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

document.body.onresize = rezize;

// Animation Loop

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
