// Layout Generators (Table, Sphere, Helix, Grid, Pyramid)

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

/**
 * Generate targets for a regular tetrahedron (4-face pyramid).
 *
 * A regular tetrahedron has 4 equilateral triangular faces.
 * Tiles are distributed evenly across all 4 faces using
 * barycentric coordinate interpolation, and each tile is
 * oriented to face outward from its respective face.
 */
export function generatePyramidTargets(count) {
    const { EDGE_LENGTH } = LAYOUT.PYRAMID;
    const targets = [];

    // ── Regular tetrahedron vertices ──────────────────────────
    // Centred at the origin with one vertex pointing straight up.
    const a = EDGE_LENGTH;
    const vertices = [
        new THREE.Vector3(0, a * Math.sqrt(2 / 3) - a / (2 * Math.sqrt(6)), 0),  // top
        new THREE.Vector3(-a / 2, -a / (2 * Math.sqrt(6)), a * Math.sqrt(3) / 6),  // front-left
        new THREE.Vector3(a / 2, -a / (2 * Math.sqrt(6)), a * Math.sqrt(3) / 6),  // front-right
        new THREE.Vector3(0, -a / (2 * Math.sqrt(6)), -a * Math.sqrt(3) / 3),  // back
    ];

    // Centre the tetrahedron at origin
    const centroid = new THREE.Vector3();
    vertices.forEach(v => centroid.add(v));
    centroid.divideScalar(4);
    vertices.forEach(v => v.sub(centroid));

    // The 4 triangular faces (indices into vertices[])
    const faces = [
        [0, 1, 2],   // front face
        [0, 2, 3],   // right face
        [0, 3, 1],   // left face
        [1, 3, 2],   // bottom face
    ];

    // Pre-compute face normals (outward-pointing)
    const faceNormals = faces.map(([ia, ib, ic]) => {
        const ab = new THREE.Vector3().subVectors(vertices[ib], vertices[ia]);
        const ac = new THREE.Vector3().subVectors(vertices[ic], vertices[ia]);
        const normal = new THREE.Vector3().crossVectors(ab, ac).normalize();
        // Ensure the normal points away from the tetrahedron centroid (origin)
        const faceCentre = new THREE.Vector3()
            .add(vertices[ia]).add(vertices[ib]).add(vertices[ic]).divideScalar(3);
        if (normal.dot(faceCentre) < 0) normal.negate();
        return normal;
    });

    // ── Distribute tiles across faces ────────────────────────
    // Split count evenly across 4 faces
    const perFace = Math.ceil(count / faces.length);

    // Determine grid subdivision per face so we have enough slots
    // We use a triangular grid: for subdivision level n we get n*(n+1)/2 points
    let subdivisions = 1;
    while (subdivisions * (subdivisions + 1) / 2 < perFace) {
        subdivisions++;
    }

    // Generate sample points on each face using barycentric coordinates
    let allPoints = [];

    for (let f = 0; f < faces.length; f++) {
        const [ia, ib, ic] = faces[f];
        const vA = vertices[ia];
        const vB = vertices[ib];
        const vC = vertices[ic];
        const normal = faceNormals[f];

        const facePoints = [];
        const n = subdivisions;

        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= n - i; j++) {
                const k = n - i - j;
                // Barycentric coordinates normalised to [0,1]
                const u = (i + 1 / 3) / (n + 1);
                const v = (j + 1 / 3) / (n + 1);
                const w = 1 - u - v;

                if (w < 0) continue;

                const pos = new THREE.Vector3(
                    vA.x * u + vB.x * v + vC.x * w,
                    vA.y * u + vB.y * v + vC.y * w,
                    vA.z * u + vB.z * v + vC.z * w,
                );

                facePoints.push({ pos, normal });
            }
        }

        allPoints.push(...facePoints);
    }

    // If we generated more points than needed, take only `count`
    // Spread selection evenly across the available points
    if (allPoints.length > count) {
        const step = allPoints.length / count;
        const selected = [];
        for (let i = 0; i < count; i++) {
            selected.push(allPoints[Math.floor(i * step)]);
        }
        allPoints = selected;
    }

    // Create Object3Ds for each target position
    for (let i = 0; i < count; i++) {
        const obj = new THREE.Object3D();

        if (i < allPoints.length) {
            const { pos, normal } = allPoints[i];
            obj.position.copy(pos);
            // Orient the tile to face outward along the face normal
            const lookTarget = new THREE.Vector3().copy(pos).add(normal);
            obj.lookAt(lookTarget);
        }

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
        pyramid: generatePyramidTargets(count),
    };
}
