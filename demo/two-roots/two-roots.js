const btn = document.getElementsByTagName('button')[0];

btn.addEventListener('click', () => {
  const infoEl = document.getElementById('info');
  const boundingClientRect = infoEl.getBoundingClientRect();
  infoEl.textContent = JSON.stringify(boundingClientRect);
});
