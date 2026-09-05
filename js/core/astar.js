// js/core/astar.js
// Lightweight A* implementation for tile grids
(function(){
  function heuristic(ax,ay,bx,by){return Math.abs(ax-bx)+Math.abs(ay-by)}
  function inBounds(x,y,map){return x>=0&&y>=0&&x<map.width&&y<map.height}
  function tileCost(x,y,map){const t=map.tiles[y*map.width+x]; if(t===1) return 1; if(t===0) return 2; if(t===2) return 3; return 5}

  window.AStar = {
    findPath: function(start,goal,map){
      const [sx,sy]=start.map(Math.floor), [gx,gy]=goal.map(Math.floor);
      if(!inBounds(sx,sy,map) || !inBounds(gx,gy,map)) return null;
      const key=(x,y)=>`${x},${y}`;
      const open=new Map();
      const closed=new Set();
      const node=(x,y,g,h,parent)=>({x,y,g,h,f:g+h,parent});
      const startNode=node(sx,sy,0,heuristic(sx,sy,gx,gy),null);
      open.set(key(sx,sy),startNode);
      const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
      while(open.size>0){
        // get lowest f
        let curKey, curNode, minF=Infinity;
        for(const [k,n] of open){ if(n.f<minF){minF=n.f; curKey=k; curNode=n} }
        open.delete(curKey);
        closed.add(curKey);
        if(curNode.x===gx && curNode.y===gy){ // reconstruct
          const path=[]; let n=curNode; while(n){path.push([n.x,n.y]); n=n.parent} path.reverse(); return path;
        }
        for(const d of dirs){const nx=curNode.x+d[0], ny=curNode.y+d[1]; if(!inBounds(nx,ny,map)) continue; const nk=key(nx,ny); if(closed.has(nk)) continue; // all tiles passable but cost varies
          const ng=curNode.g + tileCost(nx,ny,map);
          const existing=open.get(nk);
          if(!existing || ng<existing.g){ const h=heuristic(nx,ny,gx,gy); open.set(nk,node(nx,ny,ng,h,curNode)); }
        }
      }
      return null;
    }
  };
})();
