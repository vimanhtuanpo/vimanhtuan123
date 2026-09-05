// js/ui/contracts-ui.js
// contracts-ui.js - UI for contracts list and accept/fulfill actions

(function(){
  function renderContracts() {
    const el = document.getElementById('contracts');
    if(!el) return;
    let html = '<strong>Contracts</strong><br>';
    for(const c of CONTRACTS.list) {
      if(c.failed) continue;
      html += `<div style="margin-top:6px;padding:6px;border:1px solid #ddd;border-radius:6px">
        <strong>${c.id}</strong> reward=${c.reward} req=${c.required} deadline=${c.deadline}<br>
        company=${c.company||'-'} fulfilled=${c.fulfilled}/${c.required} <br>
        <div style="margin-top:6px">
          ${c.company ? '' : `<button data-accept="${c.id}">Accept</button>`}
          ${c.company ? `<button data-complete="${c.id}">Force Complete</button>` : ''}
        </div>
      </div>`;
    }
    el.innerHTML = html;
    el.querySelectorAll('[data-accept]').forEach(btn=>{
      btn.onclick = (e)=>{
        const id = e.target.dataset.accept;
        const contract = CONTRACTS.list.find(x=>x.id===id);
        const co = SIM.companies[0] || null;
        if(contract && co) { CONTRACTS.accept(co, contract); updateUI(); }
      };
    });
    el.querySelectorAll('[data-complete]').forEach(btn=>{
      btn.onclick = (e)=>{
        const id = e.target.dataset.complete;
        const contract = CONTRACTS.list.find(x=>x.id===id);
        if(contract){ contract.fulfilled = contract.required; SIM.log(`${contract.id} manually completed`); updateUI(); }
      };
    });
  }

  // refresh every few seconds
  setInterval(()=> { CONTRACTS.generate(); renderContracts(); }, 8000);

  window.renderContractsUI = renderContracts;
})();
