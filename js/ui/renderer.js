// js/ui/renderer.js - updated to draw trees and houses sprites
(function(){
  const canvas=document.getElementById('world'); const ctx=canvas.getContext('2d');
  const TILE=20; canvas.width=MAP.width*TILE; canvas.height=MAP.height*TILE;

  // preload images
  const images = {};
  const toLoad = {
    'tree':'assets/tree.svg',
    'house':'assets/house.svg',
    'road':'assets/road.svg',
    'site':'assets/site.svg',
    'company':'assets/company.svg'
  };
  let loadedCount=0, totalCount=Object.keys(toLoad).length;
  for(const k in toLoad){ const img=new Image(); img.src=toLoad[k]; img.onload=()=>{ loadedCount++; }; images[k]=img; }

  window.Renderer = {
    TILE:TILE,
    ctx:ctx,
    images:images,
    drawMap:function(){ for(let y=0;y<MAP.height;y++){ for(let x=0;x<MAP.width;x++){ const t = tileAt(x,y); const px = x*TILE, py = y*TILE; if(t===0){ ctx.fillStyle='#cdebbd'; ctx.fillRect(px,py,TILE,TILE); }
          else if(t===1){ // road
            if(images['road'] && images['road'].complete){ ctx.drawImage(images['road'], px, py, TILE, TILE); } else { ctx.fillStyle='#bdbdbd'; ctx.fillRect(px,py,TILE,TILE); }
          } else if(t===2){ ctx.fillStyle='#f6e0b5'; ctx.fillRect(px,py,TILE,TILE); }
          else if(t===4){ // tree tile, draw grass + tree
            ctx.fillStyle='#99c47a'; ctx.fillRect(px,py,TILE,TILE);
            if(images['tree'] && images['tree'].complete) ctx.drawImage(images['tree'], px+2, py+2, TILE-4, TILE-4);
          } else if(t===5){ // house
            ctx.fillStyle='#dbeee8'; ctx.fillRect(px,py,TILE,TILE);
            if(images['house'] && images['house'].complete) ctx.drawImage(images['house'], px+1, py+1, TILE-2, TILE-2);
          } else { ctx.fillStyle='#eee'; ctx.fillRect(px,py,TILE,TILE); }
          ctx.strokeStyle='rgba(0,0,0,0.03)'; ctx.strokeRect(px,py,TILE,TILE);
        }
      }
    },
    drawEntities:function(){ const ctx=this.ctx;
      for(const s of SIM.sites){ const px=s.x*TILE-8, py=s.y*TILE-8; if(images['site'] && images['site'].complete) ctx.drawImage(images['site'], px, py, 24, 24); else { ctx.fillStyle=(s.status==='done'?'#8d6e63':'#ffcc80'); ctx.fillRect(px,py,20,20); } ctx.fillStyle='#000'; ctx.font='10px Arial'; ctx.fillText(s.id,px,py-6); }
      for(const c of SIM.companies){ const px=c.x*TILE-10, py=c.y*TILE-10; if(images['company'] && images['company'].complete) ctx.drawImage(images['company'], px, py, 24, 24); else { ctx.beginPath(); ctx.fillStyle='#90caf9'; ctx.arc(px+10,py+10,10,0,Math.PI*2); ctx.fill(); ctx.stroke(); } ctx.fillStyle='#000'; ctx.fillText(c.name,px+26,py+10); }
      for(const w of SIM.citizens){ const px=w.x*TILE, py=w.y*TILE; ctx.beginPath(); ctx.fillStyle=w.job?'#2e7d32':'#1e88e5'; ctx.arc(px,py,3,0,Math.PI*2); ctx.fill(); }
      if(window.PLAYER){ const p=window.PLAYER; const px=p.x*TILE, py=p.y*TILE; ctx.beginPath(); ctx.fillStyle='#ff5252'; ctx.arc(px,py,6,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#8b0000'; ctx.stroke(); ctx.fillStyle='#fff'; ctx.font='10px Arial'; ctx.fillText('YOU', px+8, py+4); if(p.path){ ctx.beginPath(); ctx.strokeStyle='rgba(255,82,82,0.6)'; for(let i=0;i<p.path.length;i++){ const n=p.path[i]; const cx=n[0]*TILE+TILE/2, cy=n[1]*TILE+TILE/2; if(i===0) ctx.moveTo(cx,cy); else ctx.lineTo(cx,cy); } ctx.stroke(); } }
    },
    render:function(){ this.ctx.clearRect(0,0,canvas.width,canvas.height); this.drawMap(); this.drawEntities(); }
  };
})();
