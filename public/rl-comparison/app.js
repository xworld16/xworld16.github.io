(() => {
 'use strict';
 const D=window.RL_MEDIA,roles=['gt','base','rl','cloud'],V=roles.map(role=>document.getElementById('video-'+role));
 const embedded=window.parent!==window,query=new URLSearchParams(location.search),status=document.getElementById('status');
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 // The dev parent supplies a fresh URL revision after a local media replacement.
 const mediaRevision=query.get('mediaRevision');
 const mediaUrl=path=>{if(!mediaRevision)return path;const url=new URL(path,location.href);url.searchParams.set('revision',mediaRevision);return url.href;};
 let lang=query.get('lang')==='zh'?'zh':'en',active=!embedded&&!document.hidden,parentVisible=false,attached=false;
 let playing=false,busy=false,looping=false,generation=0,raf=0,last=0,phase='idle',lastHeight=0;
 const label=key=>window.RL_I18N[lang][key]||key;
 const post=data=>{if(embedded)window.parent.postMessage(data,location.origin==='null'?'*':location.origin);};
 function reportHeight(){const height=Math.ceil(document.querySelector('main').getBoundingClientRect().height);if(height!==lastHeight){lastHeight=height;post({type:'xworld-rl:height',height});}}
 function setPhase(next){phase=next;status.hidden=!['error','blocked'].includes(next);status.textContent=status.hidden?'':label(next);reportHeight();}
 const ready=()=>V.every(v=>v.readyState>=3&&!v.error&&!v.seeking&&Number.isFinite(v.duration));
 // Cache rounded atlas tiles and geometry, as in the DashCam frame deck.
 // The animation loop only composites textures and updates a GPU transform.
 let visualTime=0;
 const decks=[...document.querySelectorAll('.camera')].map(node=>({role:node.dataset.role,strip:node.querySelector('.film-strip'),canvas:node.querySelector('canvas'),card:node.querySelector('.live-card'),badge:node.querySelector('.frame-badge'),cursor:node.querySelector('.frame-axis i'),weights:new Float32Array(81),textures:[],geometry:null,buffer:document.createElement('canvas')}));
 function layoutDecks(){
  const sizes=decks.map(deck=>({w:deck.strip.clientWidth,h:deck.strip.clientHeight}));
  decks.forEach((deck,i)=>{
   const {w,h}=sizes[i];if(!w||!h)return;
   const ratio=Math.min(window.devicePixelRatio||1,1.5),maxW=Math.min(w*.46,Math.max(36,h-24)*2);
   deck.geometry={w,h,ratio,maxW,minW:maxW*.58,pad:w*.04,y:h-maxW/4};
   for(const canvas of [deck.canvas,deck.buffer]){canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);}
   deck.ctx=deck.canvas.getContext('2d');deck.bufferCtx=deck.buffer.getContext('2d');
   deck.card.style.width=maxW+'px';deck.card.style.height=maxW/2+'px';
  });
 }
 function cacheTextures(deck,image){
  deck.textures=Array.from({length:D.frames},(_,i)=>{
   const tile=document.createElement('canvas');tile.width=D.atlas.width;tile.height=D.atlas.height;
   const ctx=tile.getContext('2d');ctx.beginPath();ctx.roundRect(0,0,tile.width,tile.height,6);ctx.clip();
   ctx.drawImage(image,(i%D.atlas.columns)*D.atlas.width,Math.floor(i/D.atlas.columns)*D.atlas.height,D.atlas.width,D.atlas.height,0,0,tile.width,tile.height);
   return tile;
  });
 }
 function draw(time=playing?visualTime:V[0].currentTime,dt=16){
  if(!D)return;
  const frame=clamp(time*D.fps,0,D.frames-1),fraction=frame/(D.frames-1),easing=1-Math.exp(-dt/135);
  document.documentElement.dataset.frame=String(Math.floor(frame+1e-4));
  for(const deck of decks){
   if(!deck.geometry)continue;
   const {w,h,ratio,maxW,minW,pad,y}=deck.geometry,ctx=deck.bufferCtx;
   ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);
   for(let i=0;i<deck.textures.length;i++){
    const wanted=.96*Math.exp(-.5*((i-frame)/5.5)**2);deck.weights[i]+=(wanted-deck.weights[i])*easing;
    const cw=minW+(maxW-minW)*deck.weights[i],ch=cw/2,x=pad+(w-2*pad-cw)*i/(D.frames-1);
    ctx.globalAlpha=.10+.17*deck.weights[i];ctx.drawImage(deck.textures[i],x,y-ch/2,cw,ch);
   }
   ctx.globalAlpha=1;deck.ctx.globalCompositeOperation='copy';deck.ctx.drawImage(deck.buffer,0,0);deck.ctx.globalCompositeOperation='source-over';
   deck.card.style.transform=`translate3d(${pad+(w-2*pad-maxW)*fraction}px,${y-maxW/4}px,0)`;
   const caption=label('frame')+' '+(Math.floor(frame+1e-4)+1);
   if(deck.badge.textContent!==caption)deck.badge.textContent=caption;
   deck.cursor.style.left=fraction*100+'%';
  }
 }
 function schedule(){if(active&&playing&&!raf)raf=requestAnimationFrame(tick);}
 function tick(now){raf=0;const dt=Math.min(50,last?now-last:16);last=now;
  if(!active||document.hidden||!playing)return;
  if(V.some(v=>v.ended||v.currentTime>=D.duration-.015)){replay();return;}
  const time=V[0].currentTime;
  for(const v of V.slice(1))if(!v.seeking&&Math.abs(v.currentTime-time)>.08)v.currentTime=time;
  // Keep deck movement continuous between decoded video frames, while gently
  // correcting to the GT master clock. Footage itself retains its original rate.
  visualTime+=dt/1000;
  const error=time-visualTime;
  visualTime=Math.abs(error)>.2?time:visualTime+error*(1-Math.exp(-dt/120));
  draw(visualTime,dt);schedule();
 }
 function freeze(next){generation++;playing=false;busy=false;cancelAnimationFrame(raf);raf=0;last=0;V.forEach(v=>v.pause());visualTime=V[0].currentTime;setPhase(next);}
 async function start(){
  if(busy||playing||!active||document.hidden||!ready()||phase==='error')return;
  busy=true;playing=true;const token=++generation,time=V[0].currentTime;
  visualTime=time;last=0;V.slice(1).forEach(v=>{if(Math.abs(v.currentTime-time)>.04)v.currentTime=time;});schedule();
  try{await Promise.all(V.map(v=>v.play()));if(token!==generation){if(!playing)V.forEach(v=>v.pause());return;}busy=false;looping=false;setPhase('playing');schedule();}
  catch{if(token===generation)freeze('blocked');}
 }
 function replay(){if(looping||!active||document.hidden)return;freeze('loading');looping=true;V.forEach(v=>{v.currentTime=0;});decks.forEach(d=>d.weights.fill(0));draw(0);start();}
 function attach(){
  if(attached)return;attached=true;setPhase('loading');
  for(let i=0;i<roles.length;i++){const meta=D.media[roles[i]];V[i].preload='auto';V[i].src=mediaUrl(meta.src);V[i].load();}
  for(const deck of decks){const image=new Image();image.decoding='async';image.onload=()=>{cacheTextures(deck,image);draw();};image.src=D.media[deck.role].atlas;}
 }
 function setActive(next){active=next;if(!next){freeze('hidden');return;}attach();if(ready())start();draw();}
 function applyLanguage(next){lang=next==='zh'?'zh':'en';document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.title=label('title');
  document.querySelectorAll('[data-label]').forEach(node=>{const key=label(node.dataset.label);if(node.dataset.labelAttr)node.setAttribute(node.dataset.labelAttr,key);else node.textContent=key;});
  if(!status.hidden)status.textContent=label(phase);draw();reportHeight();
 }
 function applyTheme(next){document.documentElement.dataset.theme=next==='dark'?'dark':'light';draw();}
 if(!D||D.schema_version!==3||D.frames!==81||D.fps!==12||!roles.every(role=>D.media?.[role])){setPhase('error');return;}
 for(let i=0;i<V.length;i++){
  const v=V[i];Object.assign(v,{muted:true,defaultMuted:true,controls:false,loop:false,playsInline:true,playbackRate:1});v.poster=D.media[roles[i]].poster;
  v.addEventListener('contextmenu',e=>e.preventDefault());
  for(const event of ['loadeddata','canplay','seeked'])v.addEventListener(event,()=>{draw();start();});
  for(const event of ['waiting','stalled'])v.addEventListener(event,()=>{if(playing)freeze('loading');});
  v.addEventListener('error',()=>freeze('error'));
  v.addEventListener('ended',()=>{if(v.ended||v.currentTime>=D.duration-.05)replay();});
 }
 document.addEventListener('visibilitychange',()=>setActive(!document.hidden&&(!embedded||parentVisible)));
 window.addEventListener('message',event=>{
  if(!embedded||event.source!==window.parent||(location.origin!=='null'&&event.origin!==location.origin))return;
  const data=event.data||{};
  if(data.type==='xworld:lang')applyLanguage(data.lang);
  if(data.type==='xworld:theme')applyTheme(data.theme);
  if(data.type==='xworld:visibility'){parentVisible=data.visible===true;setActive(parentVisible&&!document.hidden);}
 });
 const resize=()=>{layoutDecks();draw();reportHeight();};new ResizeObserver(resize).observe(document.querySelector('main'));window.addEventListener('resize',resize);
 layoutDecks();applyLanguage(lang);applyTheme(query.get('theme'));post({type:'xworld-rl:ready'});setActive(active);
})();
