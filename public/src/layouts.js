/**
 * Layouts Module
 * ==============
 * 
 * Generates target positions for different layout modes:
 * - Table (20x10)
 * - Sphere
 * - Double Helix
 * - Grid (5x4x10)
 */

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { LAYOUT } from './constants.js';

/**
 * Generate table layout targets (20 columns x 10 rows)
 * 
 * @param {number} count - Number of items to position
 * @returns {Array<THREE.Object3D>} - Array of target objects
 */
export function generateTableTargets(count) {
    const { COLS, ROWS, X_SPACING, Y_SPACING } = LAYOUT.TABLE;
    const targets = [];

    for (let i = 0; i < count; i++) {
        const col = i % COLS;
        const row = Math.floor(i / COLS);

        const object = new THREE.Object3D();
        object.position.x = (col - (COLS / 2 - 0.5)) * X_SPACING;
        object.position.y = ((ROWS / 2 - 0.5) - row) * Y_SPACING;
        object.position.z = 0;

        targets.push(object);
    }

    return targets;
}

/**
 * Generate sphere layout targets
 * Uses Fibonacci spiral for even distribution
 * 
 * @param {number} count - Number of items to position
 * @returns {Array<THREE.Object3D>} - Array of target objects
 */
export function generateSphereTargets(count) {
    const { RADIUS } = LAYOUT.SPHERE;
    const targets = [];
    const vector = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;

        const object = new THREE.Object3D();
        object.position.setFromSphericalCoords(RADIUS, phi, theta);

        vector.copy(object.position).multiplyScalar(2);
        object.lookAt(vector);

        targets.push(object);
    }

    return targets;
}

/**
 * Generate double helix layout targets
 * Items are placed alternately on two strands with PI phase shift
 * 
 * @param {number} count - Number of items to position
 * @returns {Array<THREE.Object3D>} - Array of target objects
 */
export function generateHelixTargets(count) {
    const { RADIUS, ANGLE_STEP, Y_STEP, Y_OFFSET, STRAND_SEPARATION } = LAYOUT.HELIX;
    const targets = [];

    for (let i = 0; i < count; i++) {
        const pairIndex = Math.floor(i / 2);
        const strand = i % 2; // 0 = strand A, 1 = strand B

        // Phase shift PI (180°) for second strand to create double helix
        const angle = pairIndex * ANGLE_STEP + (strand * Math.PI);

        const object = new THREE.Object3D();
        object.position.x = Math.sin(angle) * RADIUS;
        object.position.z = Math.cos(angle) * RADIUS;

        // Y position with slight separation between strands
        object.position.y = -(pairIndex * Y_STEP) + Y_OFFSET + (strand === 0 ? STRAND_SEPARATION : -STRAND_SEPARATION);

        // Make tiles face outward
        const lookTarget = new THREE.Vector3(
            object.position.x * 2,
            object.position.y,
            object.position.z * 2
        );
        object.lookAt(lookTarget);

        targets.push(object);
    }

    return targets;
}

/**
 * Generate 3D grid layout targets (5x4x10 as per Image C)
 * 
 * @param {number} count - Number of items to position
 * @returns {Array<THREE.Object3D>} - Array of target objects
 */
export function generateGridTargets(count) {
    const { X, Y, Z, X_SPACING, Y_SPACING, Z_SPACING } = LAYOUT.GRID;
    const targets = [];

    for (let i = 0; i < count; i++) {
        const x = i % X;
        const y = Math.floor(i / X) % Y;
        const z = Math.floor(i / (X * Y)) % Z;

        const object = new THREE.Object3D();
        object.position.x = (x - (X - 1) / 2) * X_SPACING;
        object.position.y = ((Y - 1) / 2 - y) * Y_SPACING;
        object.position.z = (z - (Z - 1) / 2) * Z_SPACING;

        targets.push(object);
    }

    return targets;
}

/**
 * Generate all layout targets at once
 * 
 * @param {number} count - Number of items to position
 * @returns {Object} - Object containing all target arrays
 */
export function generateAllTargets(count) {
    return {
        table: generateTableTargets(count),
        sphere: generateSphereTargets(count),
        helix: generateHelixTargets(count),
        grid: generateGridTargets(count),
    };
}
