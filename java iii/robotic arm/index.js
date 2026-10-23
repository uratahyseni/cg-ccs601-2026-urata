
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

// 2. CAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(8, 6, 12);
camera.lookAt(0, 3, 0);

// 3. MATERIALS
const armMaterial = new THREE.MeshStandardMaterial({
    color: 0x3399ff
});

const jointMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555
});

const handMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa55
});

const fingerMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc88
});

// 4. BASE
const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const base = new THREE.Mesh(baseGeometry, jointMaterial);
scene.add(base);

// 5. SHOULDER
const shoulder = new THREE.Group();
shoulder.position.y = 0.5;
base.add(shoulder);

const shoulderJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    jointMaterial
);
shoulder.add(shoulderJoint);

const upperArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 3, 0.7),
    armMaterial
);
upperArm.position.y = 1.5;
shoulder.add(upperArm);

// 6. ELBOW
const elbow = new THREE.Group();
elbow.position.y = 3;
shoulder.add(elbow);

const elbowJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 32, 32),
    jointMaterial
);
elbow.add(elbowJoint);

const forearm = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 2.5, 0.6),
    armMaterial
);
forearm.position.y = 1.25;
elbow.add(forearm);

// 7. WRIST
const wrist = new THREE.Group();
wrist.position.y = 2.5;
elbow.add(wrist);

const wristJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    jointMaterial
);
wrist.add(wristJoint);

// 8. PALM
const palm = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.5, 0.4),
    handMaterial
);
palm.position.y = 0.9;
wrist.add(palm);

// 9. FINGERS
const fingers = [];
const fingerBends = [0, 0, 0, 0, 0];
const fingerSizes = [1, 1, 1, 1, 1];

const fingerLengths = [0.8, 1.1, 1.25, 1.1, 0.85];

for (let i = 0; i < 5; i++) {
    const fingerJoint = new THREE.Group();

    // Thumb on the left side
    if (i === 0) {
        fingerJoint.position.set(-0.85, 0.25, 0);
        fingerJoint.rotation.z = THREE.MathUtils.degToRad(-45);
    } else {
        fingerJoint.position.set(
            -0.55 + (i - 1) * 0.37,
            1.55,
            0
        );
    }

    palm.add(fingerJoint);

    const length = fingerLengths[i];

    const fingerGeometry = new THREE.BoxGeometry(
        i === 0 ? 0.3 : 0.23,
        length,
        0.25
    );

    const finger = new THREE.Mesh(fingerGeometry, fingerMaterial);
    finger.position.y = length / 2;
    fingerJoint.add(finger);

    // Fingertip joint
    const tipJoint = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 16, 16),
        jointMaterial
    );

    tipJoint.position.y = length / 2;
    finger.add(tipJoint);

    fingers.push(fingerJoint);
}

// 10. LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// 11. GROUND
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0xcccccc })
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.25;
scene.add(ground);

const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

// 12. RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.getElementById('scene').appendChild(renderer.domElement);

// 13. CAMERA CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 3, 0);
controls.enableDamping = true;
controls.update();

// 14. INITIAL ARM POSITION
shoulder.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(40);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);

const rotationStep = THREE.MathUtils.degToRad(5);

// 15. CONTROL PANEL
const panel = document.createElement('div');

panel.style.cssText = `
    position: fixed;
    top: 12px;
    left: 12px;
    width: 260px;
    max-height: 92vh;
    overflow-y: auto;
    padding: 14px;
    box-sizing: border-box;
    background: rgba(25, 30, 40, 0.95);
    color: white;
    font: 14px Arial, sans-serif;
    border-radius: 12px;
    z-index: 10;
`;

panel.innerHTML = `
    <h3 style="margin:0 0 8px">Robotic Arm</h3>
    <p style="margin:0 0 12px">Finger Controls</p>
`;

document.body.appendChild(panel);

// Create controls for each finger
const fingerNames = [
    'Thumb',
    'Index Finger',
    'Middle Finger',
    'Ring Finger',
    'Little Finger'
];

for (let i = 0; i < fingers.length; i++) {
    const section = document.createElement('div');

    section.style.cssText = `
        border-top: 1px solid #666;
        padding: 9px 0;
    `;

    const title = document.createElement('strong');
    title.textContent = fingerNames[i];
    section.appendChild(title);

    // Bend slider
    const bendLabel = document.createElement('label');
    bendLabel.style.cssText = 'display:block;margin-top:8px';
    bendLabel.textContent = 'Bend: ';

    const bendValue = document.createElement('span');
    bendValue.textContent = '0°';
    bendLabel.appendChild(bendValue);

    const bendSlider = document.createElement('input');
    bendSlider.type = 'range';
    bendSlider.min = '-70';
    bendSlider.max = '70';
    bendSlider.step = '5';
    bendSlider.value = '0';
    bendSlider.style.width = '100%';
    bendSlider.setAttribute('aria-label', fingerNames[i] + ' bend');

    bendLabel.appendChild(bendSlider);
    section.appendChild(bendLabel);

    bendSlider.addEventListener('input', () => {
        const degrees = Number(bendSlider.value);
        fingerBends[i] = THREE.MathUtils.degToRad(degrees);
        bendValue.textContent = degrees + '°';

        const thumbAngle = i === 0
            ? THREE.MathUtils.degToRad(-45)
            : 0;

        fingers[i].rotation.z = thumbAngle + fingerBends[i];
    });

    // Size slider
    const sizeLabel = document.createElement('label');
    sizeLabel.style.cssText = 'display:block;margin-top:8px';
    sizeLabel.textContent = 'Size: ';

    const sizeValue = document.createElement('span');
    sizeValue.textContent = '1.0x';
    sizeLabel.appendChild(sizeValue);

    const sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = '0.5';
    sizeSlider.max = '1.5';
    sizeSlider.step = '0.1';
    sizeSlider.value = '1';
    sizeSlider.style.width = '100%';
    sizeSlider.setAttribute('aria-label', fingerNames[i] + ' size');

    sizeLabel.appendChild(sizeSlider);
    section.appendChild(sizeLabel);

    sizeSlider.addEventListener('input', () => {
        const size = Number(sizeSlider.value);
        fingerSizes[i] = size;
        sizeValue.textContent = size.toFixed(1) + 'x';
        fingers[i].scale.setScalar(size);
    });

    panel.appendChild(section);
}

// Keyboard instructions
const instructions = document.createElement('div');
instructions.style.cssText = `
    border-top: 1px solid #666;
    padding-top: 10px;
    line-height: 1.7;
`;

instructions.innerHTML = `
    <strong>Arm Keyboard Controls</strong><br>
    Q / A: Shoulder<br>
    W / S: Elbow<br>
    E / D: Wrist<br>
    Drag mouse: Rotate camera
`;

panel.appendChild(instructions);

// 16. KEYBOARD CONTROLS
window.addEventListener('keydown', (event) => {
    // Don't rotate the arm while operating a slider
    if (event.target instanceof HTMLInputElement) return;

    const key = event.key.toLowerCase();

    if (key === 'q') {
        shoulder.rotation.z += rotationStep;
    } else if (key === 'a') {
        shoulder.rotation.z -= rotationStep;
    } else if (key === 'w') {
        elbow.rotation.z += rotationStep;
    } else if (key === 's') {
        elbow.rotation.z -= rotationStep;
    } else if (key === 'e') {
        wrist.rotation.z += rotationStep;
    } else if (key === 'd') {
        wrist.rotation.z -= rotationStep;
    }
});

// 17. RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 18. ANIMATION
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
