// js/main.js - bootstrap and UI wiring
// This file wires SIM, Renderer, AStar (loaded earlier)

// create MAP if missing (used by AStar)
if(typeof MAP==='undefined'){
  window.MAP={width:30,height:20,tiles:[]};
  for(let y=0;y<MAP.height;y++) for(let x=0;x<MAP.width;x++){
    let t=0; if(y===10||x===8||x===22) t=1; if((x>5&&x<10&&y>2&&y<6)||(x>18&&x<25&&y>12&&y<17)) t=2; MAP.tiles.push(t);
  }
}

// helper functions used by AStar and renderer
function idx(x,y){return y*MAP.width+x}
function tileAt(x,y){if(x<0||y<0||x>=MAP.width||y>=MAP.height)return 0;return MAP.tiles[idx(x,y)];}
window.tileAt=tileAt; window.MAP=MAP; // expose globals

// Load core modules (they attach to window: AStar, SIM, Renderer)
// SIM and Renderer defined in their files

// UI handlers
const startBtn=document.getElementById('start'); const pauseBtn=document.getElementById('pause'); const tickBtn=document.getElementById('tickOnce');
const addCitizenBtn=document.getElementById('addCitizen'); const addCompanyBtn=document.getElementById('addCompany'); const addSiteBtn=document.getElementById('addSite'); const postJobBtn=document.getElementById('postJob');
const speedSlider=document.getElementById('speed'); const saveBtn=document.getElementById('save'); const loadBtn=document.getElementById('load');

let running=false, speed=2, interval=null;
function updateUI(){Renderer.render(); // lists
  const companiesDiv=document.getElementById('companies'); companiesDiv.innerHTML=''; for(const c of SIM.companies){const div=document.createElement('div'); div.className='item'; div.innerHTML=`<strong>${c.name}</strong> [${c.id}]<br>funds=${Math.round(c.funds)} mats=${Math.round(c.materials)} <div style="margin-top:6px"><button data-act="post" data-id="${c.id}">Post job</button> <button data-act="site" data-id="${c.id}">Add site</button> <button data-act="mat" data-id="${c.id}">Buy mats</button></div>`; companiesDiv.appendChild(div);} companiesDiv.querySelectorAll('button').forEach(b=>{b.onclick=(e)=>{const co=SIM.companies.find(x=>x.id===e.target.dataset.id); const act=e.target.dataset.act; if(act==='post'){co.postJob(1,5); updateUI()} if(act==='site'){SIM.addSite(co.id); updateUI()} if(act==='mat'){if(co.funds>200){co.materials+=200;co.funds-=200;SIM.log(`${co.name} buys materials`); updateUI()}}}});

  const sitesDiv=document.getElementById('sites'); sitesDiv.innerHTML=''; for(const s of SIM.sites){const co=SIM.companies.find(c=>c.id===s.companyId); const div=document.createElement('div'); div.className='item'; div.innerHTML=`<strong>${s.id}</strong> (${co?.name||s.companyId})<br>status=${s.status} progress=${Math.round(s.progress)}/${s.required} cost=${s.cost}`; sitesDiv.appendChild(div);} 
  const citDiv=document.getElementById('citizens'); citDiv.innerHTML=''; for(const c of SIM.citizens){const div=document.createElement('div'); div.className='item'; div.innerHTML=`<strong>${c.id}</strong> skill=${c.skill}<br>money=${Math.round(c.money)} happy=${c.happiness.toFixed(2)} job=${c.job||'-'}`; citDiv.appendChild(div);} 
  const log=document.getElementById('log'); log.innerHTML=''; for(const l of SIM.logLines.slice(0,120)){const p=document.createElement('div'); p.textContent=l; log.appendChild(p)}
}

function start(){if(running) return; running=true; interval=setInterval(()=>{for(let i=0;i<speed;i++) SIM.tick(); updateUI()},300)}
function stop(){running=false; clearInterval(interval); interval=null}

startBtn.onclick=start; pauseBtn.onclick=stop; tickBtn.onclick=()=>{SIM.tick(); updateUI()}; addCitizenBtn.onclick=()=>{SIM.addCitizen(); updateUI()}; addCompanyBtn.onclick=()=>{SIM.addCompany(); updateUI()}; addSiteBtn.onclick=()=>{if(SIM.companies.length==0)SIM.addCompany(); const co=SIM.companies[Math.floor(Math.random()*SIM.companies.length)]; SIM.addSite(co.id); updateUI()}; postJobBtn.onclick=()=>{if(SIM.companies.length==0)SIM.addCompany(); const co=SIM.companies[Math.floor(Math.random()*SIM.companies.length)]; co.postJob(1,5); updateUI()}; speedSlider.oninput=(e)=>{speed=parseInt(e.target.value,10)}; saveBtn.onclick=()=>{const data=JSON.stringify({map:MAP,sim:SIM}); localStorage.setItem('sim_v2',data); alert('Saved')}; loadBtn.onclick=()=>{const d=localStorage.getItem('sim_v2'); if(!d){alert('No save'); return} const obj=JSON.parse(d); // partial restore
 alert('Loaded (partial restore)')};

// initial bootstrap
if(SIM.citizens.length===0){ for(let i=0;i<40;i++)SIM.addCitizen(); const A=SIM.addCompany('BuildCo',8,4); const B=SIM.addCompany('UrbanWorks',22,14); SIM.addSite(A.id); SIM.addSite(B.id); }
updateUI(); setInterval(()=>{Renderer.render()},1200);

// canvas click to add citizen
const canvasEl=document.getElementById('world'); canvasEl.onclick=(e)=>{const r=canvasEl.getBoundingClientRect(); const x=(e.clientX-r.left)/Renderer.TILE, y=(e.clientY-r.top)/Renderer.TILE; SIM.addCitizen(1,x,y); updateUI()}
