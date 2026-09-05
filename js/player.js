// js/player.js
(function(){
  class Player{
    constructor(x,y){ this.x=x||5; this.y=y||5; this.speed=0.18; this.vx=0; this.vy=0; this.inventory={materials:0}; this.name='Player'; }
    update(){ // simple physics
      this.x += this.vx; this.y += this.vy; // keep inside map
      this.x = Math.max(0.2, Math.min(MAP.width-0.2, this.x));
      this.y = Math.max(0.2, Math.min(MAP.height-0.2, this.y));
    }
    setVelocity(vx,vy){ this.vx=vx; this.vy=vy; }
    interact(){ // interact with nearby companies/sites
      // find nearest site within 1 tile
      let nearest=null, nd=Infinity;
      for(const s of SIM.sites){ const d=Math.hypot(this.x-s.x, this.y-s.y); if(d<nd){nd=d; nearest=s;} }
      if(nearest && nd<1.2){ // if site waiting for materials, transfer from player inv
        if(nearest.status==='waiting' && this.inventory.materials>0){ nearest.status='ongoing'; nearest.progress+=Math.min(this.inventory.materials, 10); this.inventory.materials=0; SIM.log(`${this.name} supplies materials to ${nearest.id}`); return; }
      }
      // interact with company
      let nearestCo=null; nd=Infinity; for(const c of SIM.companies){ const d=Math.hypot(this.x-c.x, this.y-c.y); if(d<nd){nd=d; nearestCo=c;} }
      if(nearestCo && nd<1.2){ // collect wages? buy materials
        SIM.log(`${this.name} interacts with ${nearestCo.name}`);
      }
    }
  }
  window.PLAYER = new Player(6,6);
})();
