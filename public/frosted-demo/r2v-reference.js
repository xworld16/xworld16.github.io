/* Draw original reference images without letterboxing; use the shared video clock. */
(()=>{
 const video=document.getElementById('video'),viewport=document.querySelector('.camera-viewport');
 const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=340;canvas.className='r2v-reference';viewport.append(canvas);
 const ctx=canvas.getContext('2d');let current='',images=[],demo=null;
 function load(){
  const next=window.DEMOS.find(d=>d.kind==='r2v'&&new URL(d.video,location.href).href===video.src);
  if(!next||next.id===current)return;
  demo=next;current=next.id;
  images=next.reference_positions.map((frame,i)=>{const image=new Image();image.decoding='async';image.src=`frosted/refs/r2v_${next.id.replace(/^sample_/,'')}/${String(i).padStart(3,'0')}.jpg`;return{image,frame};});
 }
 function draw(){
  load();ctx.fillStyle=document.documentElement.dataset.theme==='dark'?'#111b23':'#fff';ctx.fillRect(0,0,1920,340);
  if(demo){
   const t=video.currentTime*demo.fps,first=demo.reference_positions[0],last=demo.reference_positions.at(-1),progress=Math.max(0,Math.min(1,(t-first)/(last-first)));
   ctx.strokeStyle='#d2dedf';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(32,55);ctx.lineTo(1888,55);ctx.stroke();
   ctx.strokeStyle='#6bb0ac';ctx.beginPath();ctx.moveTo(32,55);ctx.lineTo(32+1856*progress,55);ctx.stroke();
   ctx.fillStyle='#287f80';ctx.beginPath();ctx.arc(32+1856*progress,55,4,0,Math.PI*2);ctx.fill();
   ctx.font='16px Arial';ctx.fillStyle='#7a8b91';
   images.forEach(({frame},i)=>{const x=32+1856*(frame-first)/(last-first);ctx.textAlign=i===0?'left':i===images.length-1?'right':'center';ctx.fillText((i===0?ft('frame')+' ':'')+(frame+1),x,35);});
   const cards=images.map(c=>({...c,weight:Math.exp(-.5*((c.frame-t)/5)**2)})).sort((a,b)=>a.weight-b.weight);
   cards.forEach(({image,frame,weight})=>{
    if(!image.complete||!image.naturalWidth)return;
    // Fit within the available strip while retaining the image's actual aspect ratio.
    const ratio=image.naturalWidth/image.naturalHeight,h=112+70*weight,w=Math.min(370,h*ratio),height=w/ratio;
    const x=32+(1856-w)*(frame-first)/(last-first),y=193-height/2;
    ctx.save();ctx.shadowColor='#183e4330';ctx.shadowBlur=14;ctx.shadowOffsetY=5;ctx.fillStyle='#fff';ctx.beginPath();ctx.roundRect(x,y,w,height,12);ctx.fill();ctx.restore();
    ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,height,12);ctx.clip();ctx.drawImage(image,x,y,w,height);ctx.restore();
    ctx.font='bold 12px Arial';ctx.textAlign='left';const text=ft('input'),bw=ctx.measureText(text).width+18;
    ctx.fillStyle='#A8DCD5';ctx.beginPath();ctx.roundRect(x+7,y+7,bw,23,11);ctx.fill();ctx.fillStyle='#164E48';ctx.fillText(text,x+16,y+23);
   });
  }
  requestAnimationFrame(draw);
 }
 video.addEventListener('loadstart',load);requestAnimationFrame(draw);
})();
