
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 3, 8);
camera.lookAt(0, 0, 0);

// Ndriçimi
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 150);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Dielli
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcc00,
    wireframe: true
});

const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

// Orbita e Tokës
const earthOrbit = new THREE.Object3D();
scene.add(earthOrbit);

// Toka
const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({
    color: 0x2255ff,
    wireframe: true
});

const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.position.x = 3;
earthOrbit.add(earthMesh);

// Orbita e Hënës, brenda Tokës
const moonOrbit = new THREE.Object3D();
earthMesh.add(moonOrbit);

// Hëna
const moonGeometry = new THREE.SphereGeometry(0.15, 24, 24);
const moonMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa
});

const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.x = 0.9;
moonOrbit.add(moonMesh);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.getElementById('scene').appendChild(renderer.domElement);

// Kontrollet e kamerës
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animacioni
function animate() {
    requestAnimationFrame(animate);

    sunMesh.rotation.y += 0.005;
    earthOrbit.rotation.y += 0.01;
    earthMesh.rotation.y += 0.02;
    moonOrbit.rotation.y += 0.04;

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Përshtatja e madhësisë së dritares
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
