(() => {
  'use strict';
  const kind=document.body.dataset.kind,video=document.getElementById('video');
  const stage=document.querySelector('.stage'),error=document.getElementById('error');
  const demos=(window.DEMOS||[]).filter(d=>d.kind===kind);
  let active=window.parent===window&&!document.hidden,index=0,errorKey='',pendingDemo=null;
  const viewport=document.createElement('div');viewport.className='camera-viewport';
  stage.insertBefore(viewport,video);viewport.append(video);
  const labels=document.createElement('div');labels.className='camera-label-plane';
  for(const [id,x,y] of [['cam0',32,12],['cam2',408,12],['cam3',32,200],['cam4',1536,200],['cam5',32,388],['cam6',1536,388],['cam7',1536,12]]){
    const badge=document.createElement('span');badge.className='camera-name';badge.dataset.camera=id;
    badge.style.left=`${x+11}px`;badge.style.top=`${y+11}px`;labels.append(badge);
  }
  const origin=document.createElement('span');origin.className='camera-origin';origin.dataset.origin='generated';labels.append(origin);
  const links=document.createElement('img');links.className='camera-links';links.src='camera-links-v14.svg';
  viewport.append(links,labels);
  Object.assign(video,{muted:true,defaultMuted:true,loop:true,playsInline:true});
  function setError(key){errorKey=key;error.textContent=key?ft(key):'';error.hidden=!key;}
  function updatePlayback(){
    if(!active||document.hidden){video.pause();return;}
    if(pendingDemo){const demo=pendingDemo;pendingDemo=null;video.preload='auto';video.src=demo.video;video.load();}
    video.play().catch(e=>{if(e.name!=='AbortError'&&active&&!document.hidden)setError('videoError');});
  }
  function refreshText(){
    document.getElementById('prev').setAttribute('aria-label',ft('previous'));
    document.getElementById('next').setAttribute('aria-label',ft('next'));
    document.querySelector('.sample-nav').setAttribute('aria-label',ft('navigation'));
    stage.setAttribute('aria-label',ft('stage'));links.alt=ft('links');
    labels.querySelectorAll('[data-camera]').forEach(b=>b.textContent=ft(b.dataset.camera));
    origin.textContent=ft('generated');
    video.setAttribute('aria-label',ft('video',{kind:ft(kind),sample:index+1}));
    if(errorKey)setError(errorKey);
  }
  function selectSample(next){
    if(!demos.length){setError('noVideos');return;}
    index=(next+demos.length)%demos.length;const demo=demos[index];
    setError('');video.pause();video.poster=demo.poster;pendingDemo=demo;
    document.getElementById('counter').textContent=`${String(index+1).padStart(2,'0')} / ${String(demos.length).padStart(2,'0')}`;
    refreshText();updatePlayback();
  }
  function resize(){labels.style.transform=`scale(${viewport.clientWidth/1920})`;}
  new ResizeObserver(resize).observe(viewport);
  document.getElementById('prev').addEventListener('click',()=>selectSample(index-1));
  document.getElementById('next').addEventListener('click',()=>selectSample(index+1));
  document.addEventListener('keydown',e=>{
    if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.target.closest('button,input,select'))return;
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();selectSample(index+(e.key==='ArrowRight'?1:-1));}
  });
  video.addEventListener('loadeddata',()=>{setError('');updatePlayback();});
  video.addEventListener('error',()=>setError('videoError'));
  window.FROSTED_API={setActive(next){active=next;updatePlayback();},refreshText};
  selectSample(0);resize();
})();
