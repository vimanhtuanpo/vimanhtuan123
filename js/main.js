// js/main.js - extend map generation: add trees and houses
// Ensure MAP exists
if(typeof MAP==='undefined'){
  window.MAP={width:40,height:28,tiles:[]};
  // initialize empty
  for(let y=0;y<MAP.height;y++) for(let x=0;x<MAP.width;x++) MAP.tiles.push(0);
}

// helper functions
function setTile(x,y,t){ if(x<0||y<0||x>=MAP.width||y>=MAP.height) return; MAP.tiles[y*MAP.width+x]=t; }
function getTile(x,y){ if(x<0||y<0||x>=MAP.width||y>=MAP.height) return 0; return MAP.tiles[y*MAP.width+x]; }

// build roads: main horizontal and vertical roads plus some branches
(function buildRoads(){
  const midY = Math.floor(MAP.height/2);
  const leftRoadX = Math.floor(MAP.width*0.2);
  const rightRoadX = Math.floor(MAP.width*0.6);
  // horizontal artery
  for(let x=0;x<MAP.width;x++) setTile(x, midY, 1);
  // vertical arteries
  for(let y=0;y<MAP.height;y++) setTile(leftRoadX, y, 1);
  for(let y=0;y<MAP.height;y++) setTile(rightRoadX, y, 1);
  // add branches
  for(let i=2;i<MAP.width-2;i+=6){ setTile(i, midY-2, 1); }
  for(let j=3;j<MAP.height-3;j+=7){ setTile(leftRoadX+2, j, 1); }
})();

// place industrial zones
(function buildIndustrial(){
  for(let y=2;y<8;y++) for(let x=MAP.width-10;x<MAP.width-4;x++) setTile(x,y,2);
})();

// place residential areas and trees
(function buildResidentialAndTrees(){
  // residential zones top-left and bottom-left
  const zones = [ {x:2,y:2,w:8,h:6}, {x:2,y:MAP.height-9,w:8,h:7}, {x:MAP.width-12,y:Math.floor(MAP.height/2)+3,w:9,h:6} ];
  for(const z of zones){
    for(let y=z.y;y<z.y+z.h;y++){
      for(let x=z.x;x<z.x+z.w;x++){
        // place houses with some spacing
        if((x+ y) % 3 === 0 && Math.random()>0.2) setTile(x,y,5); // house tile
        else if(Math.random() < 0.12) setTile(x,y,4); // tree
      }
    }
  }
  // scatter trees across map (forests and roadside)
  for(let i=0;i<200;i++){
    const x = Math.floor(Math.random()*MAP.width);
    const y = Math.floor(Math.random()*MAP.height);
    if(getTile(x,y)===0 && Math.random()<0.15) setTile(x,y,4);
  }
})();

// expose helpers globally
window.setTile = setTile; window.getTile = getTile;
