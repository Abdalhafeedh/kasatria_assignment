// UI Module - DOM interactions

import { ANIMATION } from './constants.js';

const el = {};

export function initUI() {
    el.loginScreen = document.getElementById("loginScreen");
    el.app = document.getElementById("app");
    el.loginBtn = document.getElementById("loginBtn");
    el.loginError = document.getElementById("loginError");
    el.loading = document.getElementById("loading");
    el.container = document.getElementById("container");
    el.userLabel = document.getElementById("userLabel");
    el.toast = document.getElementById("toast");
    el.btnTable = document.getElementById("btnTable");
    el.btnSphere = document.getElementById("btnSphere");
    el.btnHelix = document.getElementById("btnHelix");
    el.btnGrid = document.getElementById("btnGrid");
    el.btnPyramid = document.getElementById("btnPyramid");
    el.btnSignOut = document.getElementById("btnSignOut");
}

export function showLoginError(msg) {
    if (el.loginError) {
        el.loginError.textContent = msg;
        el.loginError.classList.remove("hidden");
    }
}

export function hideLoginError() {
    el.loginError?.classList.add("hidden");
}

export function setLoading(show) {
    el.loading?.classList.toggle("hidden", !show);
}

export function showToast(msg) {
    if (el.toast) {
        el.toast.textContent = msg;
        el.toast.classList.remove("hidden");
        setTimeout(() => el.toast.classList.add("hidden"), ANIMATION.TOAST_DURATION);
    }
}

export function showApp() {
    el.loginScreen?.classList.add("hidden");
    el.app?.classList.remove("hidden");
}

export function setUserLabel(email) {
    if (el.userLabel) el.userLabel.textContent = email;
}

export function getContainer() {
    return el.container;
}

export function setupLayoutButtons(cb) {
    el.btnTable?.addEventListener("click", cb.onTable);
    el.btnSphere?.addEventListener("click", cb.onSphere);
    el.btnHelix?.addEventListener("click", cb.onHelix);
    el.btnGrid?.addEventListener("click", cb.onGrid);
    el.btnPyramid?.addEventListener("click", cb.onPyramid);
    el.btnSignOut?.addEventListener("click", cb.onSignOut);
}

export function setupLoginButton(cb) {
    el.loginBtn?.addEventListener("click", cb);
}
