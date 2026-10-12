import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./style.css";

const container = document.querySelector("#scene-container");
const canvas = document.querySelector("#hero-scene");
const loadingLabel = document.querySelector("#scene-loading");

if (container && canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.08, 6.3);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x000000, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x536080, 2.25));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(-3, 5, 6);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x16d9ca, 1.2);
  rimLight.position.set(4, 1, -3);
  scene.add(rimLight);

  const pointer = new THREE.Vector2();
  let model;
  let targetRotationX = 0;
  let targetRotationY = -0.18;

  const resizeScene = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const resizeObserver = new ResizeObserver(resizeScene);
  resizeObserver.observe(container);
  resizeScene();

  container.addEventListener("pointermove", (event) => {
    const bounds = container.getBoundingClientRect();
    pointer.x = (event.clientX - bounds.left) / bounds.width - 0.5;
    pointer.y = (event.clientY - bounds.top) / bounds.height - 0.5;
    targetRotationY = -0.18 + pointer.x * 0.65;
    targetRotationX = pointer.y * 0.2;
  });
  container.addEventListener("pointerleave", () => {
    targetRotationX = 0;
    targetRotationY = -0.18;
  });
  let mixer, clips;
  new GLTFLoader().load(
    "/models/jules.glb",
    (gltf) => {
      model = new THREE.Group();
      model.add(gltf.scene);
      const bounds = new THREE.Box3().setFromObject(model);
      const center = bounds.getCenter(new THREE.Vector3());
      const size = bounds.getSize(new THREE.Vector3());
      const largestSide = Math.max(size.x, size.y, size.z);
      gltf.scene.position.sub(center);
      model.scale.setScalar(3.25 / largestSide);
      model.position.y += 0.12;

      mixer = new THREE.AnimationMixer(gltf.scene);
      clips = gltf.animations;

      const clip = THREE.AnimationClip.findByName(clips, "IdlePose");
      const action = mixer.clipAction(clip);
      action.play();

      scene.add(model);
      loadingLabel?.remove();
    },
    undefined,
    (error) => {
      console.error("No se pudo cargar jules.glb", error);
      if (loadingLabel) loadingLabel.textContent = "MODELO NO DISPONIBLE";
    },
  );

  const clock = new THREE.Clock();
  let elapsed = 0;
  const render = () => {
    const delta = clock.getDelta();
    elapsed += delta;
    if (model) {
      model.rotation.y += (targetRotationY + Math.sin(elapsed * 0.7) * 0.035 - model.rotation.y) * 0.045;
      model.rotation.x += (targetRotationX - model.rotation.x) * 0.045;
      model.position.y = 0.12 + Math.sin(elapsed * 1.3) * 0.055;
    }
    if (mixer) {
      mixer.update(delta);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();
}

// Other stuff
// const darkmodeToggle = document.querySelector('.darkmode-toggle');
// darkmodeToggle?.addEventListener('click', () => {
// 	const enabled = document.body.classList.toggle('darkmode-enabled');
// 	darkmodeToggle.setAttribute('aria-pressed', String(enabled));

// 	const label = darkmodeToggle.querySelector('.darkmode-label');
// 	if (label) label.textContent = enabled ? 'Darkmode ON' : 'Darkmode OFF';
// });
// const mq = window.matchMedia('(prefers-color-scheme: dark)');

// console.log(mq.matches ? 'dark' : 'light');

// // Escuchar cambios en vivo
// mq.addEventListener('change', (e) => {
//   console.log(e.matches ? 'dark' : 'light');
// });

const root = document.documentElement;
const mq = matchMedia("(prefers-color-scheme: dark)");
const saved = localStorage.getItem("theme");
if (saved) root.dataset.theme = saved;
const darkmodeToggle = document.querySelector('.darkmode-toggle');
darkmodeToggle.onclick = () => {
  const current = root.dataset.theme || (mq.matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
  
	darkmodeToggle.classList.toggle("on")
};

document.querySelectorAll('.ticker').forEach(ticker => {
  const track = ticker.querySelector('.ticker-track');
  const group = track.querySelector('.ticker-group');
  const original = group.innerHTML;

  // repetir el contenido hasta que el grupo sea más ancho que el ticker
  while (group.scrollWidth < ticker.offsetWidth) {
    group.insertAdjacentHTML('beforeend', original);
  }

  // segunda copia idéntica para el loop
  const clone = group.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);
});

const copyButton = document.querySelector(".copy-link");
copyButton?.addEventListener("click", async () => {
  const label = copyButton.querySelector("span");
  try {
    await navigator.clipboard.writeText(window.location.href);
    if (label) label.textContent = "COPIADO ✓";
  } catch {
    if (label) label.textContent = "COPIA DESDE LA BARRA";
  }
  window.setTimeout(() => {
    if (label) label.textContent = "↗";
  }, 2200);
});
