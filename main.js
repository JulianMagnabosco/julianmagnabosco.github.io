import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Setup
const scenes = [];
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
  alpha: true,
});
renderer.setClearColor(0x000000, 0);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
const canvas = renderer.domElement;

const clock = new THREE.Clock();

var loader = new GLTFLoader();

//Plane
const segments = 20;
const geometryPlane = new THREE.PlaneGeometry(24, 24, segments, segments);
const materialPlane = new THREE.MeshBasicMaterial({
  color: 0x00acff,
  wireframe: true,
});
geometryPlane.material = materialPlane;
const plane = new THREE.Mesh(geometryPlane, materialPlane);

plane.rotateX(-1.3);
plane.position.set(0, 0, 45);
scene.add(plane);

const heigth = 4;
const moveDist = 0.005;
let dist = 0;

function renderPlane() {
  const vertices = geometryPlane.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x1 = ((i / vertices.length) * (segments + 1)) % 1;
    const y1 = i / vertices.length;
    vertices[i + 2] = perlin.get(x1 * heigth + dist, y1 * heigth);
  }
  dist = dist >= 1000 ? 0 : dist + moveDist;

  geometryPlane.attributes.position.needsUpdate = true;
}


//REnderers
function newScene(id, name) {
  const subscene = new THREE.Scene();
  const subelement = document.getElementById(id);
  const aspect = 1;
  const subcamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  subcamera.position.setZ(2);
  subcamera.position.setY(1);

  subscene.userData.element = subelement;
  subscene.userData.camera = subcamera;
  //Character
  loader.load("/modelos/personaje.glb", function (gltf) {
    const submixer = new THREE.AnimationMixer(gltf.scene);
    const clip = gltf.animations[3];
    submixer.clipAction(clip).play();
    subscene.userData.mixer = submixer;

    subscene.add(gltf.scene);
  });

  const ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 5;
  subscene.add(ambientLight);

  scenes.push(subscene);
}
newScene("canvas1", "");

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

  const delta = clock.getDelta();

  renderer.setClearColor(0x000000, 0);
  renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
  renderer.setScissor(0, 0, canvas.clientWidth, canvas.clientHeight);
  renderer.render(scene, camera);

  renderer.setScissorTest(true);
  renderer.setClearColor(0x000000, 0);

  scenes.forEach((s) => {
    // get the element that is a place holder for where we want to
    // draw the scene
    const element = s.userData.element;

    // get its position relative to the page's viewport
    const rect = element.getBoundingClientRect();

    // check if it's offscreen. If so skip it
    if (
      rect.bottom < 0 ||
      rect.top > renderer.domElement.clientHeight ||
      rect.right < 0 ||
      rect.left > renderer.domElement.clientWidth
    ) {
      return; // it's off screen
    }

    // set the viewport
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const left = rect.left;
    const bottom = renderer.domElement.clientHeight - rect.bottom;

    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);

    const c = s.userData.camera;
    const m = s.userData.mixer;
    c.aspect = width / height;
    c.updateProjectionMatrix();
    //scene.userData.controls.update();
    if(m){
      m.update(delta);
    }

    renderer.render(s, c);
  });
}
animate();
