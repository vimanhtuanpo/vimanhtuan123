// js/ui/input.js
(function(){
  const keys = {};
  const speed = 0.12;
  function keyDown(e){ keys[e.key.toLowerCase()] = true; updateVelocity(); if(e.key==='e' || e.key==='E'){ if(window.PLAYER) PLAYER.interact(); } }
  function keyUp(e){ keys[e.key.toLowerCase()] = false; updateVelocity(); }
  function updateVelocity(){ if(!window.PLAYER) return; let vx=0, vy=0; if(keys['arrowup']||keys['w']) vy=-PLAYER.speed; if(keys['arrowsdown']||keys['s']) vy=PLAYER.speed; if(keys['arrowleft']||keys['a']) vx=-PLAYER.speed; if(keys['arrowright']||keys['d']) vx=PLAYER.speed; PLAYER.setVelocity(vx,vy); }

  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);

  // mouse interactions: click to move player (pathfinding) with A*
  const canvas = document.getElementById('world');
  canvas.addEventListener('dblclick', (e)=>{
    if(!window.PLAYER) return;
    const rect = canvas.getBoundingClientRect(); const tx = (e.clientX-rect.left)/Renderer.TILE; const ty = (e.clientY-rect.top)/Renderer.TILE;
    const path = AStar.findPath([Math.floor(PLAYER.x),Math.floor(PLAYER.y)], [Math.floor(tx), Math.floor(ty)], MAP);
    if(path){ // set as player.path (simple follow)
      PLAYER.path = path; PLAYER.pathIndex = 0; SIM.log(`Player path set to ${path.length} nodes`);
      // set velocity will be handled by main loop following path
    }
  });
})();
