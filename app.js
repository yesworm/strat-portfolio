import * as THREE from 'https://esm.sh/three@0.157.0';
import { OrbitControls } from 'https://esm.sh/three@0.157.0/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'https://esm.sh/three@0.157.0/examples/jsm/loaders/GLTFLoader';

let autoRotate = true;
const rotationSpeed = 0.005;
let scene, camera, renderer, controls, model;
let hasClicked = false;

const canvas = document.getElementById('head-canvas');

scene = new THREE.Scene();
scene.background = null;

// Calculate the correct aspect ratio for the left half of screen
const canvasWidth = window.innerWidth * 0.5;
const canvasHeight = window.innerHeight;

camera = new THREE.PerspectiveCamera(
    75,
    canvasWidth / canvasHeight,  // Use the actual canvas aspect ratio
    0.1,
    1000
);

// Adjust camera for left-side positioning
camera.position.set(0, 0, 1);

renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
// Set renderer size to only cover the left half of the screen
renderer.setSize(canvasWidth, canvasHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(0, 3, 1);
scene.add(directionalLight);

const loader = new GLTFLoader();
console.log('Attempting to load 3D model...');

loader.load(
    './assets/3dscan.glb',
    function (gltf) {
        console.log('3D model loaded successfully.');
        model = gltf.scene;
        
        // Calculate bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Center the model properly
        model.position.copy(center).multiplyScalar(-1);
        
        // Adjust Y position
        model.position.y += 0.1;
        
        // Scale the model slightly larger since it's in a smaller viewport
        model.scale.set(0.6, 0.6, 0.6);
        
        // Position camera based on model size
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
        
        camera.position.set(0, 0, cameraZ * 1.5);
        camera.lookAt(0, 0, 0);
        
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
    
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    // Calculate canvas dimensions
    const canvasWidth = window.innerWidth * 0.5;
    const canvasHeight = window.innerHeight;
    
    // Update camera aspect for the left half of screen
    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();
    
    // Resize renderer to cover left half of screen
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});