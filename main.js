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

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

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

// Avatar

const jeffTexture = new THREE.TextureLoader().load("jeff.png");

const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: jeffTexture })
);

scene.add(jeff);

// Moon

const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

// scene.add(moon);

//Text
const loader = new THREE.FontLoader();

async function writeText(text) {
  loader.load("Unitblock_Regular.json", function (font) {
    const geometryText = new THREE.TextGeometry(text, {
      font: font,
      size: 1,
      height: 1,
      curveSegments: 10,
      bevelEnabled: false,
      bevelOffset: 0,
      bevelSegments: 1,
      bevelSize: 0.3,
      bevelThickness: 1,
    });
    geometryText.center();
    const materialsText = [
      new THREE.MeshPhongMaterial({ color: 0xffffff }), // front
      new THREE.MeshPhongMaterial({ color: 0x000000 }), // side
    ];
    const textMesh = new THREE.Mesh(geometryText, materialsText);

    const boundingBox = new THREE.Box3().setFromObject(textMesh);
    const size = boundingBox.getSize();

    const extraSize = 2;
    const geometryPlane = new THREE.PlaneGeometry(
      size.x + extraSize,
      size.y + extraSize
    );
    const materialPlane = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometryPlane, materialPlane);
    // const group = new THREE.Group();

    scene.add(plane);
    scene.add(textMesh);
    plane.position.z = 0;
    textMesh.position.z = 0;

    let textPosition = new THREE.Vector3();
    textPosition = textPosition.copy(plane.position).project(camera);
    textPosition.x = ((textPosition.x + 1) * canvas.width) / 2;
    textPosition.y = (-(textPosition.y - 1) * canvas.height) / 2;
    // textPosition.x = Math.round((0.5 + textPosition.x / 2) * (canvas.width / window.devicePixelRatio));
    // textPosition.y = Math.round((0.5 - textPosition.y / 2) * (canvas.height / window.devicePixelRatio));
    console.log(textPosition);

    const name = document.getElementById("name");
    name.style.top = `${textPosition.y}px`;
    name.style.left = `${textPosition.x}px`;
    // scene.add( group );
    return plane;
  });
}

//Forma
// const heartShape = new THREE.Shape();

// heartShape.moveTo(0, 0);
// heartShape.bezierCurveTo(2, 2, 1, 0, 0, 0);
// heartShape.bezierCurveTo(-1, 0, -1, 2, -1, 2);
// heartShape.bezierCurveTo(-1, 2, -1, 2, 1, 2);
// heartShape.bezierCurveTo(2, 2, 2, 1, 2, 1);
// heartShape.bezierCurveTo(4, 2, 1, 0, 1, 0);
// heartShape.bezierCurveTo(2, 0, 1, 1, 1, 1);

// const extrudeSettings = {
//   depth: 1,
//   bevelEnabled: true,
//   bevelSegments: 2,
//   steps: 2,
//   bevelSize: 1,
//   bevelThickness: 1,
// };

// const geometryShape = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
// const meshShape = new THREE.Mesh(geometryShape, material);
// scene.add(meshShape);

const text = await writeText("Hola chavales");

//Positios

moon.position.y = 0;
moon.position.x = 0;

jeff.position.y = -10;
jeff.position.x = 0;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.y = t * 0.01;
  let textPosition = new THREE.Vector3();
  textPosition = textPosition.copy(text.position).project(camera);
  // textPosition.x = ((textPosition.x + 1) * canvas.width) / 2;
  // textPosition.y = (-(textPosition.y - 1) * canvas.height) / 2;
  textPosition.x = Math.round((0.5 + textPosition.x / 2) * (canvas.width / window.devicePixelRatio));
  textPosition.y = Math.round((0.5 - textPosition.y / 2) * (canvas.height / window.devicePixelRatio));
  console.log(t);

  const name = document.getElementById("name");
  name.innerText=textPosition.y+" - "+textPosition.x
  name.style.top = `${textPosition.y-t}px`;
  name.style.left = `${textPosition.x}px`;
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

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
