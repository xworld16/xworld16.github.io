/* Reference presentation restored from the final local v19/v20 showcase.
   Read the shared video clock only: no hover, click, seek, pause or frame blending. */
(() => {
  const video=document.getElementById('video'),stage=document.querySelector('.stage');
  const strip=document.createElement('div');strip.className='reference-strip';
  const plane=document.createElement('div');plane.className='reference-plane';strip.append(plane);
  stage.insertBefore(strip,stage.firstChild);
  let demo,cards=[],deck,ctx,buffer,bctx,hero,hctx,label,cursor,epoch=0,last=0,previous=0,entrance=0,pump=()=>{};
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
  function resize(){plane.style.transform=`scale(${strip.clientWidth/1920})`;}
  new ResizeObserver(resize).observe(strip);
  function texture(image){
    const c=document.createElement('canvas');c.width=462;c.height=231;
    const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
    x.beginPath();x.roundRect(0,0,462,231,18);x.clip();x.fillStyle='#fff';x.fillRect(0,0,462,231);
    const s=Math.min(462/image.naturalWidth,231/image.naturalHeight),w=image.naturalWidth*s,h=image.naturalHeight*s;
    x.drawImage(image,(462-w)/2,(231-h)/2,w,h);
    const mask=x.createLinearGradient(0,0,462,0);mask.addColorStop(0,'transparent');mask.addColorStop(.012,'#000');mask.addColorStop(.988,'#000');mask.addColorStop(1,'transparent');
    x.globalCompositeOperation='destination-in';x.fillStyle=mask;x.fillRect(0,0,462,231);return c;
  }
  function build(){
    const next=(window.DEMOS||[]).find(d=>d.kind==='dashcam'&&new URL(d.video,location.href).href===video.src);
    if(!next?.refs?.length||next===demo)return;
    demo=next;const token=++epoch;cards=[];entrance=0;previous=0;plane.replaceChildren();
    strip.setAttribute('aria-label',ft('dashcam'));
    deck=document.createElement('canvas');deck.className='reference-deck';deck.width=1920;deck.height=318;ctx=deck.getContext('2d');plane.append(deck);
    buffer=document.createElement('canvas');buffer.width=1920;buffer.height=318;bctx=buffer.getContext('2d');
    const axis=document.createElement('div');axis.className='reference-axis';plane.append(axis);
    for(let i=0;i<5;i++){
      const tick=document.createElement('span');tick.className='reference-tick'+(i===0?' first':i===4?' last':'');
      tick.style.left=`${i*25}%`;tick.textContent=(i===0?ft('frame')+' ':'')+(Math.round(i*(demo.frames-1)/4)+1);axis.append(tick);
    }
    cursor=document.createElement('i');cursor.className='reference-cursor';axis.append(cursor);
    label=document.createElement('span');label.className='reference-label';label.dataset.origin='input';plane.append(label);
    hero=document.createElement('canvas');hero.className='reference-hero';hero.width=768;hero.height=384;hctx=hero.getContext('2d',{alpha:false});plane.append(hero);
    cards=demo.refs.map(ref=>({img:null,ref,w:0,texture:null,state:'idle'}));
    let inFlight=0;
    pump=()=>{
      if(token!==epoch)return;
      const frame=clamp(Math.floor(video.currentTime*demo.fps),0,cards.length-1);
      // Reprioritize around the live clock; never wait for the entire deck.
      const priority=c=>{
        const forward=(c.ref.frame-frame+cards.length)%cards.length;
        const backward=(frame-c.ref.frame+cards.length)%cards.length;
        return Math.min(forward,backward+3);
      };
      const waiting=cards.filter(c=>c.state==='idle').sort((a,b)=>priority(a)-priority(b));
      while(inFlight<4&&waiting.length){
        const card=waiting.shift(),img=new Image();card.img=img;card.state='loading';inFlight++;
        img.decoding='async';img.fetchPriority=priority(card)<3?'high':'low';
        let settled=false;
        const finish=ok=>{
          if(settled)return;settled=true;clearTimeout(timeout);inFlight--;
          if(token!==epoch)return;
          if(ok){card.texture=texture(img);card.state='ready';}else card.state='failed';
          pump();
        };
        const timeout=setTimeout(()=>{img.onload=null;img.onerror=null;img.src='';finish(false);},12000);
        img.onload=()=>finish(true);img.onerror=()=>finish(false);img.src=card.ref.src;
      }
    };
    pump();resize();
  }
  function animate(now){
    window.FROSTED_API.drawCameras();
    const dt=Math.min(50,last?now-last:16);last=now;
    pump();
    const loaded=cards.filter(c=>c.texture);
    if(demo&&video.readyState>=2&&loaded.length){
      const t=clamp(video.currentTime*demo.fps,0,demo.frames-1);
      if(previous>demo.frames-3&&t<1){entrance=0;cards.forEach(c=>c.w=0);}previous=t;
      entrance=Math.min(1,entrance+dt/360);const enter=ease(entrance);
      const bw=256*1.2,bh=128*1.2,mw=384*1.2,mh=192*1.2;
      bctx.clearRect(0,0,1920,318);bctx.imageSmoothingEnabled=true;bctx.imageSmoothingQuality='high';
      for(const c of cards){
        const wanted=.94*Math.exp(-.5*((c.ref.frame-t)/5.5)**2)*enter;
        c.w+=(wanted-c.w)*(1-Math.exp(-dt/135));
        const w=bw+(mw-bw)*c.w,h=bh+(mh-bh)*c.w,x=32+(1856-w)*c.ref.frame/(demo.frames-1),y=184-h/2;
        const fallback=c.texture||loaded.reduce((a,b)=>Math.abs(a.ref.frame-c.ref.frame)<=Math.abs(b.ref.frame-c.ref.frame)?a:b).texture;
        bctx.globalAlpha=.12+.16*c.w;bctx.drawImage(fallback,x,y,w,h);
      }
      bctx.globalAlpha=1;ctx.globalCompositeOperation='copy';ctx.drawImage(buffer,0,0);ctx.globalCompositeOperation='source-over';
      const frame=Math.floor(t+1e-7);
      const current=cards[frame].texture?cards[frame]:loaded.reduce((a,b)=>Math.abs(a.ref.frame-frame)<=Math.abs(b.ref.frame-frame)?a:b);
      hctx.drawImage(current.img,0,0,768,384);
      const w=bw+(mw-bw)*enter,h=bh+(mh-bh)*enter,x=32+(1856-w)*t/(demo.frames-1),y=184-h/2;
      hero.style.opacity=enter;hero.style.width=`${w}px`;hero.style.height=`${h}px`;hero.style.filter=`blur(${(1-enter)*1.2}px)`;hero.style.transform=`translate3d(${x}px,${y}px,0)`;
      label.textContent=`${ft('input')} / ${ft('frame')} ${current.ref.frame+1}`;label.style.opacity=enter;label.style.left=`${x+18}px`;label.style.top=`${y+14}px`;
      cursor.style.left=`${100*t/(demo.frames-1)}%`;
    }
    requestAnimationFrame(animate);
  }
  video.addEventListener('loadstart',build);video.addEventListener('loadedmetadata',build);build();resize();requestAnimationFrame(animate);
})();
