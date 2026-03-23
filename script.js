const fish = document.getElementById('fish');
const audio = new Audio('squeaky.mp3');
const explosionAudio = new Audio('explosion.mp3');

let clickCount = 0;
let hasExploded = false;

fish.addEventListener('click', () => {
  if (hasExploded) return;
  
  clickCount++;
  
  if (clickCount >= 100) {
    hasExploded = true;
    fish.src = 'explosion.gif';
    fish.classList.remove('bounce');
    explosionAudio.play();
    
    setTimeout(() => {
      fish.src = document.getElementById('fishImageInput').value;
      clickCount = 0;
      hasExploded = false;
    }, 3000);
  } else {
    fish.classList.remove('bounce');
    void fish.offsetWidth;
    fish.classList.add('bounce');
    
    audio.currentTime = 0;
    audio.play();
  }
});

fish.addEventListener('animationend', () => {
  fish.classList.remove('bounce');
});

const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');

settingsToggle.addEventListener('click', () => {
  settingsPanel.classList.toggle('open');
  settingsToggle.classList.toggle('panel-open');
  settingsToggle.textContent = settingsPanel.classList.contains('open') ? '▶' : '◀';
});

document.getElementById('titleInput').addEventListener('input', (e) => {
  document.getElementById('titleText').textContent = e.target.value;
});

document.getElementById('iconTextInput').addEventListener('input', (e) => {
  document.getElementById('iconText').textContent = e.target.value;
});

document.getElementById('button1Input').addEventListener('input', (e) => {
  document.getElementById('button1').textContent = e.target.value;
});

document.getElementById('button2Input').addEventListener('input', (e) => {
  document.getElementById('button2').textContent = e.target.value;
});

document.getElementById('button3Input').addEventListener('input', (e) => {
  document.getElementById('button3').textContent = e.target.value;
});

document.getElementById('iconImageInput').addEventListener('input', (e) => {
  document.getElementById('iconImage').src = e.target.value;
});

document.getElementById('fishImageInput').addEventListener('input', (e) => {
  document.getElementById('fish').src = e.target.value;
});

document.getElementById('titleBarColor').addEventListener('input', (e) => {
  const color = e.target.value;
  document.querySelector('.title-bar').style.background = `linear-gradient(to bottom, ${color} 0%, ${adjustBrightness(color, -30)} 100%)`;
});

document.getElementById('bgColor').addEventListener('input', (e) => {
  document.querySelector('.dialog-content').style.background = e.target.value;
  document.querySelector('.dialog').style.background = e.target.value;
});

document.getElementById('pageBgColor').addEventListener('input', (e) => {
  document.body.style.background = e.target.value;
});

document.getElementById('titleTextColor').addEventListener('input', (e) => {
  document.getElementById('titleText').style.color = e.target.value;
});

document.getElementById('iconTextColor').addEventListener('input', (e) => {
  document.getElementById('iconText').style.color = e.target.value;
});

document.getElementById('buttonTextColor').addEventListener('input', (e) => {
  document.querySelectorAll('.buttons button').forEach(btn => {
    btn.style.color = e.target.value;
  });
});

document.getElementById('audioInput').addEventListener('input', (e) => {
  audio.src = e.target.value;
});

function adjustBrightness(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}