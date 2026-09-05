// main.js - separated advanced simulator with tile map
// Open index.html via a local server (recommended) or modern browser that allows local fetch.

// Tile map (grid) — embedded to avoid fetch issues when opened as file://
const MAP = {
  width:30, height:20,
  // 0=grass,1=road,2=industrial,3=site
  tiles: []
};
// generate simple procedural map with roads
(function genMap(){
  for(let y=0;y<MAP.height;y++){
    for(let x=0;x<MAP.width;x++){
      let t=0;
      if (y===10 || x===8 || x===22) t=1; // roads
      if ((x>5 && x<10 && y>2 && y<6)||(x>18 && x<25 && y>12 && y<17)) t=2; // industrial zones
      MAP.tiles.push(t);
    }
  }
})();

// Utilities
function idx(x,y){return y*MAP.width+x}
function tileAt(x,y){if(x<0||y<0||x>=MAP.width||y>=MAP.height)return 0;return MAP.tiles[idx(x,y)];}

class Entity{constructor(id,x,y){this.id=id;this.x=x;this.y=y}}

class Citizen extends Entity{
  constructor(id,x,y,skill=1){super(id,x,y);this.skill=skill;this.money=100;this.happiness=1;this.job=null;this.target=null;this.speed=0.12}
  tick(){this.money-=0.1; if(this.money<0)this.happiness-=0.01}
}

class Company extends Entity{
  constructor(id,name,x,y){super(id,x,y);this.name=name;this.funds=2000;this.materials=500;this.openings=[]}
  postJob(skillReq,wage){const id=`J${Date.now()}${Math.floor(Math.random()*99)}`;const j={id,companyId:this.id,skillReq,wage,filled:null};this.openings.push(id);SIM.jobs[id]=j;SIM.log(`${this.name} posts ${id} w=${wage}`);return j}
}

class Site extends Entity{
  constructor(id,companyId,x,y,required=300,cost=250){super(id,x,y);this.companyId=companyId;this.required=required;this.progress=0;this.cost=cost;this.status='planned'}
  start(company){if(this.status!=='planned'&&this.status!=='waiting')return false;if(company.materials>=this.cost){company.materials-=this.cost;this.status='ongoing';SIM.log(`Site ${this.id} started`);return true}else{this.status='waiting';return false}}
  applyWork(h){if(this.status!=='ongoing')return;this.progress+=h;if(this.progress>=this.required){this.status='done';SIM.log(`Site ${this.id} finished`);}}
}

