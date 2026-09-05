// js/core/vehicles.js
// vehicles.js - vehicle pool + delivery task queue
// Integrates with LOGISTICS and SIM. Vehicles travel on A* paths and call callbacks on arrival.

(function(){
  class Vehicle {
    constructor(id, x, y, capacity = 100) {
      this.id = id;
      this.x = x; this.y = y;
      this.capacity = capacity;
      this.load = 0;
      this.speed = 0.22;
      this.path = null;
      this.pathIndex = 0;
      this.state = 'idle'; // idle, moving, loading, unloading
      this.meta = {}; // arbitrary metadata (companyId, siteId, stage)
    }

    assign(path, meta = {}, onComplete = null) {
      this.path = path || [];
      this.pathIndex = 0;
      this.state = 'moving';
      this.meta = meta || {};
      this.onComplete = onComplete;
    }

    tick() {
      if (!this.path || this.pathIndex >= this.path.length) {
        if (this.state === 'moving') {
          // reached destination
          this.state = 'idle';
          if (typeof this.onComplete === 'function') this.onComplete(this);
        }
        return;
      }
      const node = this.path[this.pathIndex];
      const tx = node[0] + 0.5, ty = node[1] + 0.5;
      const dx = tx - this.x, dy = ty - this.y;
      const d = Math.hypot(dx, dy);
      if (d < 0.06) {
        this.pathIndex++;
      } else {
        this.x += (dx / d) * this.speed;
        this.y += (dy / d) * this.speed;
      }
    }
  }

  const Vehicles = {
    pool: [],
    spawn(x, y, capacity) {
      const v = new Vehicle('V' + this.pool.length, x || 1, y || 1, capacity || 100);
      this.pool.push(v);
      SIM.log(`Vehicle ${v.id} spawned`);
      return v;
    },
    tick() {
      for (const v of this.pool) v.tick();
    },
    // high-level delivery: quarry -> company -> site
    deliverFromQuarryToSite(company, site, amount) {
      if (!company || !site) return false;
      if (QUARRY.stock < amount) { SIM.log('Quarry lacks stock'); return false; }
      // reduce quarry, schedule vehicle
      QUARRY.stock -= amount;
      const quarryPos = this.findQuarryTile();
      const v = this.spawn(quarryPos[0] + 0.5, quarryPos[1] + 0.5, Math.max(50, amount));
      const path1 = AStar.findPath([Math.floor(v.x), Math.floor(v.y)], [Math.floor(company.x), Math.floor(company.y)], MAP) || [];
      const path2 = AStar.findPath([Math.floor(company.x), Math.floor(company.y)], [Math.floor(site.x), Math.floor(site.y)], MAP) || [];
      const fullPath = path1.concat(path2);
      v.assign(fullPath, {companyId: company.id, siteId: site.id, amount: amount}, (veh) => {
        // On completion: deliver materials and update site
        site.status = 'ongoing';
        site.progress += amount * 0.25;
        SIM.log(`${veh.id} delivered ${amount} to ${site.id}`);
      });
      return true;
    },
    findQuarryTile() {
      // simple heuristic: quarry at top middle by default (can be improved)
      return [Math.floor(MAP.width / 2), 1];
    }
  };

  window.VEHICLES = Vehicles;
})();
