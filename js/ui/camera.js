// js/ui/camera.js
// camera.js - simple pan/zoom camera (mouse drag + wheel to zoom)
(function(){
  const canvas = document.getElementById('world');
  const ctx = canvas.getContext('2d');
  let offsetX = 0, offsetY = 0, scale = 1.0;
  let isDragging = false, lastX=0, lastY=0;

  function screenToWorld(sx, sy) {
    return { x: (sx - offsetX) / scale, y: (sy - offsetY) / scale };
  }

  canvas.addEventListener('wheel', (e)=>{
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    const prevScale = scale;
    scale = Math.max(0.5, Math.min(2.5, scale * (1 + delta)));
    // keep zoom centered to mouse
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    offsetX = mx - ((mx - offsetX) * (scale / prevScale));
    offsetY = my - ((my - offsetY) * (scale / prevScale));
    applyTransform();
  });

  canvas.addEventListener('mousedown', (e)=>{
    if(e.button !== 0) return;
    isDragging = true; lastX = e.clientX; lastY = e.clientY;
  });
  window.addEventListener('mousemove', (e)=>{
    if(!isDragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    offsetX += dx; offsetY += dy;
    applyTransform();
  });
  window.addEventListener('mouseup', ()=>{ isDragging = false; });

  function applyTransform(){
    // the renderer will draw on ctx transformed; store global for renderers
    window.CAMERA = { offsetX, offsetY, scale };
  }

  // initialize
  applyTransform();
})();
