// js/core/contracts.js
(function(){
  const Contracts = { list: [], counter:0, generate(){ const id='CT'+(this.counter++); const reward=200+Math.floor(Math.random()*800); const required=80+Math.floor(Math.random()*220); const deadline=30+Math.floor(Math.random()*120); const c={id,reward,required,deadline,fulfilled:0,company:null}; this.list.push(c); SIM.log(`New contract ${id} reward=${reward} req=${required}`); return c }, accept(company, contract){ if(contract.company) return false; contract.company=company.id; SIM.log(`${company.name} accepts ${contract.id}`); return true }, tick(){ // reduce deadlines
    for(const c of this.list){ if(!c.company) continue; c.deadline--; if(c.deadline<=0 && c.fulfilled < c.required){ // failed
        SIM.log(`Contract ${c.id} failed`); // maybe penalty
        // remove
        c.failed=true;
      }
    }
  } };

  window.CONTRACTS = Contracts;
})();
