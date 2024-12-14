import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/src/geometries/TextGeometry.js";
import { FontLoader } from "three/src/loaders/FontLoader.js";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

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

const cssrenderer = new CSS3DRenderer();
cssrenderer.setSize( window.innerWidth, window.innerHeight );
cssrenderer.domElement.id="renderer"
container.appendChild( cssrenderer.domElement );

// Background

const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

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

let size = 0.1 * (canvas.width/1000);
function drawTextPlane(element) {
  const plane = new CSS3DObject( element );
  plane.scale.x = size;
  plane.scale.y = size;
  plane.scale.z = size;
  scene.add( plane );
  return plane;
}

function drawAllPlanes() {
  const sections = document.getElementsByClassName("section");
  let list = [];
  for (let i = 0; i < sections.length; i++) {
    var rect = sections[i].getBoundingClientRect();
    // const plane = drawTextPlane(
    //   rect.top / canvas.height,
    //   rect.bottom / canvas.height,
    //   rect.left / canvas.width,
    //   rect.right / canvas.width
    // );
    const plane = drawTextPlane(sections[i]);
    list.push(plane);
  }
  return list;
}

function positionAllPlanes() {
  size = 0.1 * (canvas.width/1000);
  const sections = document.getElementsByClassName("section");
  let list = [];
  for (let i = 0; i < sections.length; i++) {
    var rect = sections[i].getBoundingClientRect();
    planes[i].scale.x = size;
    planes[i].scale.y = size;
    planes[i].scale.z = size;
    // planes[i].position.y = (rect.top / window.innerHeight) * extraSize *-5;
    // planes[i].position.x = (rect.left / window.innerWidth) * extraSize * 5;
    // planes[i].position.z = 10;
  }
  return list;
}
const planes = drawAllPlanes();

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  // camera.position.y = t * 0.01;

  // if(!text) return
  // let textPosition = new THREE.Vector3();
  // textPosition = textPosition.copy(text.position).project(camera);
  // textPosition.x = ((textPosition.x + 1) * canvas.width) / 2;
  // textPosition.y = (-(textPosition.y - 1) * canvas.height) / 2;
  // textPosition.x = Math.round(
  //   (0.5 + textPosition.x / 2) * (canvas.width / window.devicePixelRatio)
  // );
  // textPosition.y = Math.round(
  //   (0.5 - textPosition.y / 2) * (canvas.height / window.devicePixelRatio)
  // );
  // console.log(t);

  // const name = document.getElementById("name");
  // name.innerText = textPosition.y + " - " + textPosition.x;
  // name.style.top = `${textPosition.y - t}px`;
  // name.style.left = `${textPosition.x}px`;
  positionAllPlanes();
  console.log("pos testing");
  const sections = document.getElementsByClassName("section");
  for (let i = 0; i < sections.length; i++) {
    var rect = sections[i].getBoundingClientRect();
    // console.log("pos",rect.top,rect.bottom,rect.left,rect.right)
    // console.log("real",rect.bottom-rect.top,rect.right-rect.left)
    // console.log("traslate",rect.top/canvas.width ,rect.left/canvas.height )
    // console.log("scale",(rect.bottom-rect.top)/canvas.width ,(rect.right-rect.left)/canvas.height )
    console.log("plane", planes[i].position.x, planes[i].position.y);
  }
}
//Rezize

function rezize() {
  positionAllPlanes()
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  cssrenderer.setSize(window.innerWidth, window.innerHeight);
}

document.body.onscroll = moveCamera;
document.body.onresize = rezize;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  cssrenderer.render(scene, camera);
}

animate();
