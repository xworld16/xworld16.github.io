// English dictionary. Keys must mirror zh.js exactly — `npm run check` verifies parity.
// Strings used with data-i18n-html may contain simple inline markup (<strong>, <em>, <code>, <sub>, <sup>).
import { site } from '../content/site.config.js';

export default {
  meta: {
    title: site.report.title,
    description:
      'X-World 1.6 builds controllable virtual cities with world models: seven synchronized views, diverse scene conditions, long-horizon rollouts and RL post-training.',
  },

  a11y: {
    skip: 'Skip to content',
    mainNav: 'Main navigation',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    langSwitch: 'Language',
    toEnglish: 'Switch to English',
    toChinese: 'Switch to Chinese',
    progress: 'Reading progress',
    sectionTabs: 'Examples in this section',
  },

  nav: {
    foundation: 'Model, Data & Evaluation',
    advances: 'Advances',
    posttraining: 'Long-Horizon Generation & Diffusion-RL',
    closedLoop: 'Closed-Loop Simulation & Training',
    overview: 'Overview',
    control: 'Control & Consistency',
    grounding: 'Scene Conditioning',
    dashcam: 'DashCam Data Production',
    long: 'Long-Horizon',
    rl: 'RL',
    method: 'Method',
    data: 'Data',
    apps: 'Applications',
    resources: 'Resources',
    report: 'Report',
    menu: 'Menu',
    demos: 'Demos',
    more: 'Research',
  },

  common: {
    referenceClip: 'Reference clip',
    toBeReplaced: 'to be replaced',
    placeholder: 'Placeholder',
    play: 'Play',
    pause: 'Pause',
    replay: 'Replay',
    fullscreen: 'Full screen',
    exitFullscreen: 'Exit full screen',
    prevFrame: 'Previous frame',
    nextFrame: 'Next frame',
    speed: 'Speed',
    seek: 'Seek',
    loading: 'Loading video…',
    loadError: 'The video could not be loaded.',
    retry: 'Retry',
    frames: 'frames',
    sec: 's',
    fpsPlayback: 'fps playback',
    views7: '7 views',
    view1: 'single view',
    input: 'Input',
    output: 'Output',
    control: 'Control input',
    modelOutput: 'Model output',
    observe: 'What to look for',
    relation: 'How the evidence constrains the output',
    inject: 'How it is injected',
    renderNote: 'About this render',
    reportBasis: 'Report basis',
    details: 'Details',
    schematic: 'Schematic — not the condition used in this clip',
    new16: 'New in 1.6',
    from10: 'From X-World 1.0',
    rerouted: 'From 1.0 · re-routed in 1.6',
    sharedClip: 'Same placeholder clip in all three tabs',
    looped: 'Looped preview',
    playsOnce: 'Plays once',
    open: 'Open',
    readOnline: 'Read online',
    download: 'Download PDF',
    backToTop: 'Back to top',
    seeSection: 'Go to section',
    seeTraining: 'See training pipeline',
    seeArchitecture: 'See architecture',
    seeApplications: 'See applications',
    pending: 'pending',
    zoom: 'View larger',
    dataTable: 'Show as table',
    status: 'Status',
    schematicBadge: 'Schematic',
    videoNumber: 'Video {number}',
    videoPosition: 'Video {current} of {total}: {title}',
    showVideo: 'Show {title}, video {number}',
    previousVideo: 'Previous',
    nextVideo: 'Next',
  },

  theme: {
  "label": "Appearance",
  "light": "Day",
  "dark": "Night"
},

  mfx: {
  "play": "Play",
  "pause": "Pause",
  "replay": "Restart",
  "progress": "Animation progress"
},

  mf: {
  "kicker": "How it works",
  "title": "From scene evidence to seven synchronized views",
  "subtitle": "Choose a scene input to trace conditioning, generation and synchronized output.",
  "routeLabel": "Conditioning route",
  "oneModel": "One route per trained model — not a unified multimodal model",
  "head": {
    "s": 'Scene evidence <span class="math-var">S</span>',
    "c": "Conditioning interface",
    "core": 'Joint generation <span class="math-italic">θ</span>',
    "out": "Seven views"
  },
  "cond": {
    "rDashcam": "Dashcam → one extra noise-free view stream",
    "rR2V": "References → one shared reference state",
    "r3DGS": "3DGS → renders aligned to the target poses",
    "rPC": "Point cloud → pixel-aligned RGB + depth"
  },
  "tp": {
    "refState": "shared reference state",
    "refGeom": "own camera pose",
    "targets": "7 target views",
    "time": "time",
    "r2vNote": "joint attention ↔ · spatial RoPE only, no reference timestamp",
    "dashStreams": "7 target streams + dashcam stream D",
    "dashNote": "cross-view attention at each latent time · D removed before the head",
    "renders": "3DGS renders along the reference trajectory",
    "targetsT": "target latents at the same time steps",
    "gsNote": "render pose ≠ requested motion: the pose delta encodes the offset",
    "depth": "depth render",
    "noEvidence": "no point evidence",
    "pcNote": "per latent position: [z_τ ∥ RGB ∥ depth] → shared linear projector"
  },
  "core": {
    "kicker": "joint generation",
    "sub": "multi-view DiT · one trained instance per route",
    "in": "scene evidence in",
    "blocks": "DiT blocks per denoising step",
    "decode": "VAE decode"
  },
  "layer": {
    "A": "AdaLN-Zero ← action",
    "self": "Per-view space–time attn.",
    "E": "Per-view text cross-attn.",
    "F": "Traffic-light branch",
    "cross": "Cross-view attention",
    "OML": "Structured cross-attn.",
    "ffn": "Feed-forward"
  },
  "out": {
    "title": "7 synchronized views",
      "time": "One view over time (front tile)",
    "note": {
      "rR2V": "Frames from the R2V reference clip (t ≈ 3 s), in its render layout.",
      "rDashcam": "Frames from the Dashcam → Multiview reference clip.",
      "r3DGS": "The current asset contains only the front camera (cam0) of a 3DGS-conditioned rollout.",
      "rPC": "Explore the interactive point-cloud-conditioned scenes in the Scene-Grounded Generation demos."
    }
  },
  "ctrl": {
    "title": 'Scenario controls <span class="math-var">C</span> — example conditions from the R2V clip',
    "off": "Dashcam route: action injection is off; other conditions must agree with the recording.",
    "A": "Ego motion",
    "AHow": "velocity · curvature · roll · pitch",
    "E": "Environment text",
    "EHow": "weather · time of day (caption shown verbatim)",
    "F": "Traffic lights",
    "FHow": "state per source frame (schematic)",
    "OML": "Agents · markers · lanes",
    "OMLHow": "BEV of the structured conditions"
  },
  "step0": "Scene evidence",
  "step1": "Conditioning & controls",
  "step2": "Joint denoising",
  "step3": "Seven synchronized views",
  "explain": {
    "route": {
      "rDashcam": "The complete dashcam sequence is VAE-encoded and enters as an additional, noise-free view stream with its own GeoPE. It fixes both the place and the events.",
      "rR2V": "Reference images from other moments and cameras are encoded one by one, tagged with GeoPE from their own calibration and pose, and kept as one shared reference state.",
      "r3DGS": "A static 3DGS reconstruction is rendered along a reference trajectory; a per-frame pose delta (camPE + GeoPE) separates the render viewpoint from the requested motion.",
      "rPC": "The static point cloud is rendered to RGB and depth in all seven target views; both are encoded and concatenated with the noisy latent at matching positions."
    },
    "ctrl": "Controls enter their own branches in every block: action through AdaLN-Zero, text per view, traffic lights in a masked branch before cross-view fusion, and agents / markers / lanes in one shared masked cross-attention.",
    "ctrlOff": "With dashcam conditioning, separate ego-action injection is disabled — the full sequence already supplies the motion; any other supplied conditions must agree with the recording.",
    "denoise": "Each block runs per-view spatiotemporal attention, then cross-view attention over the seven views at the same latent time; the N blocks are applied at every denoising step.",
    "out": "The VAE decodes seven synchronized camera views."
  },
  "pill": {
    "rDashcam": "+1 view stream",
    "rR2V": "reference tokens",
    "r3DGS": "render latents + Δpose",
    "rPC": "channel concat",
    "decode": "VAE decode"
  },
  "lg": {
    "scene": "scene evidence path",
    "ctrl": "control injection",
    "alt": "alternative route (separate model)",
    "photo": "frame from a reference clip",
    "glyph": "drawn glyph = schematic"
  }
},

  tl: {
  "illustrative": "Chunk counts illustrative · not to scale",
  "time": "time",
  "chunks": "chunks",
  "cond": {
    "text": "Text",
    "action": "Action",
    "struct": "Structured",
    "camera": "Cameras",
    "scene": "Scene ref."
  },
  "spec": {
    "attn": "Attention",
    "hist": "Context",
    "steps": "Denoising",
    "sup": "Supervision",
    "obj": "Objective"
  },
  "specs": {
    "s1": {
      "attn": "full, bidirectional",
      "hist": "whole clip, jointly",
      "steps": "multi-step",
      "sup": "data · per-condition dropout",
      "obj": "rectified flow matching"
    },
    "s2": {
      "attn": "block-causal (bidirectional within a chunk)",
      "hist": "clean ground-truth chunks",
      "steps": "multi-step",
      "sup": "data · noisy branch only",
      "obj": "flow matching"
    },
    "s3": {
      "attn": "block-causal",
      "hist": "clean ground-truth chunks",
      "steps": "few-step",
      "sup": "frozen TF teacher · one CFG Euler step",
      "obj": "consistency loss vs EMA (stop-grad)"
    },
    "s4": {
      "attn": "block-causal + KV cache",
      "hist": "self-generated chunks",
      "steps": "few-step",
      "sup": "bidirectional real-score teacher + fake score",
      "obj": "DMD + shortcut gradient replay"
    },
    "s5": {
      "attn": "block-causal + KV cache",
      "hist": "self-generated, longer rollouts",
      "steps": "few-step",
      "sup": "extended bidirectional teacher",
      "obj": "DMD (+ auxiliary GAN branch)"
    },
    "s6": {
      "attn": "block-causal + clean KV bank",
      "hist": "frozen candidate trajectories",
      "steps": "4-step",
      "sup": "HPSv3 + IDM rewards",
      "obj": "DiffusionNFT + reference regularizer"
    }
  },
  "beats": {
    "s1": [
      "All chunks are denoised together with full attention",
      "Stage 1: high per-condition dropout; with none left, some latents stay clean",
      "Stage 2: lower dropout strengthens condition adherence"
    ],
    "s2": [
      "Noisy chunk i is the query",
      "It attends to earlier clean ground-truth chunks and itself",
      "Later chunks are masked — no future leakage"
    ],
    "s3": [
      "The frozen teacher-forcing teacher takes one CFG Euler step",
      "Student and its EMA predict clean endpoints",
      "The consistency loss pulls the endpoints together → few steps"
    ],
    "s4": [
      "Roll out on self-generated history, writing each chunk to the KV cache",
      "Self Forcing: DMD supervises each chunk, but detached caches cut gradients",
      "CSF: shortcut gradient replay reconnects later chunks to earlier ones"
    ],
    "s5": [
      "Original horizon and real-score teacher window",
      "A teacher fine-tuned on longer sequences replaces the real-score teacher",
      "CSF continues with longer student rollouts"
    ],
    "s6": [
      "The frozen Old policy branches K candidates from a shared prefix",
      "HPSv3 scores every view × latent; IDM scores motion per latent",
      "Advantages are normalized, clipped and mixed → NFT update"
    ]
  },
  "s1": {
    "attn": "Full attention: every chunk attends to every other",
    "conds": "Condition dropout",
    "stage1": "Stage 1 · high dropout",
    "stage2": "Stage 2 · low dropout",
    "inpaint": "No condition left → temporal latent inpainting"
  },
  "s2": {
    "gt": "Clean ground-truth chunks (history)",
    "noisy": "Noisy chunks (supervised)",
    "rule": "Noisy chunk i attends to clean chunks j < i and to itself",
    "loss": "Loss on the noisy branch only; one pass trains all chunks in parallel",
    "mask": "Attention mask",
    "colGT": "clean GT",
    "colNz": "noisy"
  },
  "s3": {
    "keep": "Teacher-forcing input structure is kept",
    "ode": "teacher denoising path (many small steps)",
    "euler": "one CFG Euler step",
    "student": "student G_θ(x_τ) → x̂₀",
    "ema": "EMA G_θ̄(x_τ′) → x̂₀′",
    "match": "L_CD: match endpoints (stop-grad on EMA)",
    "teacher": "Frozen TF teacher",
    "loss": "x_τ′ = x_τ + (σ_τ′ − σ_τ) v_CFG",
    "few": "→ few-step causal generator"
  },
  "s4": {
    "real": "Real score: frozen bidirectional teacher",
    "fake": "Fake score: trainable",
    "kvnote": "A KV-writing pass that shares the generator’s parameters stores each chunk",
    "rollout": "Autoregressive rollout on self-generated history",
    "sf": "Self Forcing: detached KV caches block cross-chunk gradients",
    "csf": "Connected Self Forcing: shortcut gradient replay"
  },
  "s5": {
    "oldT": "Original real-score teacher window",
    "newT": "Extended bidirectional teacher (fine-tuned on longer sequences)",
    "keep": "Same causal architecture, few-step denoising, DMD and shortcut replay",
    "gan": "DMD + auxiliary GAN branch (report §1)",
    "rollout": "student rollout"
  },
  "s6": {
    "old": "Old policy",
    "frozen": "frozen",
    "prefix": "shared clean prefix P",
    "grid": "HPSv3: per camera × latent · IDM: per latent, broadcast to all views",
    "adv": "Mixed advantage",
    "cur": "Current policy",
    "k": "K candidate trajectories (K illustrative)"
  }
},

  landing: {
    eyebrow: "XPeng GWM Team",
    tagline: "Building Controllable Virtual Cities with World Models",
    explore: "Explore the world",
    scene: "POINT CLOUD → 3DGS → DIFFUSION",
    scroll: "Scroll to unfold",
    worldTitle: "Every View. The Same World.",
    worldLede: "Seven synchronized cameras. One continuous driving scene.",
    synchronized: "7 views · synchronized",
    mainView: "Main view",
    viewLabel: "Generated view {n}",
    play: "Play film",
    pause: "Pause film",
    loadError: "Film unavailable. Showing scene previews.",
  },

  hero: {
    eyebrow: 'Multi-camera driving world model · technical report',
    subtitle: 'Virtual City generation — real-world scene grounding meets controllable world evolution.',
    lede:
      'X-World 1.6 generates seven synchronized driving views, grounded in real scenes and guided by scenario controls. Causal post-training enables longer, few-step rollouts.',
    ctaReport: 'Technical report',
    ctaDemos: 'Explore demos',
    stat1: '7',
    stat1Label: 'synchronized camera views',
    stat2: '4',
    stat2Label: 'scene-grounding routes',
    stat3: '6',
    stat3Label: 'training stages',
    videoTag: 'Dashcam → 7 views',
    notice: 'All videos on this page are reference clips used to shape the layout. Final curated results will replace them.',
    dev1Title: 'Control and Consistency',
    dev1Body: 'New road-marker and traffic-light controls, with stronger cross-view geometric consistency.',
    dev2Title: 'Diverse Scene Conditions',
    dev2Body: 'Reference images, 3DGS and point clouds provide scene evidence for grounded generation.',
    dev3Title: 'Long-Horizon Generation & Diffusion-RL',
    dev3Body: 'Causal few-step generation supports longer rollouts. Diffusion-RL improves adherence to driving conditions.',
  },

  overview: {
    eyebrow: 'Overview',
    title: 'Three Advances in X-World 1.6',
    lede: 'Building on X-World 1.0, we strengthen controllable generation and sustained interaction.',
    mapTitle: 'Explore the page',
    appsTitle: 'Downstream applications',
    dashcamTitle: 'DashCam Data Production',
    dashcamBody: 'From internet video to seven-view training data for VLA 2.0.',
    closedLoopTitle: 'Closed-Loop Simulation & Training',
    closedLoopBody: 'An interactive environment for evaluating and improving driving policies.',
  },

  foundation: {
    eyebrow: 'Technical Foundation',
    title: 'Model, Data & Evaluation',
    lede: 'A shared model architecture, curated driving data and VLM-assisted human evaluation support each iteration of X-World.',
  },
  posttraining: {
    eyebrow: 'Technical Advances',
    title: 'Long-Horizon Generation & Diffusion-RL',
    lede: 'Causal few-step generation, long-horizon tuning and Diffusion-RL improve sustained generation and adherence to driving conditions.',
  },
  applicationChapter: {
    eyebrow: 'Downstream Applications',
    title: 'Applications',
    lede: 'X-World 1.6 supports VLA 2.0 through two applications: DashCam training-data production, and interactive environments for closed-loop simulation and RL training.',
  },

  closedLoop: {
    eyebrow: 'Application · Interactive Environment',
    title: 'Closed-Loop Simulation & Policy Training',
    lede: 'Recorded locations become interactive driving environments for evaluating and improving VLA 2.0.',
  },

  control: {
    eyebrow: 'Technical Advances',
    title: 'Control & Consistency',
    lede:
      'Specify lanes, road markers and traffic lights to guide seven-view driving video generation.',
    inputLabel: 'What you control',
    outputLabel: 'Generated result',
    placeholderNote:
      'All three tabs use one shared reference clip; dedicated per-control comparison results are not yet shown.',
    tab: {
      lane: 'Lane',
      road_marker: 'Road Marker',
      traffic_light: 'Traffic Light',
    },
    tabSub: {
      lane: 'Lane lines & road geometry · L',
      road_marker: 'Road-surface markings · M',
      traffic_light: 'Signal states · F',
    },
    types: {
      lane: {
        title: 'Lane & Road-Geometry Control',
        input: 'Set the types and positions of lane lines and road boundaries.',
        output: 'All seven views share a consistent road layout that follows the specified geometry.',
      },
      road_marker: {
        title: 'Road-Marker Control',
        input: 'Set the types and positions of crosswalks, direction arrows and stop lines.',
        output: 'Markings appear at the requested locations and remain consistent as the cameras move.',
      },
      traffic_light: {
        title: 'Traffic-Light Control',
        input: 'Set signal locations, colours and when each light changes.',
        output: 'Visible lights follow the requested states and timing across the camera views.',
      },
    },
  },

  pointcloud: {
    viewer: 'Point-cloud-conditioned generation · synchronized scene viewer',
    generated: 'Generated RGB', condition: 'Point cloud', display: 'Camera display',
    compareDrag: 'Drag CAM2 to compare generated video on the left and point-cloud renders on the right across all seven views',
    compareValue: '{value}% generated RGB; point cloud on the right',
    cam2Condition: 'Point cloud / cam2', generatedBadge: 'Generated',
    previousScene: 'Previous scene', nextScene: 'Next scene',
    videoError: 'This video could not be loaded. Choose another sample or reload.',
    chooseScene: 'Choose scene…', pointSize: 'LiDAR point size',
    sceneG150: 'Town intersection', sceneG387: 'Urban left turn', sceneG293: 'Night left curve',
    cam0: 'Front narrow', cam2: 'Front fisheye', cam3: 'Front left', cam4: 'Front right', cam5: 'Rear left', cam6: 'Rear right', cam7: 'Rear',
    enlarge: 'Enlarge {view}', lidarLabel: 'Interactive scene point cloud. Drag to orbit, scroll to zoom, R to reset.',
    resetLidar: 'Reset LiDAR direction', enlargeLidar: 'Enlarge LiDAR', rotate: 'Drag to rotate',
    orbitHelp: 'Drag to orbit · scroll to zoom · R to reset', loadingCloud: 'Loading point cloud…',
    play: 'Play synchronized scene', pause: 'Pause synchronized scene', restart: 'Restart scene', timeline: 'Scene timeline',
    enterFull: 'Enter fullscreen', exitFull: 'Exit fullscreen', previous: 'Previous frame', next: 'Next frame', loop: 'Loop', speed: 'Playback speed',
    details: 'Enlarged sensor view', close: 'Close enlarged view', playPause: 'Play / pause', download: 'Download video ↗',
    hint: 'Click a camera or LiDAR to enlarge. Drag LiDAR to orbit.', keys: 'Automatic synchronized loop',
    fullCamera: 'Full camera frame · synchronized with the scene.', lidarTitle: 'LiDAR · Scene point cloud', enlargedCloud: 'Enlarged interactive point cloud',
    preview: 'Preview · final results pending', loading: 'Loading synchronized scene…', switching: 'Switching synchronized views…',
    generatedState: 'Point-cloud-conditioned generation', conditionState: 'Rendered point-cloud conditions', loadedCameras: '{count} / 7 camera videos loaded',
    dataError: 'Point cloud data is invalid', dataLoadError: 'Point cloud file could not be loaded', manifestError: 'Scene manifest is unavailable.',
    previewNote: 'Preview results. Final clips will replace these videos. LiDAR and rendered conditions share the selected scene and time window.',
    finalNote: 'LiDAR visualizes the static input point cloud along the selected trajectory.',
  },

  frosted: { dashcam: 'DashCam to multiview: synchronized video', r2v: 'Reference images to seven views: synchronized video', loading: 'Loading demo…' },

  grounding: {
    eyebrow: 'Technical Advances',
    title: 'Generation Grounded in Scene Evidence',
    lede:
      'Roads and buildings provide a stable setting; camera motion and traffic can still evolve. Explore three ways to anchor a generated scene below.',
    gallery: {
      reference_images: {
        summary: 'Images of the same place, captured at other times or from other cameras, supply local detail. Motion and traffic still follow the requested conditions.',
        footnote: 'Reference images supply place-specific detail beyond the initial view while allowing traffic, lighting and ego motion to vary with the requested conditions.',
      },
      '3dgs': {
        summary: 'A 3D Gaussian Splatting reconstruction anchors the static scene while the model generates motion and traffic. Explore three scenes, each shown through seven synchronized cameras.',
        footnote: 'The reconstructed scene provides a continuous spatial reference, keeping roads, buildings and guardrails consistent as motion and traffic change.',
      },
      point_cloud: {
        summary: 'One static point cloud grounds seven synchronized driving views. Compare each generated view with its corresponding point-cloud render.',
        footnote: 'Pixel-aligned color and depth provide a shared geometric reference for all seven views.',
      },
    },
    gsPosition: 'Demo {current} / {total}',
    gsCompare: 'Drag to compare 3DGS and Diffusion',
    gsCameras: { cam0: 'Front narrow', cam2: 'Front fisheye', cam3: 'Front left', cam4: 'Front right', cam5: 'Rear left', cam6: 'Rear right', cam7: 'Rear' },
    gsSplitValue: '3DGS {gs}%, Diffusion {diffusion}%',
    carouselLabel: 'Scene-grounded generation videos',
    showVideo: 'Show {title}',
    position: 'Video {current} of {total}: {title}',
    previous: 'Previous',
    next: 'Next',
    staticTitle: 'What “static” means here',
    staticBody:
      'Absolute static preserves roads, buildings, guardrails, and infrastructure—not a fixed camera, frozen traffic, or copied video.',
    modelNote: 'Each tab uses a different conditioning model; they are not one unified model.',
    tab: {
      reference_images: 'Reference-Image-Conditioned',
      '3dgs': '3DGS-Conditioned',
      point_cloud: 'Point-Cloud-Conditioned',
    },
    tabSub: {
      reference_images: 'Images from other moments',
      '3dgs': 'Absolute static scene',
    },
    types: {
      reference_images: {
        title: 'Reference-enhanced generation (R2V)',
        input:
          'Reference images of the same location taken at other moments or by other cameras, each with its calibration and pose, plus controls <span class="math-var">C</span> and target cameras <span class="math-symbol">Π</span>.',
        output: 'A seven-view video that follows the requested trajectory and traffic while reusing place-specific detail from the references.',
        relation:
          'References are attached by geometry, not by time. GeoPE places each reference ray in the same scene frame as the target rays, and reference attention uses no temporal rotation. A reference therefore says what the place looks like — not which output frame must show it, and not how the ego vehicle should move.',
        observe: [
          'Facades, signage and road markings seen in a reference stay recognisable when the ego vehicle reaches that area.',
          'Vehicles in a reference and its capture-time lighting are allowed to change under the controls.',
          'Details absent from the first view but present in a reference appear consistently across cameras.',
        ],
        caution: 'A reference captured mid-sequence is not a hard constraint on the middle output frame.',
        basis: 'Reference tokens form one shared state with bidirectional attention to all seven target views (report §3.2.2).',
      },
      '3dgs': {
        title: '3DGS-conditioned generation',
        input:
          'A 3D Gaussian Splatting reconstruction of the absolute static scene — persistent structures only, with vehicles and pedestrians removed — rendered along a reference trajectory, plus the X-World action and a per-frame pose delta between render and action.',
        output:
          'Seven synchronized views that follow the action while keeping the reconstructed buildings, road surface and guardrails; traffic participants are synthesized by the generator.',
        relation:
          'Rendering places the static scene at the target viewpoints before generation, so the condition is spatially aligned with the output. Pose-delta encoding (in camPE and GeoPE) tells the model where the render was taken relative to the requested motion, so it does not simply copy the render.',
        observe: [
          'Background buildings, guardrails and road surface stay true to the scene instead of drifting over the rollout.',
          'Static structures are correctly occluded by — and revealed behind — generated traffic.',
          'Compare with report Figure 6 below: without 3DGS conditioning, scene-specific details drift.',
        ],
        recon:
          'Static reconstruction uses either dynamic-node modeling (OmniRe, with SAM3-based segmentation and tracking) or mask-out reconstruction that excludes dynamic pixels from the loss. Diffusion training uses about one million clip pairs rendered along alternative trajectories.',
        basis: 'Report §3.3.1, Figure 6.',
      },
    },
    pcTitle: 'Point-cloud conditioning',
    pcBody:
      'The fourth route renders an absolute static point cloud into RGB and depth for all seven target views at every time step and injects them pixel-wise by channel concatenation. Zero depth means “no point-cloud evidence here”, not “empty space”.',
    pcStatus: 'Described in the report · no demo clip yet',
    fig6Title: 'Report Figure 6 — without vs with absolute-static-scene conditioning',
  },

  dashcam: {
    eyebrow: 'Application · Data Production',
    title: 'DashCam: Training Data for VLA 2.0',
    lede:
      'Collect monocular dashcam videos from the internet, expand them into seven synchronized views with X-World, and use the generated videos to train the downstream VLA 2.0 model.',
    input:
      'The complete dashcam sequence, encoded by the video VAE and fed as an additional, noise-free view stream with its own GeoPE and camera conditioning.',
    output: 'Seven target views along the recorded trajectory. The dashcam stream is dropped before the prediction head.',
    relation:
      'Static structures, traffic participants, signal states and environmental appearance follow the source video. Separate ego-action injection is disabled, because the full dashcam sequence already supplies the motion.',
    observe: [
      'Cross-view: a vehicle that leaves the forward view should reappear in the side and rear views with the same identity.',
      'Temporal: generated views show the same events at the same times as the source.',
      'Coverage: content the dashcam never saw is completed plausibly and consistently across cameras.',
    ],
    training:
      'Training pairs come from synchronized multi-camera recordings: the front camera is augmented to look like a dashcam (framing, scale, aspect ratio, image quality, residual distortion) while the original seven views remain the target.',
    distinction:
      'Unlike R2V or 3DGS conditioning, dashcam generation does not take independently edited scenario controls — it completes the recorded scenario.',
    trainingTitle: 'Training pairs',
    distinctionTitle: 'Not an editable scenario',
  },

  long: {
    iframeTitle: 'Self Forcing and Connected Self Forcing interactive comparison',
    loading: 'Loading comparison…',
    eyebrow: 'Long-Horizon Generation',
    title: 'Long-Horizon Generation',
    lede:
      'Compare Self Forcing and Connected Self Forcing as a generated driving scene unfolds over time.',
    summary: 'Connected Self Forcing improves scene continuity and visual stability as generation extends over time.',
    durationNote:
      'Clip length {d} s · {f} frames · {fps} fps playback. This is the length of the current reference clip, not the model’s maximum rollout length; playback frame rate is not inference speed.',
    sharedNote: 'Placeholder: currently the same footage as the Controllable Generation clip.',
    noLoop: 'Plays muted on a continuous loop.',
    inspect: 'Inspect moments',
    jumpTo: 'Jump to {t} s',
    observe: [
      'Scene preservation: buildings and road layout seen early stay consistent when they reappear or are seen from other cameras.',
      'Temporal continuity: no jumps, flicker or identity swaps at chunk boundaries.',
      'Stability: sharpness and colour do not degrade toward the end of the rollout.',
    ],
    momentLabels: ['Start', '25%', '50%', '75%', 'End'],
  },

  rl: {
    eyebrow: 'RL',
    title: 'Diffusion-RL',
    lede:
      'Reinforcement learning refines X-World itself, improving visual quality and ego-motion adherence.',
    interactionHint: 'Base, GT and RL unfold as synchronized frame decks on the left; the point-cloud result on the right follows the same moment.',
    summary: 'Motion consistency and visual quality are optimized together. These selected examples provide a qualitative comparison.',
    comparedTitle: 'What is compared',
    compared: 'Base (iteration 0, before RL) and iter150 (RL checkpoint at iteration 150), generated for the same clip with the same seed.',
    scope:
      'Selected samples for qualitative illustration — not a full RL evaluation.',
    frameTitle: 'Interactive comparison',
    open: 'Open standalone',
    loading: 'Loading comparison…',
    error: 'The comparison could not be loaded here.',
    iframeTitle: 'Diffusion-RL: synchronized Base, GT, RL and point-cloud results',
    distinctTitle: 'Not the same as closed-loop policy RL',
    distinct:
      'This section improves the world model itself. Using X-World as an environment to train a driving policy in closed loop is a separate application.',
  },

  method: {
    eyebrow: 'Model Architecture',
    title: 'Model Architecture',
    lede:
      'Scene evidence and driving conditions come together in a multi-view DiT to generate seven synchronized views.',
    figure: {
      alt: 'Figure 3: network architecture, DiT block with driving-condition branches, and shared scene–video self-attention across seven views.',
      viewFull: 'View full figure',
    },
    archTitle: 'Model Architecture',
    archLede:
      'Scene grounding and controllable evolution meet inside the X-World multi-view DiT: scene evidence enters through one of four routes, controls through their own branches, and the backbone jointly synthesizes seven views with cross-view and temporal interaction.',
    colScene: 'Scene evidence S',
    colSceneSub: 'where · one route per model',
    colBackbone: 'X-World multi-view DiT',
    colBackboneSub: 'one trained instance per conditioning mode',
    colControl: 'Scenario controls C',
    colControlSub: 'what happens',
    colOut: 'Output',
    out7: '7 synchronized views',
    outSub: 'jointly denoised · T frames × 7 cameras',
    g2d: '2D observations',
    g3d: '3D representations',
    rDashcam: 'Dashcam video',
    rDashcamHow: 'extra noise-free view stream · GeoPE',
    rDashcamFix: 'fixes where + what',
    rR2V: 'Reference images (R2V)',
    rR2VHow: 'shared reference state · GeoPE',
    rR2VFix: 'fixes where',
    r3DGS: '3DGS render',
    r3DGSHow: 'rendered reference video · pose delta (camPE + GeoPE)',
    r3DGSFix: 'geometry + appearance',
    rPC: 'Point cloud',
    rPCHow: 'RGB + depth renders · pixel-wise channel concat',
    rPCFix: 'geometry only',
    bSelf: 'Per-view spatiotemporal self-attention',
    bText: 'Per-view text cross-attention',
    bTFL: 'Traffic-light branch (masked)',
    bCross: 'Cross-view attention',
    bStruct: 'Structured cross-attention (O · M · L, masked)',
    bFFN: 'Feed-forward',
    bAdaLN: 'AdaLN-Zero modulation ← action A',
    bInit: 'init · Wan2.2-TI2V-5B',
    bIn: 'scene tokens / latents from the selected route',
    bRepeat: '× N DiT blocks',
    cA: 'Ego motion A',
    cAHow: 'velocity · curvature · roll · pitch → AdaLN-Zero',
    cOML: 'Agents O · Markers M · Lanes L',
    cOMLHow: 'separate encoders → shared masked cross-attention',
    cF: 'Traffic lights F',
    cFHow: 'per-frame state tokens + projected masks',
    cE: 'Environment text E',
    cEHow: 'weather · time of day → per-view text branch',
    archNote:
      'Reference photos and output frames are from the same R2V example. The animation illustrates the process; no model runs on this page. Each conditioning mode uses a separately trained model.',
    trainTitle: 'Training pipeline',
    trainLede:
      'Bidirectional pretraining is followed by autoregressive post-training. Each stage solves one problem of the previous model; select a stage for details.',
    pre: 'Pretraining',
    post: 'Post-training',
    lProblem: 'Problem solved',
    lChange: 'Key change',
    lResult: 'Result',
    lShown: 'Shown in',
    trainNote: 'Redrawn from report Figure 8 and Sections 5.1–5.6.',
    viz: {
      full: 'Full attention',
      dropout: 'Dropout · stage 1 → 2',
      mask: 'Block-causal mask',
      cleanGT: 'Clean GT',
      noisy: 'Noisy',
      oneStep: 'one CFG Euler step',
      teacher: 'frozen TF teacher',
      student: 'student Gθ',
      ema: 'EMA student',
      match: 'match clean endpoints',
      chunk: 'chunks over time',
      kv: 'KV writer',
      dmd: 'DMD gradient per chunk',
      replay: 'shortcut gradient replay',
      shortWin: 'original teacher window',
      longWin: 'extended teacher window',
      rollouts: 'K candidate rollouts',
      reward: 'HPSv3 + IDM rewards',
      adv: 'normalize · clip · mix',
      update: 'update Current policy',
    },
    stages: {
      s1: {
        name: 'Bidirectional pretraining',
        short: 'Full attention · flow matching',
        problem: 'Learn seven-view driving video under many optional conditions.',
        change:
          'Initialized from Wan2.2-TI2V-5B; rectified-flow objective with full temporal attention. Stage 1 uses high per-condition dropout (plus temporal latent inpainting when no condition remains); stage 2 lowers dropout to strengthen adherence. VAE and text encoder stay frozen.',
        result: 'Bidirectional checkpoints that initialize causal training and act as real-score teachers for DMD.',
        shown: 'Base controllability',
      },
      s2: {
        name: 'Teacher forcing',
        short: 'Block-causal · GT history',
        problem: 'A bidirectional model cannot generate causally from history.',
        change:
          'Full attention is replaced by a block-causal mask (bidirectional within a chunk). Clean ground-truth chunks are concatenated with noisy chunks, so each noisy chunk sees only earlier clean chunks and itself.',
        result: 'A causal model that predicts the next chunk from history.',
        shown: 'Causal rollout',
      },
      s3: {
        name: 'Causal consistency distillation',
        short: 'Few-step denoising',
        problem: 'Too many denoising steps for interactive rollout.',
        change:
          'A frozen teacher-forcing teacher takes one CFG Euler step to an adjacent noise level; the student’s clean-endpoint prediction is matched to its EMA’s prediction from that state.',
        result: 'A few-step causal generator that initializes Connected Self Forcing.',
        shown: 'Causal rollout',
      },
      s4: {
        name: 'Connected Self Forcing',
        short: 'Self-generated history · DMD',
        problem:
          'Train–inference mismatch: at inference the model conditions on its own outputs, and Self Forcing detaches KV caches, cutting gradients between chunks.',
        change:
          'Rollouts on self-generated histories are supervised by DMD (frozen bidirectional real-score teacher + trainable fake-score model). Shortcut Gradient Replay reconnects gradients from later chunks to earlier ones: g<sub>DMD</sub> + g<sub>cross</sub>. Training-only; inference is unchanged.',
        result: 'Context optimized both for its own quality and for its usefulness to later predictions.',
        shown: 'Long-horizon generation',
      },
      s5: {
        name: 'Long-horizon tuning',
        short: 'Longer teacher & rollouts',
        problem: 'Implausible scene evolution and visual hallucination over longer rollouts.',
        change:
          'The bidirectional teacher is fine-tuned on longer seven-view sequences and replaces the real-score teacher; CSF continues with longer student rollouts and supervision windows. The report also combines DMD with an auxiliary GAN branch for visual quality.',
        result: 'Quality maintained over extended rollouts with the same causal architecture and inference procedure.',
        shown: 'Long-horizon generation',
      },
      s6: {
        name: 'RL post-training',
        short: 'DiffusionNFT · HPSv3 + IDM',
        problem: 'Align visual quality and motion consistency with preferences.',
        change:
          'DiffusionNFT on the four-step causal model; Causal Multi-Block NFT with a block-causal clean KV bank; HPSv3 and IDM rewards normalized, clipped and mixed into one advantage; reference regularization.',
        result: 'A preference-aligned causal generator.',
        shown: 'RL',
      },
    },
  },

  data: {
    eyebrow: 'Data',
    title: 'Data curation',
    lede:
      'More real-world data, cleaned of acquisition defects and rebalanced toward hard maneuvers.',
    s1Value: '4×',
    s1Label: 'larger candidate pool than X-World 1.0',
    s2Value: '2×',
    s2Label: 'larger selected training set than X-World 1.0',
    s3Value: '150+',
    s3Label: 'scenario tags (quality, fine-grained behavior, corner cases)',
    s4Value: '≈1M',
    s4Label: 'rendered clip pairs for 3DGS-conditioned training',
    pipeTitle: 'Curation pipeline',
    pipeHint: 'From driving recordings to selected training data.',
    pipeCaption:
      'Grey flows are removed or unselected data. Flow widths are illustrative, not counts.',
    reportLink: 'Data methods in the report',
    pipeAria: 'Sankey diagram of the data pipeline: raw data, data cleaning, behavior tagging, SFT selection',
    kind: { pool: 'Data pool', tag: 'Behavior tag', sft: 'Selected for SFT', drop: 'Removed / not selected' },
    swipe: 'Swipe sideways to see the whole figure →',
    pRaw: 'Raw driving pool',
    pClean: 'Data cleaning',
    pTag: 'Behavior tagging',
    pSft: 'SFT selection',
    pRawSub: 'expanded candidate recordings',
    pCleanSub: 'acquisition defects removed',
    pTagSub: '150+ tags, improved accuracy',
    pSftSub: 'kinematics + behavior mining',
    evalTitle: 'Evaluation suite',
    e1Title: 'Human evaluation',
    e1:
      'Anomaly-based review of all seven views, localized by image region and time, covering visual fidelity, scene consistency, dynamic plausibility and condition adherence. Penalties are weighted by camera priority, object size and driving relevance.',
    e2Title: 'VLM evaluator',
    e2:
      'Qwen3-VL-8B-Instruct, fine-tuned on frames then clips and optimized with GRPO, localizes anomalies in the same format as human labels and serves as a first pass before human verification.',
    e2Stat: 'On 150 generated videos: annotation time 2 days → 1 day (−50%); 70% of pre-labelled camera views accepted without modification.',
    e3Title: 'Action evaluation with IDM',
    e3: 'An inverse dynamics model recovers ego motion from generated video to measure action adherence.',
    e3Status: 'Report section in progress',
    e4Title: 'Temporal & cross-view consistency',
    e4:
      'Reference-free diagnostics on generated video: object tracking (SAM 3 + ByteTrack + FG-CLIP 2 — appearance consistency, decay rate, ray residual), compression (H.264 inter vs all-intra gains), and reconstruction (UniSplat re-rendering — SSIM, PSNR, MAE).',
    tableSummary: 'Preliminary checkpoint diagnostics (report Table 1)',
    tableNote:
      'The report marks the analysis of this table as pending. Values are shown as reported, without ranking; “–” means not reported. SF = Self Forcing, CSF = Connected Self Forcing.',
    tStage: 'Stage / variant',
    tTracking: 'Tracking',
    tCompression: 'Compression',
    tRecon: 'Reconstruction',
  },

  apps: {
    eyebrow: 'Applications',
    title: 'Applications',
    lede: 'Explore how these capabilities support driving simulation and model evaluation. Status labels identify current and planned work.',
    planned: 'Planned',
    inProgress: 'In progress',
    described: 'Procedure described',
    vcTitle: 'Virtual City platform',
    vcBody:
      'A planned platform that turns evidence of a real intersection or road segment — on-site photos, location-matched images, reconstructions or point clouds — into a reusable location asset. Developers configure scenario families (for example left turns with different oncoming traffic, weather or signal timing), preview the seven views, then refine and save each case with its full configuration.',
    vcObj1: 'Location asset',
    vcObj1Sub: 'observations · geometry · cameras',
    vcObj2: 'Scenario configuration',
    vcObj2Sub: 'ego task · traffic · signals · weather',
    vcObj3: 'Generated case',
    vcObj3Sub: '7 views + asset version + settings',
    clTitle: 'Closed-loop simulation',
    clStatus: 'Failure-termination check not yet enabled',
    clBody:
      'The policy’s predicted trajectory conditions X-World, whose generated seven views are fed back to the policy. Recorded data enters only at the trigger time, several seconds before the event; afterwards the loop runs on generated observations. With a fixed seed and conditions the rollout is reproducible, so policies can be compared on identical simulated scenarios.',
    clSpec: 'Cases: 7-camera video at 12 Hz, at least 30 s long; trigger e.g. 5 s before the event.',
    openLoop: 'Open loop',
    openLoopBody: 'Each step is scored against the recorded replay; a prediction cannot change the next observation.',
    closedLoop: 'Closed loop',
    closedLoopBody: 'The prediction moves the simulated ego vehicle; X-World renders what it would see next.',
    nRecorded: 'Recorded data',
    nRecordedSub: 'enters at trigger time only',
    nPolicy: 'Policy model',
    nPolicySub: '7 views → ego trajectory',
    nWorld: 'X-World',
    nWorldSub: 'action + conditions → next 7 views',
    nEval: 'Evaluation',
    nEvalSub: 'trajectory · behavior per step',
    aAction: 'trajectory as action',
    aViews: 'generated views',
    oReplay: 'Recorded replay',
    oReplaySub: 'frames t = 0, 1, 2, …',
    oPred: 'Prediction',
    oPredSub: 'scored for this step only',
    noFeedback: 'no feedback to the next observation',
    steps: ['Initialize at the trigger time', 'Generate the next seven views', 'Predict a new trajectory', 'Record the step for evaluation', 'Iterate until the horizon or termination'],
    rlTitle: 'Towards closed-loop RL for driving policies',
    rlBody:
      'The same rollout mechanism is intended to serve as the environment for closed-loop reinforcement learning of the driving policy. This is distinct from the world-model RL post-training shown above; the report section is still being written.',
    prior: 'Context: X-World 1.0 has supported closed-loop evaluation, online RL and synthetic data generation in a VLA development pipeline (report §1).',
  },

  resources: {
    eyebrow: 'Resources',
    title: 'Resources',
    reportTitle: 'Technical Report',
    reportMeta: 'arXiv:2611.00596',
    draft: 'Draft',
    reportNote: 'Technical report · published on arXiv.',
    related: 'Related work cited in the report',
    code: 'Code',
    models: 'Models',
    arxiv: 'arXiv',
    video: 'Video',
    cite: 'Cite',
    copy: 'Copy',
    copied: 'Copied',
    moreSoon: 'Code, models and citation will be listed here once released.',
  },

  footer: {
    line1: 'X-World by the XPeng GWM Team · research project page',
    top: 'Back to top',
  },
};
