import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { TextGeometry } from "three/src/geometries/TextGeometry.js";
// import { FontLoader } from "three/src/loaders/FontLoader.js";
// import {
//   CSS3DRenderer,
//   CSS3DObject,
// } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import {
  GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader.js";

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
  alpha: true
});
renderer.setClearColor( 0x000000, 0 )

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
const canvas = renderer.domElement;

// Background

// const spaceTexture = new THREE.TextureLoader().load("space.jpg");
// scene.background = spaceTexture;

// Lights

// const pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 5
scene.add(ambientLight);

//Character
var loader = new GLTFLoader();
loader.load(
   "/modelos/personaje.glb",
   function ( gltf ) {
    // scene.add( gltf.scene );
      gltf.scene.children.forEach(element => {
        if(element.name=="Armature") {
          console.log(element)
          element.name = "Armature";
          element.position.set ( 0, 0, 48 );
          scene.add(element)
        }
      });
      
      // bus.body = gltf.scene.children[0];
      // bus.body.name = "char";
      // bus.body.rotation.set ( 0, -1.5708, 0 );
      // bus.body.scale.set (scale,scale,scale);
      // bus.body.position.set ( 0, 3.6, 0 );
      // bus.body.castShadow = true;
   },
);

//Plane
const segments = 20;
const geometryPlane = new THREE.PlaneGeometry(24, 24, segments, segments);
// const texturePlane = new THREE.TextureLoader().load('tileset.png' ); 
// texturePlane.wrapS  = THREE.RepeatWrapping;
// texturePlane.wrapT  = THREE.RepeatWrapping;
// texturePlane.repeat.set( segments, segments );
const materialPlane = new THREE.MeshBasicMaterial( { color:0x00acff, wireframe:true } );
geometryPlane.material = materialPlane
const plane = new THREE.Mesh( geometryPlane, materialPlane );

// const wireframe = new THREE.WireframeGeometry(geometryPlane);
// const line = new THREE.LineSegments(wireframe, materialPlane);

plane.rotateX(-1.3);
plane.position.set(0, 0, 45);
scene.add(plane);

const heigth = 4;
const moveDist = 0.005;
let dist = 0;

function renderPlane() {
  const vertices = geometryPlane.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x1 = ((i / vertices.length) * (segments + 1))%1;
    const y1 = i / vertices.length;
    vertices[i+2] = perlin.get(x1 * heigth+dist, y1 * heigth);
  }
  dist = dist >= 1000 ? 0 : dist + moveDist;

  geometryPlane.attributes.position.needsUpdate = true;
  // console.log(dist)
}

//Stars
// function addStar() {
//   const geometry = new THREE.SphereGeometry(0.25, 24, 24);
//   const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
//   const star = new THREE.Mesh(geometry, material);

//   let [x, y, z] = [0, 0, 0];

//   x = THREE.MathUtils.randFloatSpread(100);
//   y = THREE.MathUtils.randFloatSpread(200);
//   z = THREE.MathUtils.randFloatSpread(100);

//   star.position.set(x, y, z);
//   scene.add(star);
// }

// Array(200).fill().forEach(addStar);

//Typing
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
  const sectionTiming = timing / listSections[i].innerHTML.length /timingScale
  const size = sectionTiming<=0.1?4:1
  if(listSections[i].id=="photo") continue
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

  const maxLen = listStrings[e.getAttribute("data-id")].text.length-listStrings[e.getAttribute("data-id")].index

  if (oldTextString.length + charEndSize <=listStrings[e.getAttribute("data-id")].index) {
    e.innerHTML = e.innerHTML.replace(regexString, replaceString);
    // console.log(e.getAttribute("data-id")+ " - " +oldTextString.length + " - " +listStrings[e.getAttribute("data-id")].timing);
    return;
  }

  e.innerHTML = oldTextString.substring(0,listStrings[e.getAttribute("data-id")].index);

  if (oldTextString.length > listStrings[e.getAttribute("data-id")].index) {
    e.innerHTML +=
      "<span>" +
      charEnds[Math.floor(Math.random() * charEnds.length)].substring(0, maxLen) +
      "</span>";
  }
  listStrings[e.getAttribute("data-id")].index+=listStrings[e.getAttribute("data-id")].size;

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
