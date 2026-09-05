// js/ui/minimap.js
(function(){
  const canvas = document.getElementById('minimap'); const ctx = canvas.getContext('2d');
  canvas.width = 220; canvas.height = 140;
  function draw(){ ctx.clearRect(0,0,canvas.width,canvas.height); const w = canvas.width, h = canvas.height; const tw = MAP.width, th = MAP.height; const sx = w/tw, sy = h/th; for(let y=0;y<th;y++){ for(let x=0;x<tw;x++){ const t = tileAt(x,y); if(t===0) ctx.fillStyle='#72b46a'; else if(t===1) ctx.fillStyle='#9e9e9e'; else if(t===2) ctx.fillStyle='#e6ca8a'; else ctx.fillStyle='#ffd54f'; ctx.fillRect(x*sx, y*sy, Math.ceil(sx), Math.ceil(sy)); }} // draw entities small
    for(const c of SIM.companies){ ctx.fillStyle='#1565c0'; ctx.fillRect(c.x*sx-2,c.y*sy-2,4,4); }
    for(const s of SIM.sites){ ctx.fillStyle=s.status==='done'?'#6d4c41':'#ffb74d'; ctx.fillRect(s.x*sx-2,s.y*sy-2,4,4); }
    for(const p of SIM.citizens){ ctx.fillStyle=p.job?'#2e7d32':'#1e88e5'; ctx.fillRect(p.x*sx-1,p.y*sy-1,2,2); }
    if(window.PLAYER){ ctx.fillStyle='#ff5252'; ctx.fillRect(PLAYER.x*sx-2,PLAYER.y*sy-2,4,4); }
  }
  setInterval(draw,500);
  canvas.addEventListener('click',(e)=>{ const rect=canvas.getBoundingClientRect(); const x=Math.floor((e.clientX-rect.left)/ (canvas.width/MAP.width)); const y=Math.floor((e.clientY-rect.top)/ (canvas.height/MAP.height)); // center player
    if(window.PLAYER){ PLAYER.x = x+0.5; PLAYER.y = y+0.5; SIM.log(`Player teleported to ${x},${y}`); } });
})();
