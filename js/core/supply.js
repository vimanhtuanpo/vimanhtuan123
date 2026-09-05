// js/core/supply.js
// Basic market and material source (quarry)
(function(){
  const MARKET = {
    pricePerUnit: 1.0,
    volatility: 0.05,
    tick(){ // small random walk on price
      const change = (Math.random()*2-1) * this.volatility;
      this.pricePerUnit = Math.max(0.1, this.pricePerUnit * (1 + change));
    },
    buy(company, amount){
      const cost = amount * this.pricePerUnit;
      if(company.funds >= cost){ company.funds -= cost; company.materials += amount; SIM.log(`${company.name} buys ${amount} mats for ${Math.round(cost)}`); return true; }
      SIM.log(`${company.name} failed to buy ${amount} mats (not enough funds)`);
      return false;
    }
  };

  // Quarry: produces materials over time and sells to market
  const QUARRY = {
    productionRate: 10, // per market sell tick
    stock: 500,
    produce(){ this.stock += this.productionRate; }
  };

  window.MARKET = MARKET;
  window.QUARRY = QUARRY;
})();