const SIM = {
  width:MAP.width, height:MAP.height, ticks:0,
  citizens:[], companies:[], sites:[], jobs:{}, logLines:[],
  log(s){this.logLines.unshift(`[${this.ticks}] ${s}`); if(this.logLines.length>300)this.logLines.pop();},
  addCitizen(skill,x,y){const id=`C${this.citizens.length}`;const cx=x||((Math.random()*this.width)|0);const cy=y||((Math.random()*this.height)|0);const c=new Citizen(id,cx+0.5,cy+0.5,skill||(1+Math.floor(Math.random()*6)));this.citizens.push(c);this.log(`Add citizen ${id} s=${c.skill}`);return c},
  addCompany(name,x,y){const id=`CO${this.companies.length}`;const cx=x||8+Math.random()*14;const cy=y||3+Math.random()*12;const c=new Company(id,name||`Company ${this.companies.length}`,cx,cy);this.companies.push(c);this.log(`Add company ${c.name}`);return c},
  addSite(companyId,x,y,required,cost){const id=`S${this.sites.length}`;const co=this.companies.find(c=>c.id===companyId);if(!co)return null;const sx=x||co.x+ (Math.random()*3-1);const sy=y||co.y+ (Math.random()*3-1);const s=new Site(id,companyId,sx,sy,required||200,cost||200);this.sites.push(s);this.log(`Add site ${id} for ${co.name}`);return s},
  findOpenJobs(){return Object.values(this.jobs).filter(j=>!j.filled)},
  match(){const open=this.findOpenJobs().sort((a,b)=>b.wage-a.wage);for(const c of this.citizens) if(!c.job){let best=null,bestScore=-1;for(const j of open){if(c.skill<j.skillReq)continue;const co=this.companies.find(x=>x.id===j.companyId);const dist=Math.hypot(c.x-co.x,c.y-co.y)+1;const score=j.wage/dist; if(score>bestScore){bestScore=score;best=j}} if(best){best.filled=c.id;c.job=best.id;c.target=this.sites.find(s=>s.companyId===best.companyId && s.status==='ongoing')?.id||null;this.log(`${c.id} hired->${best.id}`)}}
  },
  pay(){for(const id in this.jobs){const j=this.jobs[id]; if(j.filled){const co=this.companies.find(c=>c.id===j.companyId);const w=this.citizens.find(c=>c.id===j.filled); if(co.funds>=j.wage){co.funds-=j.wage; w.money+=j.wage}else{w.happiness-=0.05; this.log(`${co.name} can't pay ${j.id}`)}}}},
  work(){for(const co of this.companies){const coSites=this.sites.filter(s=>s.companyId===co.id && s.status==='ongoing'); if(coSites.length===0)continue;const empJobs=co.openings.map(id=>this.jobs[id]).filter(j=>j&&j.filled); for(let i=0;i<empJobs.length;i++){const j=empJobs[i];const worker=this.citizens.find(c=>c.id===j.filled); if(!worker)continue; // move towards site
      const site=coSites[i%coSites.length]; if(worker.target!==site.id)worker.target=site.id; // move
      const dx=site.x-worker.x, dy=site.y-worker.y; const d=Math.hypot(dx,dy);
      if(d>0.3){worker.x+=dx/d*worker.speed; worker.y+=dy/d*worker.speed;} else { // contribute
        const out=1*(1+(worker.skill-1)*0.2);
        site.applyWork(out);
      }
    }
  }},
  events(){if(Math.random()<0.012){const co=this.companies[(Math.random()*this.companies.length)|0];const gain=200+Math.floor(Math.random()*1000);co.funds+=gain;this.log(`${co.name} gets contract +${gain}`)} if(Math.random()<0.006){const s=this.sites[(Math.random()*this.sites.length)|0];if(s&&s.status==='ongoing'){s.status='waiting';this.log(`Site ${s.id} lacks materials`)}}},
  cleanup(){for(const id in this.jobs){const j=this.jobs[id]; if(j.filled){const w=this.citizens.find(c=>c.id===j.filled); if(!w||w.happiness<=0){if(w)w.job=null; j.filled=null; this.log(`${j.filled||'?' } left ${j.id}`)}}}},
  tick(){this.ticks++; // companies may post
    for(const co of this.companies) if(co.funds>300 && Math.random()<0.03){const sk=1+Math.floor(Math.random()*5);const w=3+Math.floor(Math.random()*8);const j=co.postJob?co.postJob(sk,w):null; if(j){co.openings.push(j.id)}}
    // start sites
    for(const s of this.sites){const co=this.companies.find(c=>c.id===s.companyId);s.start(co)}
    this.match(); this.pay(); this.work(); for(const c of this.citizens)c.tick(); this.events(); this.cleanup(); if(this.ticks%30===0)this.log(`Summary ticks=${this.ticks} citizens=${this.citizens.length}`)
  }
}

// UI & rendering
const canvas=document.getElementById('world');const ctx=canvas.getContext('2d');const TILE=24;canvas.width=MAP.width*TILE;canvas.height=MAP.height*TILE;

function drawMap(){for(let y=0;y<MAP.height;y++){for(let x=0;x<MAP.width;x++){const t=tileAt(x,y); if(t===0){ctx.fillStyle='#cdebbd'}else if(t===1){ctx.fillStyle='#bdbdbd'}else if(t===2){ctx.fillStyle='#f6e0b5'}else{ctx.fillStyle='#ffe082'} ctx.fillRect(x*TILE,y*TILE,TILE,TILE);}}}

