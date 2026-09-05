// js/ui/market.js
// market.js - UI for market/quarry and quick controls
// Renders market info into #market element and provides buy/sell controls.

(function(){
  function renderMarket() {
    const el = document.getElementById('market');
    if(!el) return;
    el.innerHTML = `
      <strong>Market</strong><br>
      Price / unit: <strong>${MARKET.pricePerUnit.toFixed(2)}</strong><br>
      Quarry stock: <strong>${QUARRY.stock}</strong><br>
      <div style="margin-top:6px">
        <button id="buy100">Buy 100</button>
        <button id="buy500">Buy 500</button>
        <button id="buy1000">Buy 1000</button>
      </div>
    `;
    el.querySelector('#buy100').onclick = ()=> marketBuy(100);
    el.querySelector('#buy500').onclick = ()=> marketBuy(500);
    el.querySelector('#buy1000').onclick = ()=> marketBuy(1000);
  }

  function marketBuy(amount) {
    // ask which company will buy - pick richest company by funds by default
    const company = SIM.companies.slice().sort((a,b)=>b.funds-a.funds)[0];
    if(!company) { alert('No company available'); return; }
    const success = MARKET.buy(company, amount);
    if(success) updateUI();
  }

  // update periodically
  setInterval(()=>{
    MARKET.tick();
    renderMarket();
  }, 2000);

  window.renderMarket = renderMarket;
})();
