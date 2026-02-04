/**
 * Scene Module
 * ============
 * 
 * Handles Three.js scene setup, rendering, and animation.
 */

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { TrackballControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/TrackballControls.js";
import { CSS3DRenderer } from "https://unpkg.com/three@0.160.0/examples/jsm/renderers/CSS3DRenderer.js";
import TWEEN from "https://unpkg.com/@tweenjs/tween.js@18.6.4/dist/tween.esm.js";
import { CAMERA, ANIMATION } from './constants.js';

// Scene state
let camera = null;
let scene = null;
let renderer = null;
let controls = null;
let animationFrameId = null;

/**
 * Initialize the Three.js scene
 * 
 * @param {HTMLElement} container - DOM element to render into
 */
export function initScene(container) {
    // Camera
    camera = new THREE.PerspectiveCamera(
        CAMERA.FOV,
        window.innerWidth / window.innerHeight,
        CAMERA.NEAR,
        CAMERA.FAR
    );
    camera.position.z = CAMERA.INITIAL_Z;

    // Scene
    scene = new THREE.Scene();

    // CSS3D Renderer
    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0px";

    // Clear container and add renderer
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Trackball Controls
    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = CAMERA.MIN_DISTANCE;
    controls.maxDistance = CAMERA.MAX_DISTANCE;
    controls.addEventListener("change", render);

    // Handle window resize
    window.addEventListener("resize", onWindowResize);
}

/**
 * Handle window resize
 */
function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }
}

/**
 * Render the scene
 */
export function render() {
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

/**
 * Start the animation loop
 */
export function startAnimation() {
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        TWEEN.update();
        if (controls) {
            controls.update();
        }
    }
    animate();
}

/**
 * Stop the animation loop
 */
export function stopAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

/**
 * Add an object to the scene
 * 
 * @param {THREE.Object3D} object - Object to add
 */
export function addToScene(object) {
    if (scene) {
        scene.add(object);
    }
}

/**
 * Add multiple objects to the scene
 * 
 * @param {Array<THREE.Object3D>} objects - Objects to add
 */
export function addMultipleToScene(objects) {
    objects.forEach(obj => addToScene(obj));
}

/**
 * Transform objects to target positions with animation
 * 
 * @param {Array<THREE.Object3D>} objects - Objects to transform
 * @param {Array<THREE.Object3D>} targets - Target positions and rotations
 * @param {number} duration - Animation duration in milliseconds
 */
export function transformToLayout(objects, targets, duration = ANIMATION.DEFAULT_DURATION) {
    TWEEN.removeAll();

    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        const target = targets[i];

        if (!object || !target) continue;

        // Animate position
        new TWEEN.Tween(object.position)
            .to(
                {
                    x: target.position.x,
                    y: target.position.y,
                    z: target.position.z,
                },
                Math.random() * duration + duration
            )
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        // Animate rotation
        new TWEEN.Tween(object.rotation)
            .to(
                {
                    x: target.rotation.x,
                    y: target.rotation.y,
                    z: target.rotation.z,
                },
                Math.random() * duration + duration
            )
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }

    // Ensure continuous rendering during animation
    new TWEEN.Tween({})
        .to({}, duration * 2)
        .onUpdate(render)
        .start();
}

/**
 * Get current scene state
 * 
 * @returns {Object} - Object containing camera, scene, renderer, controls
 */
export function getSceneState() {
    return { camera, scene, renderer, controls };
}

/**
 * Cleanup scene resources
 */
export function disposeScene() {
    stopAnimation();

    window.removeEventListener("resize", onWindowResize);

    if (controls) {
        controls.dispose();
    }

    if (renderer) {
        renderer.domElement.remove();
    }

    camera = null;
    scene = null;
    renderer = null;
    controls = null;
}
