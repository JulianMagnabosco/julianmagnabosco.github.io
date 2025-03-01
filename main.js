import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { TextGeometry } from "three/src/geometries/TextGeometry.js";
// import { FontLoader } from "three/src/loaders/FontLoader.js";
// import {
//   CSS3DRenderer,
//   CSS3DObject,
// } from "three/examples/jsm/renderers/CSS3DRenderer.js";
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

const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

// Lights

// const pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(5, 5, 5);

// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(pointLight, ambientLight);

//Plane
const segments = 20;
const geometryPlane = new THREE.PlaneGeometry(24, 24, segments, segments);
const texturePlane = new THREE.TextureLoader().load('tileset.png' ); 
texturePlane.wrapS  = THREE.RepeatWrapping;
texturePlane.wrapT  = THREE.RepeatWrapping;
texturePlane.repeat.set( segments, segments );
const materialPlane = new THREE.MeshBasicMaterial( { map:texturePlane } );
geometryPlane.material = materialPlane
const plane = new THREE.Mesh( geometryPlane, materialPlane );

// const wireframe = new THREE.WireframeGeometry(geometryPlane);
// const line = new THREE.LineSegments(wireframe, materialPlane);

plane.rotateX(-45);
plane.position.set(0, 0, 45);
scene.add(plane);

const heigth = 4;
const moveDist = 0.001;
let dist = 0;

function renderPlane() {
  const vertices = geometryPlane.attributes.position.array;
  for (let i = 2; i < vertices.length; i += 3) {
    const x1 = ((i / vertices.length) * (segments + 1) + dist);
    const y1 = i / vertices.length;
    vertices[i] = perlin.get(x1 * heigth, y1 * heigth);
  }
  dist = dist >= 1 ? 0 : dist + moveDist;

  geometryPlane.attributes.position.needsUpdate = true;
  // console.log(dist)
}

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

//Typing
let listStrings = [];
const timing = 2;
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

const listSections = document.getElementsByTagName("section");
let index = 0;
for (let i = 0; i < listSections.length; i++) {
  for (let j = 0; j < listSections[i].children.length; j++) {
    listStrings.push({
      text: listSections[i].children[j].innerHTML,
      timing: timing / listSections[i].children[j].innerHTML.length,
      index: 0,
    });

    listSections[i].children[j].innerHTML = "";
    listSections[i].children[j].setAttribute("data-id", index);
    observer.observe(listSections[i].children[j]);
    index++;
  }
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

  const maxLen = listStrings[e.getAttribute("data-id")].text.length-listStrings[e.getAttribute("data-id")].index

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
      charEnds[Math.floor(Math.random() * charEnds.length)].substring(0, maxLen) +
      "</span>";
  }
  listStrings[e.getAttribute("data-id")].index++;

  e.innerHTML = e.innerHTML.replace(regexString, replaceString);

  setTimeout(() => {
    writeText(e);
  }, listStrings[e.getAttribute("data-id")].timing * 1000);
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
  renderPlane();
  renderer.render(scene, camera);
}
animate();
