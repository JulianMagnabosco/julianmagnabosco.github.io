import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/src/geometries/TextGeometry.js";
import { FontLoader } from "three/src/loaders/FontLoader.js";

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(20);
// camera.position.setX(-3);
renderer.render(scene, camera);
const canvas = renderer.domElement;

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

const extraSize = 5;
function drawTextPlane(top, bottom, left, right) {

  const geometryPlane = new THREE.PlaneGeometry((right - left )*extraSize, (bottom - top)*extraSize);
  const materialPlane = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometryPlane, materialPlane);

  scene.add(plane);
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
    const plane = drawTextPlane(
      rect.top / window.innerHeight,
      rect.bottom / window.innerHeight,
      rect.left / window.innerWidth,
      rect.right / window.innerWidth
    );
    list.push(plane);
  }
  return list;
}

function positionAllPlanes() {
  const sections = document.getElementsByClassName("section");
  let list = [];
  for (let i = 0; i < sections.length; i++) {
    var rect = sections[i].getBoundingClientRect();
    planes[i].position.y = (rect.top / window.innerHeight) * extraSize *-5;
    planes[i].position.x = (rect.left / window.innerWidth) * extraSize * 5;
    planes[i].position.z = 10;
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
  positionAllPlanes();
}
//Rezize

function rezize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

document.body.onscroll = moveCamera;
document.body.onresize = rezize;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
