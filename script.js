const fish = document.getElementById('fish');
const audio = new Audio('squeaky.mp3');

fish.addEventListener('click', () => {
  fish.classList.remove('bounce');
  void fish.offsetWidth;
  fish.classList.add('bounce');
  
  audio.currentTime = 0;
  audio.play();
});

fish.addEventListener('animationend', () => {
  fish.classList.remove('bounce');
});