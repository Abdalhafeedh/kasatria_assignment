// Three.js Scene Management

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { TrackballControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/TrackballControls.js";
import { CSS3DRenderer } from "https://unpkg.com/three@0.160.0/examples/jsm/renderers/CSS3DRenderer.js";
import TWEEN from "https://unpkg.com/@tweenjs/tween.js@18.6.4/dist/tween.esm.js";
import { CAMERA, ANIMATION } from './constants.js';

let camera, scene, renderer, controls;
let animationFrameId = null;

export function initScene(container) {
    camera = new THREE.PerspectiveCamera(CAMERA.FOV, window.innerWidth / window.innerHeight, CAMERA.NEAR, CAMERA.FAR);
    camera.position.z = CAMERA.INITIAL_Z;

    scene = new THREE.Scene();

    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = CAMERA.MIN_DISTANCE;
    controls.maxDistance = CAMERA.MAX_DISTANCE;
    controls.addEventListener("change", render);

    window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

export function render() {
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

export function startAnimation() {
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        TWEEN.update();
        controls?.update();
    }
    animate();
}

export function addToScene(obj) {
    scene?.add(obj);
}

export function addMultipleToScene(objects) {
    objects.forEach(obj => scene?.add(obj));
}

export function transformToLayout(objects, targets, duration = ANIMATION.DEFAULT_DURATION) {
    TWEEN.removeAll();

    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const target = targets[i];
        if (!obj || !target) continue;

        new TWEEN.Tween(obj.position)
            .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(obj.rotation)
            .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }

    new TWEEN.Tween({}).to({}, duration * 2).onUpdate(render).start();
}

export function focusOnPosition(position, duration = 1500) {
    if (!controls) return;
    new TWEEN.Tween(controls.target)
        .to({ x: position.x, y: position.y, z: position.z }, duration)
        .easing(TWEEN.Easing.Exponential.Out)
        .start();
}
