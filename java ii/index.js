
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Krijimi i skenes
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);

// 2. Kamera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 8, 16);
camera.lookAt(0, 0, 0);

// 3. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('scene').appendChild(renderer.domElement);

// 4. Kontrolli i kameres
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 5. Ndricimi
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const sunlight = new THREE.PointLight(0xffffff, 3);
scene.add(sunlight);

// 6. Dielli
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffcc00 })
);
scene.add(sun);

// Funksioni per krijimin e planeteve
function createPlanet(size, color, distance) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color });
    const planet = new THREE.Mesh(geometry, material);

    planet.position.x = distance;
    scene.add(planet);

    return planet;
}

// 7. Toka
const earth = createPlanet(0.45, 0x2266ff, 3);

// 8. Marsi
const mars = createPlanet(0.35, 0xff4422, 5);

// 9. Phobos - sateliti i Marsit
const phobos = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
);
scene.add(phobos);

// 10. Yjet ne sfond
const starPositions = [];

for (let i = 0; i < 500; i++) {
    starPositions.push(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80
    );
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPositions, 3)
);

const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.08 })
);
scene.add(stars);

// 11. Animacioni
function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    earth.rotation.y += 0.01;
    mars.rotation.y += 0.01;
    sun.rotation.y += 0.002;

    // Phobos leviz rreth Marsit
    phobos.position.x = mars.position.x + Math.cos(time * 2) * 0.65;
    phobos.position.z = Math.sin(time * 2) * 0.65;
    phobos.position.y = Math.sin(time * 3) * 0.12;

    controls.update();
    renderer.render(scene, camera);
}

animate();

// 12. Përshtatja e madhesise se dritares
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
