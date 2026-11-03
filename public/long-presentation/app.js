'use strict';
const CONFIG=window.SF_CSF_DATA.config, MEDIA=window.SF_CSF_DATA.media;
const ORDER=['V058','V121','V126'], METHODS=['sf','csf'];
const el=id=>document.getElementById(id);
const comparison=el('comparison');
const videos=Object.fromEntries(METHODS.map(m=>[m,el(m+'-source')]));
const canvases=Object.fromEntries(METHODS.map(m=>[m,{main:el(m+'-main'),reference:el(m+'-reference'),current:el(m+'-current')}]));
const contexts=Object.fromEntries(METHODS.map(m=>[m,Object.fromEntries(Object.entries(canvases[m]).map(([k,v])=>[k,v.getContext('2d')]))]));
const state={code:'V058',t:0,playing:false,loading:true,buffering:false,phase:-1,frame:0,height:85,zoom:1,baseTime:0,baseWall:performance.now(),images:null,pair:null,frozen:{},lastDraw:0,lastPairWall:0};
let operation=0, seekToken=0, syncPromise=null;
const mediaCache=new Map();
const imageCache={},settings={},buffers={sf:new Map(),csf:new Map()};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let embedActive=window.parent===window&&!document.hidden,embedResume=true;
const cfg=()=>CONFIG[state.code];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=u=>{u=clamp(u,0,1);return u*u*u*(u*(u*6-15)+10)};
function setStatus(key){state.statusKey=key;el('status').textContent=key?sfLabel(key):''}
function formatTime(t){return Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0')}
function updateUI(){
 const counter=el('counter');
 const label=[ORDER.indexOf(state.code)+1, ORDER.length].map(n=>String(n).padStart(2,'0')).join(' / ');
 if(counter.textContent!==label)counter.textContent=label;
}
function baseFocus(n,c=cfg()){
 if(!c.track)return c.focus;
 const t=n/12,points=c.track;
 if(t<=points[0][0])return points[0].slice(1);
 for(let i=1;i<points.length;i++)if(t<=points[i][0]){const a=points[i-1],b=points[i],u=(t-a[0])/(b[0]-a[0]);return [1,2,3].map(j=>a[j]+(b[j]-a[j])*u)}
 return points[points.length-1].slice(1);
}
function cropRect(n,aspect){
 const [cx,cy,base]=baseFocus(n);let w=base/state.zoom,h=w/aspect;
 const scale=Math.min(1,1024/w,512/h);w*=scale;h*=scale;
 const x=clamp(cx-w/2,0,1024-w),y=clamp(cy-h/2,0,512-h);return [x,y,w,h];
}
function geometry(){
 const panel=comparison.querySelector('.method');const width=panel.getBoundingClientRect().width;
 const gap=parseFloat(getComputedStyle(comparison.querySelector('.crops')).columnGap)||0;
 const detailHeight=width/2*(state.height/100),detailWidth=(width-gap)/2;
 return {aspect:detailWidth/Math.max(1,detailHeight),detailHeight};
}
function resize(){
 const g=geometry();const h=Math.round(960/g.aspect);
 for(const m of METHODS)for(const stage of ['reference','current']){
  const c=canvases[m][stage];if(c.width!==960||c.height!==h){c.width=960;c.height=h}c.style.height=g.detailHeight+'px';
 }
 draw();
}
function sourceAt(t){
 const c=cfg(),a=c.timing;
 if(t<a.reference)return {id:0,speed:1,time:t};
 if(t<a.advance)return {id:1,speed:0,time:(c.referenceFrame-c.firstFrame)/12,still:'reference'};
 if(t<a.current)return {id:2,speed:2,time:(c.referenceFrame-c.firstFrame)/12+(t-a.advance)*2};
 if(t<a.resume)return {id:3,speed:0,time:(c.currentFrame-c.firstFrame)/12,still:'current'};
 return {id:4,speed:1,time:(c.currentFrame-c.firstFrame)/12+t-a.resume};
}
function liveModel(){
 const p=sourceAt(state.t),c=cfg();
 if(p.still)return {sources:state.frozen[p.still]||state.pair||Object.fromEntries(METHODS.map(m=>[m,state.images[m][p.still]])),frame:p.still==='reference'?c.referenceFrame:c.currentFrame};
 return {sources:state.pair||Object.fromEntries(METHODS.map(m=>[m,state.images[m].initial])),frame:state.frame||c.firstFrame};
}
function drawCrop(ctx,source,r,width,height){ctx.clearRect(0,0,width,height);ctx.drawImage(source,...r,0,0,width,height)}
function draw(){
 if(state.loading||!state.images)return;
 const c=cfg(),a=c.timing,g=geometry(),model=liveModel();
 for(const m of METHODS){
  const main=canvases[m].main,ctx=contexts[m].main;
  main.dataset.sourceFrame=String(model.frame);ctx.clearRect(0,0,main.width,main.height);ctx.drawImage(model.sources[m],0,0,1024,512,0,0,main.width,main.height);
  for(const stage of ['reference','current']){
   const frozen=state.t>=a[stage]+1.1,source=frozen?(state.frozen[stage]?.[m]||state.images[m][stage]):model.sources[m];
   const n=frozen?(stage==='reference'?c.referenceFrame:c.currentFrame):model.frame;
   const canvas=canvases[m][stage],region=cropRect(n,g.aspect);canvas.dataset.sourceFrame=String(n);canvas.dataset.mode=frozen?'frozen':'empty';canvas.dataset.crop=JSON.stringify(region);if(frozen)drawCrop(contexts[m][stage],source,region,canvas.width,canvas.height);else contexts[m][stage].clearRect(0,0,canvas.width,canvas.height);
  }
  // Source guides and the crop flight remain independent of the page layout.
  for(const [stage,end] of [['reference','advance'],['current','resume']]){
   if(state.t<a[stage]||state.t>=a[end])continue;
   const u=state.t-a[stage],n=stage==='reference'?c.referenceFrame:c.currentFrame,r=cropRect(n,g.aspect),alpha=Math.min(1,u/.12,(a[end]-state.t)/.2);
   const [x,y,w,h]=r.map(v=>v*main.width/1024),length=38;
   ctx.save();ctx.beginPath();ctx.rect(0,0,main.width,main.height);ctx.clip();ctx.globalAlpha=alpha;ctx.lineJoin='miter';
   for(const [xx,yy,sx,sy] of [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]]){
    ctx.beginPath();ctx.moveTo(xx+sx*length,yy);ctx.lineTo(xx,yy);ctx.lineTo(xx,yy+sy*length);ctx.lineWidth=7;ctx.strokeStyle='rgba(0,0,0,.75)';ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle='#fff';ctx.stroke();
   }
   ctx.restore();
  }
 }
 drawFlights();
}
function drawFlights(){
 const layer=el('flight-layer'),box=comparison.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1),w=Math.round(box.width*dpr),h=Math.round(box.height*dpr);
 if(layer.width!==w||layer.height!==h){layer.width=w;layer.height=h}
 const ctx=layer.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,box.width,box.height);let active=[];
 const c=cfg(),g=geometry();
 for(const stage of ['reference','current']){
  const u=state.t-c.timing[stage];if(u<.25||u>=1.3)continue;active.push(stage);
  const n=stage==='reference'?c.referenceFrame:c.currentFrame,region=cropRect(n,g.aspect),hz=ease((u-.25)/.4),vt=ease((u-.65)/.45),alpha=1-ease((u-1.1)/.2);
  for(const m of METHODS){
   const main=canvases[m].main.getBoundingClientRect(),target=canvases[m][stage].getBoundingClientRect();
   const start=[main.left-box.left+region[0]*main.width/1024,main.top-box.top+region[1]*main.height/512,region[2]*main.width/1024,region[3]*main.height/512];
   const end=[target.left-box.left,target.top-box.top,target.width,target.height];
   const bounds=[start[0]+(end[0]-start[0])*hz,start[1]+(end[1]-start[1])*vt,start[2]+(end[2]-start[2])*hz,start[3]+(end[3]-start[3])*hz];
   ctx.globalAlpha=alpha;ctx.drawImage(state.frozen[stage]?.[m]||state.images[m][stage],...region,...bounds);ctx.globalAlpha=1;
  }
 }
 layer.dataset.activeStages=active.join(',');
}
function snapshot(video){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;canvas.getContext('2d').drawImage(video,0,0,1024,512);return canvas}
function capturePair(n){state.pair=Object.fromEntries(METHODS.map(m=>[m,snapshot(videos[m])]));state.frame=n;state.lastPairWall=performance.now();buffers.sf.clear();buffers.csf.clear()}
function installFrameCallbacks(m){
 const video=videos[m];
 if(!video.requestVideoFrameCallback)return;
 const callback=(now,metadata)=>{
  if(!state.loading&&!state.buffering&&state.playing&&sourceAt(state.t).speed>0){
   const index=cfg().firstFrame+Math.round(metadata.mediaTime*12);buffers[m].set(index,snapshot(video));
   while(buffers[m].size>5)buffers[m].delete(buffers[m].keys().next().value);
   let common=-1;for(const n of buffers.sf.keys())if(buffers.csf.has(n)&&n>=state.frame)common=Math.max(common,n);
   if(common>=0){state.pair={sf:buffers.sf.get(common),csf:buffers.csf.get(common)};if(common>state.frame)state.lastPairWall=performance.now();state.frame=common;for(const mm of METHODS)for(const n of buffers[mm].keys())if(n<common)buffers[mm].delete(n)}
  }
  video.requestVideoFrameCallback(callback);
 };
 video.requestVideoFrameCallback(callback);
}
METHODS.forEach(installFrameCallbacks);
function mediaURL(code,m){return MEDIA[code][m].video;}
// A complete pair is cached before either decoder starts. Playback and all seeks
// then use local blobs, so network stalls cannot alter the comparison sequence.
// The cache is bounded by the three authored cases (six original MP4 files).
function preparedPair(code,priority='high'){
 if(mediaCache.has(code))return mediaCache.get(code).promise;
 const entry={controller:new AbortController(),urls:[],complete:false};mediaCache.set(code,entry);
 entry.promise=(async()=>{
  const timeout=setTimeout(()=>entry.controller.abort(),120000);
  try{
   const pair=await Promise.all(METHODS.map(async m=>{
    const response=await fetch(mediaURL(code,m),{signal:entry.controller.signal,priority});
    if(!response.ok)throw Error('Unable to load comparison video.');
    const blob=await response.blob();
    if(!blob.size||entry.controller.signal.aborted||blob.type.startsWith('text/'))throw Error('Incomplete comparison video.');
    const url=URL.createObjectURL(blob);entry.urls.push(url);return [m,url];
   }));
   entry.complete=true;return Object.fromEntries(pair);
  }catch(error){
   entry.controller.abort();entry.urls.forEach(url=>URL.revokeObjectURL(url));
   if(mediaCache.get(code)===entry)mediaCache.delete(code);throw error;
  }finally{clearTimeout(timeout)}
 })();return entry.promise;
}
window.addEventListener('pagehide',event=>{
 if(event.persisted)return;
 for(const entry of mediaCache.values()){entry.controller.abort();entry.urls.forEach(url=>URL.revokeObjectURL(url))}mediaCache.clear();
});
function playable(video){
 if(video.readyState>=3)return Promise.resolve();
 return new Promise((resolve,reject)=>{
  const cleanup=()=>{clearTimeout(timeout);video.removeEventListener('canplay',ready);video.removeEventListener('error',bad)};
  const ready=()=>{if(video.readyState>=3){cleanup();resolve()}},bad=()=>{cleanup();reject(Error('Unable to prepare comparison frame.'))};
  const timeout=setTimeout(bad,12000);video.addEventListener('canplay',ready);video.addEventListener('error',bad);ready();
 });
}
function recoverPair(){
 if(state.loading||state.buffering||!state.playing||!sourceAt(state.t).speed)return;
 state.t=timelineNow(performance.now());METHODS.forEach(m=>videos[m].pause());
 synchronize(true);
}
METHODS.forEach(m=>videos[m].addEventListener('waiting',recoverPair));