function drawEntities(){// sites
  for(const s of SIM.sites){const px=s.x*TILE-10, py=s.y*TILE-10; ctx.fillStyle=(s.status==='done'?'#8d6e63':(s.status==='ongoing'?'#ffcc80':'#eeeeee')); ctx.fillRect(px,py,20,20); ctx.strokeRect(px,py,20,20); // progress
    ctx.fillStyle='#ddd'; ctx.fillRect(px,py+22,20,4); const p=Math.max(0,Math.min(1,s.progress/s.required)); ctx.fillStyle='#4caf50'; ctx.fillRect(px,py+22,20*p,4); ctx.fillStyle='#000'; ctx.font='10px Arial'; ctx.fillText(s.id,px,py-4);
  }
  // companies
  for(const c of SIM.companies){const px=c.x*TILE-10, py=c.y*TILE-10; ctx.beginPath(); ctx.fillStyle='#90caf9'; ctx.arc(px+10,py+10,10,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.fillStyle='#000'; ctx.fillText(c.name,px+22,py+10);}
  // citizens
  for(const w of SIM.citizens){const px=w.x*TILE,py=w.y*TILE; ctx.beginPath(); ctx.fillStyle=w.job?'#2e7d32':'#1e88e5'; ctx.arc(px,py,3,0,Math.PI*2); ctx.fill();}
}

function render(){ctx.clearRect(0,0,canvas.width,canvas.height);drawMap();drawEntities();}

function updateUI(){render(); // lists
  const companiesDiv=document.getElementById('companies');companiesDiv.innerHTML='';for(const c of SIM.companies){const div=document.createElement('div');div.className='item';div.innerHTML=`<strong>${c.name}</strong> [${c.id}]<br>funds=${Math.round(c.funds)} materials=${Math.round(c.materials)}<div style="margin-top:6px"><button data-act="post" data-id="${c.id}">Post job</button> <button data-act="site" data-id="${c.id}">Add site</button> <button data-act="mat" data-id="${c.id}">Buy mats</button></div>`;companiesDiv.appendChild(div)}companiesDiv.querySelectorAll('button').forEach(b=>{b.onclick=(e)=>{const id=e.target.dataset.id;const act=e.target.dataset.act;const co=SIM.companies.find(x=>x.id===id); if(act==='post')SIM.jobs[`J${Date.now()}${Math.floor(Math.random()*99)}`]={id:`J${Date.now()}${Math.floor(Math.random()*99)}`,companyId:co.id,skillReq:1,wage:5,filled:null},updateUI(); if(act==='site'){SIM.addSite(co.id);updateUI();} if(act==='mat'){if(co.funds>200){co.materials+=200;co.funds-=200;SIM.log(`${co.name} buys materials`);updateUI()}}}});

  const sitesDiv=document.getElementById('sites');sitesDiv.innerHTML='';for(const s of SIM.sites){const co=SIM.companies.find(c=>c.id===s.companyId);const div=document.createElement('div');div.className='item';div.innerHTML=`<strong>${s.id}</strong> (${co?.name||s.companyId})<br>status=${s.status} prog=${Math.round(s.progress)}/${s.required} cost=${s.cost}`;sitesDiv.appendChild(div)}

  const citDiv=document.getElementById('citizens');citDiv.innerHTML='';for(const c of SIM.citizens){const div=document.createElement('div');div.className='item';div.innerHTML=`<strong>${c.id}</strong> skill=${c.skill}<br>money=${Math.round(c.money)} happy=${c.happiness.toFixed(2)} job=${c.job||'-'}`;citDiv.appendChild(div)}

  const log=document.getElementById('log');log.innerHTML='';for(const l of SIM.logLines.slice(0,120)){const p=document.createElement('div');p.textContent=l;log.appendChild(p)}
}

// bootstrap
for(let i=0;i<40;i++)SIM.addCitizen(); const A=SIM.addCompany('BuildCo',8,4);const B=SIM.addCompany('UrbanWorks',22,14);SIM.addSite(A.id);SIM.addSite(B.id);

let running=false,speed=2,interval=null;
function start(){if(running)return;running=true;interval=setInterval(()=>{for(let i=0;i<speed;i++){SIM.tick()}updateUI()},300)}
function stop(){running=false;clearInterval(interval);interval=null}

// controls
document.getElementById('start').onclick=start;document.getElementById('pause').onclick=stop;document.getElementById('tickOnce').onclick=()=>{SIM.tick();updateUI()};document.getElementById('addCitizen').onclick=()=>{SIM.addCitizen();updateUI()};document.getElementById('addCompany').onclick=()=>{SIM.addCompany();updateUI()};document.getElementById('addSite').onclick=()=>{if(SIM.companies.length==0)SIM.addCompany();const co=SIM.companies[(Math.random()*SIM.companies.length)|0];SIM.addSite(co.id);updateUI()};document.getElementById('postJob').onclick=()=>{if(SIM.companies.length==0)SIM.addCompany();const co=SIM.companies[(Math.random()*SIM.companies.length)|0];co.postJob(1,5);updateUI()};document.getElementById('speed').oninput=(e)=>{speed=parseInt(e.target.value,10)};document.getElementById('save').onclick=()=>{localStorage.setItem('sim_v1',JSON.stringify(SIM));alert('Saved to localStorage')};document.getElementById('load').onclick=()=>{const d=localStorage.getItem('sim_v1');if(!d){alert('No save');return}const obj=JSON.parse(d);alert('Loaded (note: partial restore)');}

// initial render
updateUI();render();setInterval(()=>{render()},1000);

// allow canvas click -> add citizen
canvas.onclick=(e)=>{const r=canvas.getBoundingClientRect();const x=(e.clientX-r.left)/TILE,y=(e.clientY-r.top)/TILE;SIM.addCitizen(1,x,y);updateUI()}
