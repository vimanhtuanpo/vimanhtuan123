// js/ui/renderer.js
(function(){
  const canvas=document.getElementById('world'); const ctx=canvas.getContext('2d');
  const TILE=24; canvas.width=MAP.width*TILE; canvas.height=MAP.height*TILE;
  window.Renderer={
    TILE:TILE,
    ctx:ctx,
    drawMap:function(){for(let y=0;y<MAP.height;y++){for(let x=0;x<MAP.width;x++){const t=tileAt(x,y); if(t===0) ctx.fillStyle='#cdebbd'; else if(t===1) ctx.fillStyle='#bdbdbd'; else if(t===2) ctx.fillStyle='#f6e0b5'; else ctx.fillStyle='#ffe082'; ctx.fillRect(x*TILE,y*TILE,TILE,TILE); ctx.strokeStyle='rgba(0,0,0,0.04)'; ctx.strokeRect(x*TILE,y*TILE,TILE,TILE);} }},
    drawEntities:function(){const ctx=this.ctx;
      for(const s of SIM.sites){const px=s.x*TILE-10, py=s.y*TILE-10; ctx.fillStyle=(s.status==='done'?'#8d6e63':(s.status==='ongoing'?'#ffcc80':'#eeeeee')); ctx.fillRect(px,py,20,20); ctx.strokeRect(px,py,20,20); ctx.fillStyle='#ddd'; ctx.fillRect(px,py+22,20,4); const p=Math.max(0,Math.min(1,s.progress/s.required)); ctx.fillStyle='#4caf50'; ctx.fillRect(px,py+22,20*p,4); ctx.fillStyle='#000'; ctx.font='10px Arial'; ctx.fillText(s.id,px,py-4);} 
      for(const c of SIM.companies){const px=c.x*TILE-10, py=c.y*TILE-10; ctx.beginPath(); ctx.fillStyle='#90caf9'; ctx.arc(px+10,py+10,10,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.fillStyle='#000'; ctx.fillText(c.name,px+22,py+10);} 
      for(const w of SIM.citizens){const px=w.x*TILE,py=w.y*TILE; ctx.beginPath(); ctx.fillStyle=w.job?'#2e7d32':'#1e88e5'; ctx.arc(px,py,3,0,Math.PI*2); ctx.fill(); }
    },
    render:function(){this.ctx.clearRect(0,0,canvas.width,canvas.height); this.drawMap(); this.drawEntities(); }
  };
})();
