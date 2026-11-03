import { L, onLangChange } from '../i18n/index.js';
import '../styles/interaction-cases.css';
const text = (zh, en) => ({ zh, en });
const copy = {
  title: text('闭环 RL 训练后的 VLA 2.0', 'VLA 2.0 After Closed-Loop RL Training'),
  guide: text('这组对照展示了闭环 RL 训练带来的一项变化：当其他车辆打断原本的驾驶动作时，VLA 2.0 能像人类驾驶员一样先退让，再继续完成原来的动作。',
    'This comparison illustrates one way closed-loop RL changes VLA 2.0’s behavior. When another vehicle interrupts a maneuver, the trained model responds more like a human driver: it yields, then resumes the maneuver.'),
  caseLabel: text('案例 · 让行后继续变道', 'Example · Resuming a lane change after yielding'),
  caseGuide: text('自车向右变道时，后方来车突然加塞。下排模型先让对方通过，随后',
    'As the ego vehicle changes lanes to the right, a vehicle cuts in from behind. The model in the lower row lets it pass, then '),
  caseOutcome: text('继续向右，完成原定的变道。',
    'continues into the right lane to complete the original lane change.'),
  baseline: text('未经闭环 RL 训练的 VLA 2.0', 'VLA 2.0 without closed-loop RL training'),
  trained: text('经过闭环 RL 训练的 VLA 2.0', 'VLA 2.0 with closed-loop RL training'),
  paths: text('BEV 视角', 'Bird’s-eye view (BEV)'),
  front: text('前视', 'Front'),
  frontRight: text('右前视', 'Front right'),
  map: text('BEV 视角中，青色虚线表示未经闭环 RL 训练的 VLA 2.0 轨迹，橙色虚线表示经过闭环 RL 训练的 VLA 2.0 轨迹。',
    'In the bird’s-eye view, dashed paths show VLA 2.0 without closed-loop RL training in teal and with training in orange.'),
  videoError: text('视频暂时无法加载', 'Video could not be loaded'),
  mapError: text('轨迹示意暂时无法加载', 'Trajectory illustration could not be loaded'),
};
// Smooth the recorded paths for an illustrative future-path display, not a metric plot.
function smoothPath(points) {
  let out = points.map(p => [...p]);
  for (let pass = 0; pass < 3; pass++) out = out.map((p, i, all) => {
    if (i === 0 || i === all.length - 1) return p;
    const window = all.slice(Math.max(0, i - 5), Math.min(all.length, i + 6));
    return [0, 1].map(k => window.reduce((sum, q) => sum + q[k], 0) / window.length);
  });
  return out;
}
export function createInteractionCases(host) {
  if (!host) return;
  host.id = 'interaction-cases';
  host.className = 'interaction-cases';
  host.innerHTML = `
    <header class="ic-heading">
      <h4 data-ic-copy="title"></h4>
      <p data-ic-copy="guide"></p>
    </header>
    <p class="ic-case"><strong data-ic-copy="caseLabel"></strong> <span data-ic-copy="caseGuide"></span><strong data-ic-copy="caseOutcome"></strong></p>
    <div class="ic-stage">
      ${['baseline', 'trained'].map(model => `<section class="ic-model">
        <h5 class="ic-${model}" data-ic-copy="${model}"></h5>
        <div class="ic-views">
          ${['front', 'frontRight'].map((key, index) => `<figure>
            <canvas width="${index ? 592 : 960}" height="480" aria-hidden="true"></canvas>
            <figcaption data-ic-copy="${key}"></figcaption>
          </figure>`).join('')}
        </div>
      </section>`).join('')}
      <figure class="ic-bev">
        <figcaption data-ic-copy="paths"></figcaption>
        <div class="ic-bev-plot"><canvas role="img"></canvas></div>
        <p data-ic-copy="mapError" role="status" hidden></p>
      </figure>
    </div>
    <video class="ic-source" aria-hidden="true" muted playsinline loop preload="none" disablepictureinpicture></video>
    <p class="ic-error" data-ic-copy="videoError" role="status" hidden></p>`;
  const video = host.querySelector('video');
  const canvas = host.querySelector('.ic-bev canvas');
  const ctx = canvas.getContext('2d');
  // The master packs each model into a 960px column; the lower camera is pillarboxed.
  const cameras = [...host.querySelectorAll('.ic-views canvas')].map((tile, i) => ({
    ctx: tile.getContext('2d', { alpha: false }),
    x: Math.floor(i / 2) * 960 + (i % 2 ? 184 : 0),
    y: i % 2 ? 480 : 0,
    width: tile.width,
  }));
  function paintCameras(source) {
    for (const { ctx, x, y, width } of cameras) ctx.drawImage(source, x, y, width, 480, 0, 0, width, 480);
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let data, visible = false, attached = false, raf = 0, lastFrame = -1;
  video.muted = true;

  function refresh() {
    host.querySelectorAll('[data-ic-copy]').forEach(el => { el.textContent = L(copy[el.dataset.icCopy]); });
    canvas.setAttribute('aria-label', L(copy.map));
  }
  function start() {
    if (!visible || document.hidden) return;
    if (!attached) {
      attached = true;
      const poster = new Image();
      poster.onload = () => { if (video.readyState < 2) paintCameras(poster); };
      poster.src = 'media/interaction/avoidance.jpg';
      video.preload = 'auto';
      video.src = 'media/interaction/avoidance.mp4';
      fetch('media/interaction/bev.json').then(r => {
        if (!r.ok) throw Error('Missing trajectory data');
        return r.json();
      }).then(({ avoidance }) => {
        data = avoidance;
        data.smoothPaths = data.paths.map(smoothPath);
        draw(Math.floor(video.currentTime * data.fps));
      }).catch(() => {
        canvas.hidden = true;
        host.querySelector('[data-ic-copy="mapError"]').hidden = false;
      });
    }
    if (!reduced.matches) video.play().then(tick).catch(() => {});
  }
  let lastPaintedFrame = -1;
  function paintFrame() {
    const frame = Math.floor(video.currentTime * (data?.fps ?? 12));
    if (video.readyState < 2 || frame === lastPaintedFrame) return;
    paintCameras(video);
    lastPaintedFrame = frame;
    if (data) draw(frame);
  }
  function tick() {
    cancelAnimationFrame(raf);
    paintFrame();
    if(!video.paused && visible)raf=requestAnimationFrame(tick);
  }
  function draw(frame) {
    const d=data;if(!d)return;
    const i=Math.min(frame,d.frames.length-1);if(i===lastFrame)return;lastFrame=i;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#101e26';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Keep longitudinal and lateral distances on the same scale at every aspect ratio.
    const scale = Math.min(canvas.width / 220, canvas.height / 440);
    ctx.setTransform(scale, 0, 0, scale, (canvas.width - 220 * scale) / 2, (canvas.height - 440 * scale) / 2);
    const origin=d.paths[0][i];
    const project=([x,y])=>[110-(y-origin[1])*6,335-(x-origin[0])*6];
    ctx.strokeStyle='#20333e';ctx.lineWidth=.6;
    for(let n=-10;n<=50;n+=10){const y=335-n*6;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(220,y);ctx.stroke();}
    const path=(points,color,width,dash=[])=>{
      ctx.beginPath();points.forEach((p,k)=>{const [x,y]=project(p);k?ctx.lineTo(x,y):ctx.moveTo(x,y);});
      ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);
    };
    // Preserve the original per-frame road geometry and surrounding traffic.
    d.frames[i].lanes.forEach(l=>path(l,'#59707c',1));
    const car=(p,yaw,l,w,color)=>{
      const [x,y]=project(p);ctx.save();ctx.translate(x,y);ctx.rotate(-yaw);
      ctx.fillStyle=color;ctx.fillRect(-w*3,-l*3,w*6,l*6);ctx.restore();
    };
    d.frames[i].actors.forEach(a=>car(a,a[4],a[2],a[3],'#60778480'));
    ['#58d5c0','#ffb66b'].forEach((color,j)=>{
      // Show only the remaining recorded future, smoothed and anchored to the current ego pose.
      const current=d.paths[j][i], smooth=d.smoothPaths[j];
      const offset=current.map((v,k)=>v-smooth[i][k]);
      const future=smooth.slice(i).map(p=>p.map((v,k)=>v+offset[k]));
      ctx.lineCap='round';ctx.lineJoin='round';
      path(future,color,2.2,[4,4]);
      ctx.lineCap='butt';ctx.lineJoin='miter';
    });
    ['#58d5c0','#ffb66b'].forEach((color,j)=>{
      const p=d.paths[j][i];
      car(p,d.headings[j][i],4.5,1.9,color);
    });
  }

  new ResizeObserver(([entry]) => {
    const density = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(entry.contentRect.width * density));
    canvas.height = Math.max(1, Math.round(entry.contentRect.height * density));
    lastFrame = -1;
    if (data) draw(Math.floor(video.currentTime * data.fps));
  }).observe(host.querySelector('.ic-bev-plot'));

  video.addEventListener('playing',tick);video.addEventListener('loadeddata',paintFrame);
  video.addEventListener('error',()=>{host.querySelector('.ic-error').hidden=false;});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else {video.pause();cancelAnimationFrame(raf);}},{threshold:.15}).observe(host);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){video.pause();cancelAnimationFrame(raf);}else start();});
  reduced.addEventListener('change',()=>{if(reduced.matches){video.pause();cancelAnimationFrame(raf);}else start();});
  onLangChange(refresh);refresh();
}
