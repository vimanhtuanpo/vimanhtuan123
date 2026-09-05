// js/ui/particles.js
// particles.js - very simple particle emitter for build completion effect
(function(){
  const canvas = document.getElementById('world');
  const ctx = canvas.getContext('2d');
  const particles = [];

  function spawn(x,y,count=14){
    for(let i=0;i<count;i++){
      particles.push({
        x, y,
        vx: (Math.random()*2-1) * 0.8,
        vy: (Math.random()*2-1) * 0.8 - 0.5,
        life: 40 + Math.floor(Math.random()*30),
        size: 1 + Math.random()*3,
        color: ['#ffb74d','#ff8a65','#ffd54f'][Math.floor(Math.random()*3)]
      });
    }
  }

  function tickAndDraw(){
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.life--;
      if(p.life<=0) particles.splice(i,1);
      else {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
      }
    }
    requestAnimationFrame(drawLoop);
  }

  function drawLoop(){
    // called within main render loop; this helper intentionally doesn't clear canvas
  }

  window.PARTICLES = { spawn, particles };
})();
