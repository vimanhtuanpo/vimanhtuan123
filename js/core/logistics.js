// js/core/logistics.js
(function(){
  // Simple vehicle that carries materials between two positions
  class Vehicle{
    constructor(id,x,y,capacity=100){ this.id=id; this.x=x; this.y=y; this.capacity=capacity; this.load=0; this.speed=0.2; this.path=null; this.pathIndex=0; this.state='idle'; this.targetSite=null; }
    assignPath(path, onComplete){ this.path=path; this.pathIndex=0; this.onComplete=onComplete; this.state='moving'; }
    tick(){ if(!this.path) return; if(this.pathIndex>=this.path.length){ if(this.onComplete) this.onComplete(this); this.path=null; this.state='idle'; return; } const node=this.path[this.pathIndex]; const tx=node[0]+0.5, ty=node[1]+0.5; const dx=tx-this.x, dy=ty-this.y; const d=Math.hypot(dx,dy); if(d<0.05){ this.pathIndex++; } else { this.x += dx/d*this.speed; this.y += dy/d*this.speed; } }
  }

  const Logistics = { vehicles:[], spawnVehicle(x,y){ const v=new Vehicle('V'+this.vehicles.length,x||5,y||5,100); this.vehicles.push(v); SIM.log(`Spawn vehicle ${v.id}`); return v }, tick(){ for(const v of this.vehicles) v.tick() } };

  // simple delivery: from quarry (tile) to company then to site
  Logistics.requestDelivery = function(company, site, amount){ // create vehicle that goes quarry->company->site
    if(QUARRY.stock < amount){ SIM.log('Not enough in quarry'); return false; }
    const quarryPos=[Math.floor(MAP.width/2), 1]; // simplify
    QUARRY.stock -= amount;
    const v = this.spawnVehicle(quarryPos[0], quarryPos[1]);
    // path to company
    const path1 = AStar.findPath([quarryPos[0],quarryPos[1]],[Math.floor(company.x),Math.floor(company.y)], MAP) || [];
    const path2 = AStar.findPath([Math.floor(company.x),Math.floor(company.y)],[Math.floor(site.x),Math.floor(site.y)], MAP) || [];
    v.assignPath(path1.concat(path2), (veh)=>{ veh.load = amount; site.status = 'ongoing'; site.progress += amount*0.2; SIM.log(`${veh.id} delivered ${amount} to ${site.id}`); });
    return true;
  };

  window.LOGISTICS = Logistics;
})();
