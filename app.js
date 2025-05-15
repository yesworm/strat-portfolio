import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let autoRotate = true;
const rotationSpeed = 0.005;
let scene, camera, renderer, controls, model;
let hasClicked = false;

const canvas = document.getElementById('head-canvas');
scene = new THREE.Scene();
scene.background = null;

camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 1;

renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 0.5;
controls.maxDistance = 2;

const loader = new GLTFLoader();
loader.load(
  './assets/3dscan.glb',
  function (gltf) {
    model = gltf.scene;

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    center.y -= -0.9;
    model.position.sub(center);
    camera.position.y = 0.1;
    camera.lookAt(0, 0.5, 0);
    model.scale.set(3, 3, 3);

    scene.add(model);
  },
  undefined,
  function (error) {
    console.error('An error occurred loading the model:', error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  if (model && autoRotate) {
    model.rotation.y += rotationSpeed;
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});