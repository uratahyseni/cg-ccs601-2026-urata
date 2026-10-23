
import * as THREE from 'three';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(4, 3, 6);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene').appendChild(renderer.domElement);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(5, 8, 5);
scene.add(sunlight);

// 5. Trupi i shtepise - cilindri
const houseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 2, 6);
const houseMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc99,
    flatShading: true
});

const house = new THREE.Mesh(houseGeometry, houseMaterial);
house.position.y = 1;
scene.add(house);

// 6. Catia - koni
const roofGeometry = new THREE.ConeGeometry(1.5, 1.3, 6);
const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0xb22222,
    flatShading: true
});

const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 2.65;
scene.add(roof);


const doorGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.08);
const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321
});

const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, 0.4, 1.05);
scene.add(door);

// 8. Dritaret
const windowGeometry = new THREE.BoxGeometry(0.35, 0.35, 0.08);
const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0xadd8e6,
    metalness: 0.1,
    roughness: 0.3
});

const windowLeft = new THREE.Mesh(windowGeometry, windowMaterial);
windowLeft.position.set(-0.65, 1.2, 0.92);
scene.add(windowLeft);

const windowRight = new THREE.Mesh(windowGeometry, windowMaterial);
windowRight.position.set(0.65, 1.2, 0.92);
scene.add(windowRight);

const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x55aa55
});

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.03;
scene.add(ground);


function animate() {
    requestAnimationFrame(animate);

    house.rotation.y += 0.005;
    roof.rotation.y += 0.005;

    renderer.render(scene, camera);
}

animate();

// 11. Pershtatja e madhesise se dritares
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
