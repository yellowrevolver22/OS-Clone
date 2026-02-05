import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { appsDetail } from "../data/app-data.js";
import { taskbarApps } from "../data/task-app-data.js";
import { findApp } from "./utilities.js";

const appGrid = document.querySelector('.js-app-grid');
const desktop = document.querySelector('.main');
const middleSectionApps = document.querySelector('.middle-section-apps');

let currentZ = 1; // for bringing windows to front
function getNextZIndex() {
  currentZ++;
  return currentZ;
}

// --- Render Desktop Apps ---
function renderDesktopApps() {
  let appHTML = '';
  appsDetail.forEach((app) => {
    appHTML += `
    <div class="app js-app-${app.id}" data-app-id="${app.id}">
      <img src="${app.image}">
      <div class="app-name">${app.name}</div>
    </div>`;
  });
  appGrid.innerHTML = appHTML;
}

// --- Render Taskbar Apps ---
function renderTaskbarApps() {
  let appHTML = '';
  taskbarApps.forEach((app) => {
    if (app.fileName === 'wallpaper-change') {
      appHTML += `<img class="js-wallpaper-change" src="${app.image}">`;
    } else {
      appHTML += `<img class="js-taskbar-app" data-app-id="${app.id}" src="${app.image}">`;
    }
  });
  middleSectionApps.innerHTML = appHTML;
}

// --- Open App Window ---
function openAppWindow(appData) {
  // Prevent duplicate windows
  const existingWindow = document.querySelector(
    `.app-window[data-app-id="${appData.id}"]`
  );
  if (existingWindow) {
    existingWindow.style.zIndex = getNextZIndex();
    return;
  }

  const div = document.createElement('div');
  div.classList.add('app-window', 'window-mode');
  div.dataset.appId = appData.id;
  div.style.zIndex = getNextZIndex();

  div.innerHTML = `
    <div class="circles flex align-center gap">
      <div class="circle red-circle"></div>
      <div class="circle yellow-circle"></div>
      <div class="circle green-circle"></div>
    </div>
    <iframe class="app-view" frameborder="0" scrolling="no"
      src="../apps/${appData.fileName}/index.html">
    </iframe>
  `;

  // Close button
  div.querySelector('.red-circle').addEventListener('click', () => div.remove());

  // Minimize
  div.querySelector('.yellow-circle').addEventListener('click', () => {
    if (div.classList.contains('fullscreen-mode')) {
      div.classList.toggle('fullscreen-mode');
      div.classList.toggle('window-mode');
    }
  });

  // Maximize
  div.querySelector('.green-circle').addEventListener('click', () => {
    if (div.classList.contains('window-mode')) {
      div.classList.toggle('window-mode');
      div.classList.toggle('fullscreen-mode');
    }
  });

  desktop.appendChild(div);
}

// --- Wire Desktop Apps ---
function setupDesktopApps() {
  document.querySelectorAll('.app').forEach((el) => {
    el.addEventListener('click', () => {
      const appId = el.dataset.appId;
      const appData = findApp(appId);
      if (!appData) return;
      openAppWindow(appData);
      makeWindowsDraggable();
    });
  });
}

// --- Wire Taskbar Apps ---
function setupTaskbarApps() {
  middleSectionApps.addEventListener('click', (e) => {
    const appEl = e.target.closest('[data-app-id]');
    if (!appEl) return;

    const appId = appEl.dataset.appId;
    const appData = findApp(appId);
    if (!appData) return;

    openAppWindow(appData);
    makeWindowsDraggable()
  });
}

//--Draggable Function
function makeWindowsDraggable() {
  document.querySelectorAll('.app-window').forEach((win) => {
    const circles = win.querySelector('.circles');
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    circles.addEventListener('mousedown', (e) => {
      isDragging = true;

      const rect = win.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      win.style.zIndex = getNextZIndex();

      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
      win.style.position = 'absolute';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  });
}

// --- Initialize Everything ---
renderDesktopApps();
renderTaskbarApps();
setupDesktopApps();
setupTaskbarApps();

// --- Wallpaper Button ---
const wallpaperBtn = document.querySelector('.js-wallpaper-change');
if (wallpaperBtn) {
  wallpaperBtn.addEventListener('click', () => {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    desktop.style.backgroundImage = `url(../Mine/footer-images/wallpaper${randomNumber}.jpg)`;
  });
}

// --- WiFi Tray ---
document.querySelector('.wifi-audio-battery').addEventListener('click', () => {
  document.querySelector('.system-settings').classList.toggle('active');
});

// --- Windows Tray ---
document.querySelector('.taskbar-window').addEventListener('click', () => {
  document.querySelector('.windows-tray').classList.toggle('active');
});

//--Taskbar Weather--
async function taskbarWeather(){
  let response = await fetch('https://api.weatherapi.com/v1/current.json?key=1db180f23cb943889dd53144252707&q=delhi');
  let data = await response.json();
  let icon = data.current.condition.icon;
  let text = data.current.condition.text;
  let temp_c = data.current.temp_c;
  let html = '';
  html+=`
        <img src="${icon}">
        <div class="left-section-details flex-col less-gap">
          <span class="taskbar-temp">${temp_c}C</span>
          <span class="taskbar-weather-detail">${text}</span>
        </div>`
  document.querySelector('.left-section-taskbar').innerHTML=html;
}
taskbarWeather();

//--Taskbar Time ---

let today = dayjs();
console.log(today);
const dateString = today.format("D-M-YYYY");
const time = today.format("HH:mm");
document.querySelector(".system-time-date").innerHTML = `
    <span class="system-time">${time}</span>
    <span class="system-date">${dateString}</span>
`;

document.querySelectorAll('.wifi').forEach((icon) => {
  icon.addEventListener("click", () => {
    const currentBg = getComputedStyle(icon).backgroundColor;

    if (currentBg === "rgba(255, 255, 255, 0.15)") {
      icon.style.background = "#0078d7";
    } else {
      icon.style.background = "rgba(255, 255, 255, 0.15)";
    }
  });
});

let brightnessBar = document.querySelector(".brightness-bar");
brightnessBar.value = 100;

let brightnessDiv = document.querySelector(".brightness-div");
brightnessBar.addEventListener("input", () => {
  let brightnessValue = (brightnessBar.value / 100 - 1) * -1;
  brightnessDiv.style.opacity = brightnessValue;
});

