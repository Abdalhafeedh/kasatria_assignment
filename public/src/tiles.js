/**
 * Tiles Module
 * ============
 * 
 * Handles creation of CSS3D tile elements for each person.
 */

import { CSS3DObject } from "https://unpkg.com/three@0.160.0/examples/jsm/renderers/CSS3DRenderer.js";
import { parseMoney, getNetWorthColor, safeGet } from './utils.js';

// Placeholder image for missing photos
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/120x120.png?text=Photo";

/**
 * Create a tile element for a person
 * 
 * @param {Object} person - Person data object
 * @param {number} index - Index of the person (0-based)
 * @returns {CSS3DObject} - CSS3D object representing the tile
 */
export function createTile(person, index) {
    // Extract data with safe fallbacks
    const name = safeGet(person, "Name") || "Unknown";
    const photo = safeGet(person, "Photo") || PLACEHOLDER_IMAGE;
    const age = safeGet(person, "Age") || "-";
    const country = safeGet(person, "Country") || "--";
    const interest = safeGet(person, "Interest") || "-";
    const moneyRaw = safeGet(person, "Net Worth") || "$0";

    // Calculate net worth value and corresponding color
    const moneyVal = parseMoney(moneyRaw);
    const backgroundColor = getNetWorthColor(moneyVal);

    // Build tile DOM structure
    const element = createTileElement({
        index: index + 1,
        name,
        photo,
        age,
        country,
        interest,
        moneyRaw,
        backgroundColor,
    });

    // Create CSS3D object with random initial position
    const objectCSS = new CSS3DObject(element);
    objectCSS.position.x = Math.random() * 4000 - 2000;
    objectCSS.position.y = Math.random() * 4000 - 2000;
    objectCSS.position.z = Math.random() * 4000 - 2000;

    return objectCSS;
}

/**
 * Create the DOM element for a tile
 * 
 * @param {Object} data - Tile data
 * @returns {HTMLDivElement} - Tile DOM element
 */
function createTileElement(data) {
    const { index, name, photo, age, country, interest, moneyRaw, backgroundColor } = data;

    const element = document.createElement("div");
    element.className = "element";
    element.style.backgroundColor = backgroundColor;

    // Header with index and country badges
    const meta = document.createElement("div");
    meta.className = "meta";

    const indexBadge = createBadge(String(index));
    const countryBadge = createBadge(country);

    meta.appendChild(indexBadge);
    meta.appendChild(countryBadge);
    element.appendChild(meta);

    // Photo
    const photoWrap = document.createElement("div");
    photoWrap.className = "photoWrap";

    const img = document.createElement("img");
    img.alt = name;
    img.src = photo;
    img.onerror = () => {
        img.src = PLACEHOLDER_IMAGE;
    };

    photoWrap.appendChild(img);
    element.appendChild(photoWrap);

    // Name
    const nameEl = document.createElement("div");
    nameEl.className = "name";
    nameEl.textContent = name;
    element.appendChild(nameEl);

    // Details (Age, Interest, Net Worth)
    const details = document.createElement("div");
    details.className = "details";
    details.innerHTML = `
    <div><b>Age:</b> ${age}</div>
    <div><b>Interest:</b> ${interest}</div>
    <div class="money"><b>Net Worth:</b> ${moneyRaw}</div>
  `;
    element.appendChild(details);

    return element;
}

/**
 * Create a badge element
 * 
 * @param {string} text - Badge text
 * @returns {HTMLDivElement} - Badge element
 */
function createBadge(text) {
    const badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = text;
    return badge;
}

/**
 * Create multiple tiles from an array of person data
 * 
 * @param {Array<Object>} data - Array of person data objects
 * @returns {Array<CSS3DObject>} - Array of CSS3D tile objects
 */
export function createTiles(data) {
    return data.map((person, index) => createTile(person, index));
}
