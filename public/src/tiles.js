// Tile Creation Module

import { CSS3DObject } from "https://unpkg.com/three@0.160.0/examples/jsm/renderers/CSS3DRenderer.js";
import { parseMoney, getNetWorthColor, safeGet } from './utils.js';

const PLACEHOLDER = "https://via.placeholder.com/120x120.png?text=Photo";

function createTileElement(data) {
    const { name, photo, country, age, interest, color } = data;

    const el = document.createElement("div");
    el.className = "element";
    el.style.backgroundColor = "rgba(0,0,0,0.9)";
    el.style.borderColor = color;
    el.style.boxShadow = `0 0 15px ${color}`;

    // Top row: Country code (left), Age (right)
    const top = document.createElement("div");
    top.className = "top-row";
    top.innerHTML = `<span>${country.substring(0, 3).toUpperCase()}</span><span>${age}</span>`;
    el.appendChild(top);

    // Photo
    const photoDiv = document.createElement("div");
    photoDiv.className = "photo-container";
    const img = document.createElement("img");
    img.src = photo;
    img.alt = name;
    img.onerror = () => img.src = PLACEHOLDER;
    photoDiv.appendChild(img);
    el.appendChild(photoDiv);

    // Name
    const nameDiv = document.createElement("div");
    nameDiv.className = "name";
    nameDiv.textContent = name;
    el.appendChild(nameDiv);

    // Interest
    const detailDiv = document.createElement("div");
    detailDiv.className = "interest";
    detailDiv.textContent = interest;
    el.appendChild(detailDiv);

    // Click effect
    el.addEventListener('click', () => {
        const bright = el.style.boxShadow.includes('30px');
        el.style.boxShadow = bright ? `0 0 15px ${color}` : `0 0 30px ${color}`;
        el.style.zIndex = bright ? '5' : '10';
    });

    return el;
}

export function createTile(person, index, onClick) {
    const name = safeGet(person, "Name") || "Unknown";
    const photo = safeGet(person, "Photo") || PLACEHOLDER;
    const country = safeGet(person, "Country") || "--";
    const age = safeGet(person, "Age") || "-";
    const interest = safeGet(person, "Interest") || "-";
    const money = parseMoney(safeGet(person, "Net Worth"));
    const color = getNetWorthColor(money);

    const el = createTileElement({ name, photo, country, age, interest, color });

    const obj = new CSS3DObject(el);
    obj.position.set(Math.random() * 4000 - 2000, Math.random() * 4000 - 2000, Math.random() * 4000 - 2000);

    if (onClick) el.addEventListener('click', () => onClick(obj));

    return obj;
}

export function createTiles(data, onClick) {
    return data.map((p, i) => createTile(p, i, onClick));
}
