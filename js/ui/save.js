// js/ui/save.js
(function(){
  const exportBtn = document.getElementById('export'); const importBtn = document.getElementById('importBtn'); const importFile = document.getElementById('importFile');
  exportBtn.onclick = ()=>{
    const data = {map:MAP, sim:SIM, quarry:QUARRY, market:MARKET};
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sim-export.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  importBtn.onclick = ()=> importFile.click();
  importFile.onchange = (e)=>{
    const f = e.target.files[0]; if(!f) return; const reader = new FileReader(); reader.onload = ()=>{ try{ const obj=JSON.parse(reader.result); if(obj.sim) { // partial restore
        // restore simple fields
        SIM.citizens = obj.sim.citizens || SIM.citizens; SIM.companies = obj.sim.companies || SIM.companies; SIM.sites = obj.sim.sites || SIM.sites; SIM.jobs = obj.sim.jobs || SIM.jobs; SIM.log('Imported save file (partial)'); updateUI(); } else alert('Invalid save file'); }catch(err){alert('Failed to parse file');} }; reader.readAsText(f);
  };
})();
