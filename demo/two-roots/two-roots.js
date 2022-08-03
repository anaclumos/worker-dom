const btn = document.getElementsByTagName('button')[0];

btn.addEventListener('click', async () => {
  const infoEl = document.getElementById('info');
  const boundingClientRect = await infoEl.getBoundingClientRect();
  infoEl.textContent = JSON.stringify(boundingClientRect);
  infoEl.textContent += '\n this should go after the previous line';
});
