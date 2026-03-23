import JSZip from 'https://esm.sh/jszip@3.10.1';
import saveAs from 'https://esm.sh/file-saver@2.0.5';

const fish = document.getElementById('fish');
const audio = new Audio('squeaky.mp3');
const explosionAudio = new Audio('explosion.mp3');

let clickCount = 0;
let hasExploded = false;

function initializeColors() {
  const titleBarColor = document.getElementById('titleBarColor').value;
  const bgColor = document.getElementById('bgColor').value;
  const pageBgColor = document.getElementById('pageBgColor').value;
  const titleTextColor = document.getElementById('titleTextColor').value;
  const iconTextColor = document.getElementById('iconTextColor').value;
  const buttonTextColor = document.getElementById('buttonTextColor').value;
  
  document.querySelector('.title-bar').style.background = `linear-gradient(to bottom, ${titleBarColor} 0%, ${adjustBrightness(titleBarColor, -30)} 100%)`;
  document.querySelector('.dialog-content').style.background = bgColor;
  document.querySelector('.dialog').style.background = bgColor;
  document.body.style.background = pageBgColor;
  document.getElementById('titleText').style.color = titleTextColor;
  document.getElementById('iconText').style.color = iconTextColor;
  document.querySelectorAll('.buttons button').forEach(btn => {
    btn.style.color = buttonTextColor;
  });
}

initializeColors();

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

function adjustBrightness(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

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

document.getElementById('downloadBtn').addEventListener('click', async () => {
  const btn = document.getElementById('downloadBtn');
  const originalText = btn.textContent;
  btn.textContent = 'Generating...';
  btn.disabled = true;
  
  try {
    const zip = new JSZip();
    
    const htmlClone = document.documentElement.cloneNode(true);
    htmlClone.querySelector('#downloadBtn').remove();
    
    const head = htmlClone.querySelector('head');
    head.querySelectorAll('meta[property^="og:"]').forEach(el => el.remove());
    head.querySelectorAll('meta[property^="twitter:"]').forEach(el => el.remove());
    head.querySelectorAll('link[rel="canonical"]').forEach(el => el.remove());
    head.querySelectorAll('link[href*="websim"]').forEach(el => el.remove());
    head.querySelectorAll('style.websim-injected').forEach(el => el.remove());
    head.querySelectorAll('script[src*="websim"]').forEach(el => el.remove());
    
    let htmlContent = '<!DOCTYPE html>\n' + htmlClone.outerHTML;
    htmlContent = htmlContent.replace(/src="\/([^"]+)"/g, 'src="$1"');
    htmlContent = htmlContent.replace(/href="\/([^"]+)"/g, 'href="$1"');
    htmlContent = htmlContent.replace(/value="\/([^"]+)"/g, 'value="$1"');
    
    zip.file('index.html', htmlContent);
    
    const cssResponse = await fetch('style.css');
    const cssContent = await cssResponse.text();
    zip.file('style.css', cssContent);
    
    const jsResponse = await fetch('script.js');
    let jsContent = await jsResponse.text();
    jsContent = jsContent.replace(/new Audio\('\/([^']+)'\)/g, "new Audio('$1')");
    jsContent = jsContent.replace(/fish\.src = '\/([^']+)'/g, "fish.src = '$1'");
    zip.file('script.js', jsContent);
    
    const assets = [
      'squeaky.mp3',
      'static-assets-upload14083937176938266492.png',
      'explosion.gif',
      'pc-error-icon-8.png',
      'explosion.mp3'
    ];
    
    for (const asset of assets) {
      try {
        const response = await fetch('/' + asset);
        const blob = await response.blob();
        zip.file(asset, blob);
      } catch (err) {
        console.warn(`Failed to fetch ${asset}:`, err);
      }
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'fissh-warning.zip');
    
  } catch (error) {
    console.error('Error creating zip:', error);
    alert('Failed to create zip file. Check console for details.');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});