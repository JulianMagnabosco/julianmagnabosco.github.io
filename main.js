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
    if(entry.intersectionRatio > 0){
      writeText(entry.target)
    };
  });
}, options);
const listSections = document.getElementsByTagName("section");
for (let i = 0; i < listSections.length; i++) {
  listSections[i].appendChild(document.createElement("div"))
  observer.observe(listSections[i]);
}

//Write
function writeText(e){
  e.getElementsByTagName("div")[0].innerHTML+=e.innerHTML[0]
  let stringText = e.innerHTML
  stringText = stringText.slice(1)
  e.innerHTML=stringText
  console.log(e.getElementsByTagName("div")[0])
  setTimeout(()=>{writeText(e);}, 500);
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
