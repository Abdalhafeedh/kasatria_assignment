// Layout Generators (Table, Sphere, Helix, Grid)

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { LAYOUT } from './constants.js';

export function generateTableTargets(count) {
    const { COLS, ROWS, X_SPACING, Y_SPACING } = LAYOUT.TABLE;
    const targets = [];

    for (let i = 0; i < count; i++) {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const obj = new THREE.Object3D();
        obj.position.set((col - COLS / 2 + 0.5) * X_SPACING, (ROWS / 2 - 0.5 - row) * Y_SPACING, 0);
        targets.push(obj);
    }
    return targets;
}

export function generateSphereTargets(count) {
    const { RADIUS } = LAYOUT.SPHERE;
    const targets = [];
    const vec = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const obj = new THREE.Object3D();
        obj.position.setFromSphericalCoords(RADIUS, phi, theta);
        vec.copy(obj.position).multiplyScalar(2);
        obj.lookAt(vec);
        targets.push(obj);
    }
    return targets;
}

export function generateHelixTargets(count) {
    const { RADIUS, ANGLE_STEP, Y_STEP, Y_OFFSET, STRAND_SEPARATION } = LAYOUT.HELIX;
    const targets = [];

    for (let i = 0; i < count; i++) {
        const pair = Math.floor(i / 2);
        const strand = i % 2;
        const angle = pair * ANGLE_STEP + strand * Math.PI;

        const obj = new THREE.Object3D();
        obj.position.x = Math.sin(angle) * RADIUS;
        obj.position.z = Math.cos(angle) * RADIUS;
        obj.position.y = -(pair * Y_STEP) + Y_OFFSET + (strand === 0 ? STRAND_SEPARATION : -STRAND_SEPARATION);

        obj.lookAt(new THREE.Vector3(obj.position.x * 2, obj.position.y, obj.position.z * 2));
        targets.push(obj);
    }
    return targets;
}

export function generateGridTargets(count) {
    const { X, Y, Z, X_SPACING, Y_SPACING, Z_SPACING } = LAYOUT.GRID;
    const targets = [];

    for (let i = 0; i < count; i++) {
        const x = i % X;
        const y = Math.floor(i / X) % Y;
        const z = Math.floor(i / (X * Y)) % Z;

        const obj = new THREE.Object3D();
        obj.position.set((x - (X - 1) / 2) * X_SPACING, ((Y - 1) / 2 - y) * Y_SPACING, (z - (Z - 1) / 2) * Z_SPACING);
        targets.push(obj);
    }
    return targets;
}

export function generateAllTargets(count) {
    return {
        table: generateTableTargets(count),
        sphere: generateSphereTargets(count),
        helix: generateHelixTargets(count),
        grid: generateGridTargets(count),
    };
}