function image(url){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Unable to decode an embedded still.'));im.src=url})}
function stills(code){
 if(!imageCache[code])imageCache[code]=Promise.all(METHODS.map(async m=>[m,Object.fromEntries(await Promise.all(Object.entries(MEDIA[code][m].stills).map(async([stage,url])=>[stage,await image(url)])))] )).then(Object.fromEntries).catch(error=>{delete imageCache[code];throw error});
 return imageCache[code];
}
function loadVideo(video,url){return new Promise((resolve,reject)=>{
 const ready=()=>{cleanup();resolve()},bad=()=>{cleanup();reject(new Error('Unable to decode the embedded video.'))},cleanup=()=>{video.removeEventListener('loadeddata',ready);video.removeEventListener('error',bad)};
 video.pause();video.addEventListener('loadeddata',ready,{once:true});video.addEventListener('error',bad,{once:true});video.src=url;video.load();
})}
function seekVideo(video,time){
 time=clamp(time,0,Math.max(0,video.duration-1/12+.0001));
 if(!video.seeking&&Math.abs(video.currentTime-time)<.002)return Promise.resolve();
 return new Promise((resolve,reject)=>{
  const done=()=>{cleanup();resolve()},bad=()=>{cleanup();reject(new Error('Video seek failed.'))};
  const timeout=setTimeout(()=>{cleanup();reject(new Error('Video seek timed out.'))},6000);
  const cleanup=()=>{clearTimeout(timeout);video.removeEventListener('seeked',done);video.removeEventListener('error',bad)};
  video.addEventListener('seeked',done,{once:true});video.addEventListener('error',bad,{once:true});video.currentTime=time;
 });
}
async function synchronize(force=false){
 if(state.loading)return;
 const p=sourceAt(state.t),token=++seekToken;state.phase=p.id;state.buffering=true;
 METHODS.forEach(m=>videos[m].pause());
 try{
  await Promise.all(METHODS.map(m=>seekVideo(videos[m],p.time)));
  await Promise.all(METHODS.map(m=>playable(videos[m])));
  if(token!==seekToken||state.loading)return;
  const n=clamp(cfg().firstFrame+Math.floor((p.time+.0001)*12),cfg().firstFrame,cfg().lastFrame);capturePair(n);
  // Freeze the decoded video itself so sharpness/color do not switch to a separate PNG.
  if(p.still)state.frozen[p.still]=state.pair;
  for(const m of METHODS)videos[m].playbackRate=p.speed||1;
  state.baseTime=state.t;
  if(state.playing&&p.speed>0)await Promise.all(METHODS.map(m=>videos[m].play()));
  if(!state.playing||!embedActive||document.hidden)METHODS.forEach(m=>videos[m].pause());
  if(token!==seekToken)return;
  state.buffering=false;state.baseWall=performance.now();state.lastPairWall=state.baseWall;
  draw();updateUI();
 }catch(error){if(token===seekToken){METHODS.forEach(m=>videos[m].pause());state.buffering=false;state.playing=false;setStatus('playbackError');updateUI()}}
}
// During motion, the timeline cannot outrun the latest frame decoded by both methods.
// Hold/flight animations still use wall time so they remain smooth.
function timelineNow(now){
 const wall=clamp(state.baseTime+(now-state.baseWall)/1000,0,cfg().duration),p=sourceAt(state.t),c=cfg();
 if(!p.speed||(p.id===4&&state.frame>=c.lastFrame))return wall;
 const decoded=METHODS.every(m=>typeof videos[m].requestVideoFrameCallback==='function')?(state.frame-c.firstFrame)/12:Math.min(...METHODS.map(m=>videos[m].currentTime));
 const media=p.id===0?decoded:p.id===2?c.timing.advance+(decoded-(c.referenceFrame-c.firstFrame)/12)/2:c.timing.resume+decoded-(c.currentFrame-c.firstFrame)/12;
 return clamp(Math.min(wall,Math.max(state.t,media)),0,c.duration);
}
function pause(){
 embedResume=false;
 if(state.playing&&!state.buffering)state.t=timelineNow(performance.now());
 state.playing=false;METHODS.forEach(m=>videos[m].pause());updateUI();draw();
}
async function play(){if(state.loading||!embedActive||document.hidden)return;embedResume=false;if(state.t>=cfg().duration-.01)state.t=0;state.playing=true;await synchronize(true);updateUI();}
async function seek(t){const keepPlaying=state.playing;pause();state.t=clamp(t,0,cfg().duration);state.playing=keepPlaying;await synchronize(true);updateUI();draw()}
async function choose(code,direction=1){
 if(state.loading&&state.images)return;
 const token=++operation,wasPlaying=true;pause();embedResume=wasPlaying;state.loading=true;state.buffering=false;++seekToken;
 settings[state.code]={height:state.height,zoom:state.zoom};setStatus('loading');comparison.setAttribute('aria-busy','true');document.querySelectorAll('.case-nav button').forEach(b=>b.disabled=true);updateUI();
 try{
  for (const method of METHODS) videos[method].dataset.mediaUrl = new URL(mediaURL(code,method), location.href).href;
  comparison.dataset.mediaReady='false';
  const posters=stills(code).then(images=>{if(token===operation&&!state.images)for(const m of METHODS){const canvas=canvases[m].main;contexts[m].main.drawImage(images[m].initial,0,0,canvas.width,canvas.height);canvas.dataset.sourceFrame=String(CONFIG[code].firstFrame)}return images});
  const [images,urls]=await Promise.all([posters,preparedPair(code)]);
  if(token!==operation)return;
  await Promise.all(METHODS.map(async m=>{await loadVideo(videos[m],urls[m]);await playable(videos[m])}));
  if(token!==operation)return;
  if(state.images&&!reduced)await comparison.animate([{transform:'translateX(0)',opacity:1},{transform:`translateX(${-direction*3}%)`,opacity:0}],{duration:130,easing:'ease-in',fill:'forwards'}).finished;
  state.code=code;state.frozen={};state.images=images;state.t=0;state.phase=-1;state.frame=CONFIG[code].firstFrame;state.height=settings[code]?.height||85;state.zoom=settings[code]?.zoom||1;state.loading=false;state.playing=false;
  capturePair(CONFIG[code].firstFrame);updateUI();resize();
  comparison.getAnimations().forEach(a=>a.cancel());
  if(!reduced)comparison.animate([{transform:`translateX(${direction*3}%)`,opacity:0},{transform:'translateX(0)',opacity:1}],{duration:230,easing:'ease-out'});
  setStatus('');comparison.dataset.mediaReady='true';comparison.setAttribute('aria-busy','false');document.querySelectorAll('.case-nav button').forEach(b=>b.disabled=false);
  if(wasPlaying&&embedActive&&!document.hidden)await play();

 }catch(error){state.loading=false;state.playing=false;comparison.setAttribute('aria-busy','false');setStatus('playbackError');document.querySelectorAll('.case-nav button').forEach(b=>b.disabled=false);updateUI()}
}
function cycle(direction){const index=ORDER.indexOf(state.code);choose(ORDER[(index+direction+ORDER.length)%ORDER.length],direction)}
el('previous').onclick=()=>cycle(-1);el('next').onclick=()=>cycle(1);
el('day').onclick=()=>setTheme('day');el('night').onclick=()=>setTheme('night');function setTheme(theme){document.documentElement.dataset.theme=theme;document.body.dataset.theme=theme;for(const name of ['day','night']){el(name).classList.toggle('active',name===theme);el(name).setAttribute('aria-pressed',String(name===theme))}}
new ResizeObserver(()=>resize()).observe(comparison);


function tick(now){
 if(embedActive&&!document.hidden&&state.playing&&!state.loading&&!state.buffering){
  state.t=timelineNow(now);const p=sourceAt(state.t);
  if(state.t>=cfg().duration){state.t=0;state.phase=-1;synchronize(true)}
  else if(p.id!==state.phase){synchronize();}
  else if(p.speed>0&&(Math.abs(videos.sf.currentTime-videos.csf.currentTime)>.09||(now-state.lastPairWall>350&&Math.min(videos.sf.currentTime,videos.csf.currentTime)>(state.frame-cfg().firstFrame)/12+.15))){synchronize();}
  if(!METHODS.every(m=>typeof videos[m].requestVideoFrameCallback==='function')&&p.speed>0&&!state.buffering&&Math.abs(videos.sf.currentTime-videos.csf.currentTime)<1/12){capturePair(clamp(cfg().firstFrame+Math.floor(videos.sf.currentTime*12+.0001),cfg().firstFrame,cfg().lastFrame));}
  if(!state.buffering&&now-state.lastDraw>30){draw();updateUI();state.lastDraw=now}
 }
 requestAnimationFrame(tick);
}
requestAnimationFrame(tick);choose('V058');
