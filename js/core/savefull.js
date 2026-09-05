// js/core/savefull.js
// savefull.js - full export/import functions for complete state (improves over partial import)
(function(){
  function exportFullState() {
    const state = {
      map: MAP,
      sim: {
        ticks: SIM.ticks,
        citizens: SIM.citizens.map(c=>Object.assign({}, c)),
        companies: SIM.companies.map(c=>Object.assign({}, c)),
        sites: SIM.sites.map(s=>Object.assign({}, s)),
        jobs: SIM.jobs
      },
      market: { pricePerUnit: MARKET.pricePerUnit, volatility: MARKET.volatility },
      quarry: { stock: QUARRY.stock, productionRate: QUARRY.productionRate },
      vehicles: VEHICLES ? VEHICLES.pool.map(v=>({
        id:v.id,x:v.x,y:v.y,capacity:v.capacity,load:v.load,state:v.state,meta:v.meta
      })) : [],
      contracts: CONTRACTS ? CONTRACTS.list.map(c=>Object.assign({},c)) : []
    };
    return state;
  }

  function importFullState(obj) {
    if(!obj) return false;
    try {
      if(obj.map) {
        window.MAP = obj.map;
        window.tileAt = function(x,y){ if(x<0||y<0||x>=MAP.width||y>=MAP.height) return 0; return MAP.tiles[y*MAP.width+x]; };
      }
      if(obj.sim) {
        SIM.ticks = obj.sim.ticks || 0;
        SIM.citizens = obj.sim.citizens || [];
        SIM.companies = obj.sim.companies || [];
        SIM.sites = obj.sim.sites || [];
        SIM.jobs = obj.sim.jobs || {};
      }
      if(obj.market) { MARKET.pricePerUnit = obj.market.pricePerUnit || MARKET.pricePerUnit; }
      if(obj.quarry) { QUARRY.stock = obj.quarry.stock || QUARRY.stock; }
      if(obj.vehicles && VEHICLES) {
        VEHICLES.pool = obj.vehicles.map(v=>{ const nv = VEHICLES.spawn(v.x,v.y,v.capacity); nv.load=v.load; nv.state=v.state; nv.meta=v.meta||{}; return nv; });
      }
      if(obj.contracts && CONTRACTS) {
        CONTRACTS.list = obj.contracts;
      }
      SIM.log('Imported full state');
      return true;
    } catch(err) { console.error(err); return false; }
  }

  window.exportFullState = exportFullState;
  window.importFullState = importFullState;
})();
