// API Module - Backend communication

import { getAccessToken } from './auth.js';

const API = '/api';

async function request(endpoint, options = {}) {
    const res = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || `Error: ${res.status}`);
    return data;
}

export async function fetchConfig() {
    return request('/config');
}

export async function fetchSheetData() {
    const token = getAccessToken();
    if (!token) throw new Error("Not authenticated");
    const res = await request('/sheets/data', { headers: { Authorization: `Bearer ${token}` } });
    return res.data || [];
}

export async function checkHealth() {
    try {
        const res = await request('/health');
        return res.status === 'ok';
    } catch {
        return false;
    }
}
