// 中文字典。键必须与 en.js 完全一致——`npm run check` 会校验。
// 术语约定：Virtual City、GeoPE、R2V、3DGS、CSF、DMD、IDM、HPSv3、BEV、KV 等保持英文；首次出现处附中文解释。
import { site } from '../content/site.config.js';

export default {
  meta: {
    title: site.report.title,
    description:
      'X-World 1.6 以世界模型构建可控虚拟城市，支持七路同步视角、多种场景条件、长时序推演与 RL 后训练。',
  },

  a11y: {
    skip: '跳到正文',
    mainNav: '主导航',
    menuOpen: '打开菜单',
    menuClose: '关闭菜单',
    langSwitch: '语言',
    toEnglish: '切换为英文',
    toChinese: '切换为中文',
    progress: '阅读进度',
    sectionTabs: '本部分示例',
  },

  nav: {
    foundation: '模型、数据与评测',
    advances: '技术进展',
    posttraining: '长时序生成与 Diffusion-RL',
    closedLoop: '闭环仿真与训练',
    overview: '概览',
    control: '控制与一致性',
    grounding: '多种场景条件',
    dashcam: 'DashCam 数据生产',
    long: '长时序',
    rl: 'RL',
    method: '模型结构',
    data: '数据',
    apps: '应用',
    resources: '资源',
    report: '技术报告',
    menu: '菜单',
    demos: '演示',
    more: '研究',
  },

  common: {
    referenceClip: '参考素材',
    toBeReplaced: '待替换',
    placeholder: '占位',
    play: '播放',
    pause: '暂停',
    replay: '重新播放',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    prevFrame: '上一帧',
    nextFrame: '下一帧',
    speed: '倍速',
    seek: '播放进度',
    loading: '视频加载中…',
    loadError: '视频无法加载。',
    retry: '重试',
    frames: '帧',
    sec: '秒',
    fpsPlayback: 'fps 播放',
    views7: '7 视角',
    view1: '单视角',
    input: '输入',
    output: '输出',
    control: '控制输入',
    modelOutput: '模型输出',
    observe: '观察要点',
    relation: '场景依据如何约束输出',
    inject: '注入方式',
    renderNote: '画面说明',
    reportBasis: '报告依据',
    details: '详细说明',
    schematic: '示意图——并非该视频实际使用的条件',
    new16: '1.6 新增',
    from10: '沿用自 X-World 1.0',
    rerouted: '沿用自 1.0 · 1.6 调整注入路径',
    sharedClip: '三个标签共用同一占位视频',
    looped: '循环预览',
    playsOnce: '单次播放',
    open: '打开',
    readOnline: '在线阅读',
    download: '下载 PDF',
    backToTop: '回到顶部',
    seeSection: '前往该部分',
    seeTraining: '查看训练流程',
    seeArchitecture: '查看模型结构',
    seeApplications: '查看应用',
    pending: '待补充',
    zoom: '放大查看',
    dataTable: '以表格显示',
    status: '状态',
    schematicBadge: '示意图',
    videoNumber: '视频 {number}',
    videoPosition: '第 {current} / {total} 个视频：{title}',
    showVideo: '查看{title}，视频 {number}',
    previousVideo: '上一个',
    nextVideo: '下一个',
  },

  theme: {
  "label": "外观模式",
  "light": "白天",
  "dark": "夜间"
},

  mfx: {
  "play": "播放",
  "pause": "暂停",
  "replay": "重新播放",
  "progress": "动画进度"
},

  mf: {
  "kicker": "工作原理",
  "title": "从场景依据到七路同步视角",
  "subtitle": "选择一种场景输入，查看条件注入、联合生成与同步输出。",
  "routeLabel": "条件路线",
  "oneModel": "每条路线对应一个独立训练的模型——并非统一的多模态模型",
  "head": {
    "s": '场景依据 <span class="math-var">S</span>',
    "c": "条件接口",
    "core": '联合生成 <span class="math-italic">θ</span>',
    "out": "七路视角"
  },
  "cond": {
    "rDashcam": "行车视频 → 一路不加噪的附加视角流",
    "rR2V": "参考图像 → 一个共享参考状态",
    "r3DGS": "3DGS → 与目标位姿对齐的渲染",
    "rPC": "点云 → 像素对齐的 RGB + 深度"
  },
  "tp": {
    "refState": "共享参考状态",
    "refGeom": "各自相机位姿",
    "targets": "7 个目标视角",
    "time": "时间",
    "r2vNote": "双向联合注意力 · 仅空间旋转编码，不绑定参考时间",
    "dashStreams": "7 路目标流 + 行车视频流 D",
    "dashNote": "逐 latent 时刻跨视角注意力 · D 在预测头前移除",
    "renders": "沿参考轨迹的 3DGS 渲染",
    "targetsT": "同一时间步的目标 latent",
    "gsNote": "渲染位姿 ≠ 所需运动：位姿差编码二者的偏移",
    "depth": "深度渲染",
    "noEvidence": "无点云依据",
    "pcNote": "逐 latent 位置：[z_τ ∥ RGB ∥ 深度] → 共享线性投影"
  },
  "core": {
    "kicker": "联合生成",
    "sub": "多视角 DiT · 每条路线一个训练实例",
    "in": "场景依据输入",
    "blocks": "个 DiT 块 / 每个去噪步",
    "decode": "VAE 解码"
  },
  "layer": {
    "A": "AdaLN-Zero ← 动作",
    "self": "逐视角时空自注意力",
    "E": "逐视角文本交叉注意力",
    "F": "红绿灯分支",
    "cross": "跨视角注意力",
    "OML": "结构化交叉注意力",
    "ffn": "前馈层"
  },
  "out": {
    "title": "7 路同步视角",
      "time": "同一视角随时间变化（前视画面）",
    "note": {
      "rR2V": "取自 R2V 参考视频（约 3 秒处）的生成帧，按渲染布局排列。",
      "rDashcam": "取自“单目转多视角”参考视频的生成帧。",
      "r3DGS": "当前素材只包含 3DGS 条件推演的前视相机（cam0）。",
      "rPC": "可在场景锚定生成部分查看可交互的点云条件示例。"
    }
  },
  "ctrl": {
    "title": '场景控制 <span class="math-var">C</span>——示例条件取自 R2V 参考视频',
    "off": "Dashcam 路线：关闭动作注入；其他条件需与原始记录一致。",
    "A": "自车运动",
    "AHow": "速度 · 曲率 · roll · pitch",
    "E": "环境文本",
    "EHow": "天气 · 时段（原文描述）",
    "F": "红绿灯",
    "FHow": "逐源帧状态（示意）",
    "OML": "交通参与者 · 标记 · 车道",
    "OMLHow": "结构化条件的 BEV 图"
  },
  "step0": "场景依据",
  "step1": "条件与控制注入",
  "step2": "联合去噪",
  "step3": "七路同步视角",
  "explain": {
    "route": {
      "rDashcam": "完整的行车视频经 VAE 编码，作为一路不加噪的附加视角流进入模型，并带有自身的 GeoPE。它同时确定地点与事件。",
      "rR2V": "来自其他时刻、其他相机的参考图像逐张编码，按各自的标定与位姿打上 GeoPE，并保持为一个共享参考状态。",
      "r3DGS": "静态 3DGS 重建沿参考轨迹渲染；逐帧位姿差（camPE + GeoPE）把渲染视点与所需运动区分开。",
      "rPC": "静态点云在七个目标视角中渲染为 RGB 与深度，两者编码后在对应位置与加噪 latent 拼接。"
    },
    "ctrl": "控制条件在每个块中经各自分支进入：动作经 AdaLN-Zero，文本逐视角注入，红绿灯在跨视角融合前经掩码分支注入，交通参与者 / 标记 / 车道共用一个掩码交叉注意力。",
    "ctrlOff": "使用行车视频条件时，独立的自车动作注入被关闭——完整序列已提供运动信息；其他提供的条件需与原始记录一致。",
    "denoise": "每个块先做逐视角时空注意力，再在同一 latent 时刻对七个视角做跨视角注意力；每个去噪步都要经过这 N 个块。",
    "out": "VAE 解码出七路同步的相机视角。"
  },
  "pill": {
    "rDashcam": "+1 路视角流",
    "rR2V": "参考 token",
    "r3DGS": "渲染 latent + Δpose",
    "rPC": "通道拼接",
    "decode": "VAE 解码"
  },
  "lg": {
    "scene": "场景依据通路",
    "ctrl": "控制注入",
    "alt": "可替换路线（独立模型）",
    "photo": "参考视频中的真实画面",
    "glyph": "绘制图形 = 示意"
  }
},

  tl: {
  "illustrative": "块数仅为示意 · 非实际比例",
  "time": "时间",
  "chunks": "块",
  "cond": {
    "text": "文本",
    "action": "动作",
    "struct": "结构化条件",
    "camera": "相机",
    "scene": "场景参考"
  },
  "spec": {
    "attn": "注意力",
    "hist": "上下文",
    "steps": "去噪",
    "sup": "监督",
    "obj": "目标"
  },
  "specs": {
    "s1": {
      "attn": "全注意力（双向）",
      "hist": "整段联合",
      "steps": "多步",
      "sup": "数据 · 逐条件丢弃",
      "obj": "Rectified Flow 流匹配"
    },
    "s2": {
      "attn": "块因果（块内双向）",
      "hist": "干净的真值块",
      "steps": "多步",
      "sup": "数据 · 仅加噪分支",
      "obj": "流匹配"
    },
    "s3": {
      "attn": "块因果",
      "hist": "干净的真值块",
      "steps": "少步",
      "sup": "冻结 TF 教师 · 一步 CFG Euler",
      "obj": "与 EMA 的一致性损失（停止梯度）"
    },
    "s4": {
      "attn": "块因果 + KV 缓存",
      "hist": "自生成的块",
      "steps": "少步",
      "sup": "双向 real-score 教师 + fake score",
      "obj": "DMD + 捷径梯度回放"
    },
    "s5": {
      "attn": "块因果 + KV 缓存",
      "hist": "自生成，推演更长",
      "steps": "少步",
      "sup": "在更长序列上微调的双向教师",
      "obj": "DMD（+ 辅助 GAN 分支）"
    },
    "s6": {
      "attn": "块因果 + 干净 KV 库",
      "hist": "冻结的候选轨迹",
      "steps": "4 步",
      "sup": "HPSv3 + IDM 奖励",
      "obj": "DiffusionNFT + 参考正则"
    }
  },
  "beats": {
    "s1": [
      "所有块在全注意力下联合去噪",
      "阶段 1：逐条件高丢弃率；条件全被丢弃时部分 latent 保持干净",
      "阶段 2：降低丢弃率以增强条件遵循"
    ],
    "s2": [
      "加噪块 i 作为查询",
      "它关注更早的干净真值块与自身",
      "后续块被屏蔽——不泄露未来信息"
    ],
    "s3": [
      "冻结的 Teacher Forcing 教师执行一步 CFG Euler",
      "学生与其 EMA 分别预测干净终点",
      "一致性损失把两个终点拉到一起 → 少步生成"
    ],
    "s4": [
      "在自生成历史上推演，每块写入 KV 缓存",
      "Self Forcing：DMD 监督每一块，但分离的缓存切断了梯度",
      "CSF：捷径梯度回放把后续块与早期块重新连接"
    ],
    "s5": [
      "原始推演长度与 real-score 教师窗口",
      "在更长序列上微调的教师替换原 real-score 教师",
      "CSF 继续训练，学生推演更长"
    ],
    "s6": [
      "冻结的 Old 策略从共享前缀分出 K 条候选",
      "HPSv3 逐视角 × latent 打分；IDM 逐 latent 评估运动",
      "优势分别归一化、裁剪、混合 → NFT 更新"
    ]
  },
  "s1": {
    "attn": "全注意力：每个块关注所有其他块",
    "conds": "条件丢弃",
    "stage1": "阶段 1 · 高丢弃率",
    "stage2": "阶段 2 · 低丢弃率",
    "inpaint": "条件全部丢弃 → 时间维 latent 补全"
  },
  "s2": {
    "gt": "干净的真值块（历史）",
    "noisy": "加噪块（受监督）",
    "rule": "加噪块 i 关注干净块 j < i 以及自身",
    "loss": "只在加噪分支上计算损失；一次前向并行训练所有块",
    "mask": "注意力掩码",
    "colGT": "干净真值",
    "colNz": "加噪"
  },
  "s3": {
    "keep": "保留 Teacher Forcing 的输入结构",
    "ode": "教师去噪路径（许多小步）",
    "euler": "一步 CFG Euler",
    "student": "学生 G_θ(x_τ) → x̂₀",
    "ema": "EMA G_θ̄(x_τ′) → x̂₀′",
    "match": "L_CD：对齐终点（EMA 停止梯度）",
    "teacher": "冻结的 TF 教师",
    "loss": "x_τ′ = x_τ + (σ_τ′ − σ_τ) v_CFG",
    "few": "→ 少步因果生成器"
  },
  "s4": {
    "real": "real score：冻结的双向教师",
    "fake": "fake score：可训练",
    "kvnote": "与生成器共享参数的 KV 写入过程存储每一块",
    "rollout": "基于自生成历史的自回归推演",
    "sf": "Self Forcing：分离的 KV 缓存阻断块间梯度",
    "csf": "Connected Self Forcing：捷径梯度回放"
  },
  "s5": {
    "oldT": "原 real-score 教师窗口",
    "newT": "加长的双向教师（在更长序列上微调）",
    "keep": "因果架构、少步去噪、DMD 与捷径回放保持不变",
    "gan": "DMD + 辅助 GAN 分支（报告 §1）",
    "rollout": "学生推演"
  },
  "s6": {
    "old": "Old 策略",
    "frozen": "冻结",
    "prefix": "共享干净前缀 P",
    "grid": "HPSv3：逐相机 × latent · IDM：逐 latent，广播到所有视角",
    "adv": "混合优势",
    "cur": "当前策略",
    "k": "K 条候选轨迹（K 为示意）"
  }
},

  landing: {
    eyebrow: "XPeng GWM 团队",
    tagline: "用世界模型构建可控虚拟城市",
    explore: "探索这个世界",
    scene: "点云 → 3DGS → 生成画面",
    scroll: "下滑，展开世界",
    worldTitle: "七路视角，同一个世界。",
    worldLede: "七路相机同步生成，连贯呈现同一驾驶场景。",
    synchronized: "7 路视角 · 同步播放",
    mainView: "主视角",
    viewLabel: "生成视角 {n}",
    play: "播放视频",
    pause: "暂停视频",
    loadError: "视频暂时无法加载，当前显示场景封面。",
  },

  hero: {
    eyebrow: '多相机驾驶世界模型 · 技术报告',
    subtitle: 'Virtual City 生成——真实场景锚定 × 可控世界演化。',
    lede:
      'X-World 1.6 生成七路同步相机视角的驾驶世界：通过行车视频、参考图像或三维场景表示，将生成锚定在真实地点；可指定自车运动、交通参与者、车道、道路标记、红绿灯与天气；并经后训练成为因果、少步数的生成器，支持更长的连续推演。',
    ctaReport: '技术报告',
    ctaDemos: '浏览演示',
    stat1: '7',
    stat1Label: '路同步相机视角',
    stat2: '4',
    stat2Label: '条场景锚定路线',
    stat3: '6',
    stat3Label: '个训练阶段',
    videoTag: '单目行车视频 → 7 视角',
    notice: '本页所有视频均为用于确定布局的参考素材，最终精选结果将替换它们。',
    dev1Title: '控制与一致性',
    dev1Body: '新增道路标记、红绿灯控制，增强跨视角几何一致性。',
    dev2Title: '多种场景条件',
    dev2Body: '以参考图像、3DGS 和点云提供场景依据，锚定真实地点。',
    dev3Title: '长时序生成与 Diffusion-RL',
    dev3Body: '因果少步生成支持更长的连续推演，Diffusion-RL 提升对驾驶条件的遵循能力。',
  },

  overview: {
    eyebrow: '概览',
    title: 'X-World 1.6 的三项技术提升',
    lede: '在 X-World 1.0 的基础上，增强可控生成与持续交互能力。',
    mapTitle: '页面导览',
    appsTitle: '下游应用',
    dashcamTitle: 'DashCam 数据生产',
    dashcamBody: '将互联网视频扩展为七视角数据，用于 VLA 2.0 训练。',
    closedLoopTitle: '闭环仿真与训练',
    closedLoopBody: '提供可交互环境，用于驾驶策略的评估与优化。',
  },

  foundation: {
    eyebrow: '技术基础',
    title: '模型、数据与评测',
    lede: '共享模型架构、精选驾驶数据与 VLM 辅助人工评测，共同支撑 X-World 的持续迭代。',
  },
  posttraining: {
    eyebrow: '技术进展',
    title: '长时序生成与 Diffusion-RL',
    lede: '通过因果少步生成、长时序训练与 Diffusion-RL，提升持续生成的连贯性与动作遵循能力。',
  },
  applicationChapter: {
    eyebrow: '下游应用',
    title: '应用',
    lede: 'X-World 1.6 通过两类应用服务 VLA 2.0：以 DashCam 生产训练数据，以交互环境支持闭环仿真与闭环 RL 训练。',
  },

  closedLoop: {
    eyebrow: '应用 · 交互环境',
    title: '闭环仿真与策略训练',
    lede: '将记录中的真实地点转化为可交互驾驶环境，用于 VLA 2.0 的评估与优化。',
  },

  control: {
    eyebrow: '技术进展',
    title: '控制与一致性',
    lede:
      '指定车道、道路标记与红绿灯条件，生成对应的七路驾驶视频。',
    inputLabel: '控制什么',
    outputLabel: '生成结果',
    placeholderNote: '三个标签共用同一段参考视频，暂不代表各控制类型的独立对照结果。',
    tab: {
      lane: '车道',
      road_marker: '道路标记',
      traffic_light: '红绿灯',
    },
    tabSub: {
      lane: '车道线与道路几何 · L',
      road_marker: '路面标记 · M',
      traffic_light: '信号灯状态 · F',
    },
    types: {
      lane: {
        title: '车道线与道路几何控制',
        input: '指定车道线与道路边界的类型和位置。',
        output: '七个视角呈现一致、符合条件的道路布局。',
      },
      road_marker: {
        title: '道路标记控制',
        input: '指定人行横道、导向箭头和停止线等标记的类别与位置。',
        output: '标记在正确位置出现，并随相机运动保持一致。',
      },
      traffic_light: {
        title: '红绿灯控制',
        input: '指定信号灯的位置、颜色与切换时刻。',
        output: '各视角中的灯色与给定时序同步。',
      },
    },
  },

  pointcloud: {
    viewer: '点云条件生成 · 同步场景查看器',
    generated: '生成 RGB', condition: '点云条件', display: '相机显示模式',
    compareDrag: '拖动 CAM2 同步对比七视角：左侧生成视频，右侧对应点云渲染',
    compareValue: '左侧生成 RGB 占 {value}%，右侧为点云',
    cam2Condition: '点云条件 / CAM2', generatedBadge: '生成结果',
    previousScene: '上一个场景', nextScene: '下一个场景',
    videoError: '视频无法加载，请切换案例或刷新页面。',
    chooseScene: '选择场景…', pointSize: 'LiDAR 点大小',
    sceneG150: '城镇路口', sceneG387: '城市左转', sceneG293: '夜间左弯',
    cam0: '前窄视角', cam2: '前鱼眼', cam3: '左前', cam4: '右前', cam5: '左后', cam6: '右后', cam7: '后视角',
    enlarge: '放大{view}', lidarLabel: '交互式场景点云。拖动旋转，滚轮缩放，按 R 复位。',
    resetLidar: '复位 LiDAR 方向', enlargeLidar: '放大 LiDAR', rotate: '拖动旋转',
    orbitHelp: '拖动旋转 · 滚轮缩放 · R 复位', loadingCloud: '正在加载点云…',
    play: '播放同步场景', pause: '暂停同步场景', restart: '重播场景', timeline: '场景时间轴',
    enterFull: '进入全屏', exitFull: '退出全屏', previous: '上一帧', next: '下一帧', loop: '循环', speed: '播放速度',
    details: '放大的传感器视图', close: '关闭放大视图', playPause: '播放 / 暂停', download: '下载视频 ↗',
    hint: '点击相机或 LiDAR 放大，拖动 LiDAR 旋转视角。', keys: '自动同步循环播放',
    fullCamera: '完整相机画幅 · 与场景同步。', lidarTitle: 'LiDAR · 场景点云', enlargedCloud: '放大的交互式点云',
    preview: '预览 · 最终结果待更新', loading: '正在加载同步场景…', switching: '正在切换同步视角…',
    generatedState: '点云条件生成', conditionState: '渲染的点云条件', loadedCameras: '已加载 {count} / 7 路相机视频',
    dataError: '点云数据无效', dataLoadError: '点云文件加载失败', manifestError: '场景清单不可用。',
    previewNote: '当前为预览结果，后续将替换为最终视频。LiDAR 与渲染的点云条件使用同一场景和时间窗口。',
    finalNote: 'LiDAR 沿选定轨迹展示输入的静态场景点云。',
  },

  frosted: { dashcam: '单目行车视频转多视角：同步视频', r2v: '参考图像生成七视角：同步视频', loading: '正在载入演示…' },

  grounding: {
    eyebrow: '技术进展',
    title: '多种场景条件下的锚定生成',
    lede:
      '道路、建筑等静态结构提供稳定的场景依据，相机运动与交通仍可继续演化。下面展示三种不同的场景锚定方式。',
    gallery: {
      reference_images: {
        summary: '同一地点在其他时刻、其他视角拍摄的参考图像提供场景细节，运动与交通仍遵循指定条件。',
        footnote: '参考图像补充初始视野之外的地点细节，同时允许交通、光照与自车运动随条件变化。',
      },
      '3dgs': {
        summary: '以 3D Gaussian Splatting 重建锚定静态场景，由模型生成运动与交通。三组示例均展示七路同步相机视角。',
        footnote: '重建场景提供连续的空间依据，使道路、建筑与护栏在运动和交通变化中保持一致。',
      },
      point_cloud: {
        summary: '一份静态点云锚定七路同步驾驶视角，逐视角对照生成视频与对应的点云渲染。',
        footnote: '像素对齐的颜色与深度条件，为七路视角提供一致的场景几何依据。',
      },
    },
    gsPosition: '示例 {current} / {total}',
    gsCompare: '拖动对比 3DGS 与 Diffusion',
    gsCameras: { cam0: '前窄视角', cam2: '前鱼眼', cam3: '左前', cam4: '右前', cam5: '左后', cam6: '右后', cam7: '后视角' },
    gsSplitValue: '3DGS {gs}%，Diffusion {diffusion}%',
    carouselLabel: '场景锚定生成视频',
    showVideo: '查看{title}',
    position: '第 {current} / {total} 个视频：{title}',
    previous: '上一个',
    next: '下一个',
    staticTitle: '这里的“静态”指什么',
    staticBody:
      '绝对静态保留道路、建筑、护栏与基础设施，并非固定相机、冻结交通或复制视频。',
    modelNote: '各标签对应不同的条件模型，并非同一个统一模型。',
    tab: {
      reference_images: '参考图像条件',
      '3dgs': '3DGS 条件',
      point_cloud: '点云条件生成',
    },
    tabSub: {
      reference_images: '其他时刻的图像',
      '3dgs': '绝对静态场景',
    },
    types: {
      reference_images: {
        title: '参考增强生成（R2V）',
        input: '同一地点在其他时刻或由其他相机拍摄的参考图像（各附相机标定与位姿），以及控制条件 <span class="math-var">C</span> 与目标相机 <span class="math-symbol">Π</span>。',
        output: '遵循指定轨迹与交通条件、同时复用参考图像中地点细节的七视角视频。',
        relation:
          '参考图像按几何而非时间关联。GeoPE 将参考图像的观测射线与目标射线放在同一场景坐标系中，参考相关的注意力不使用时间旋转编码。因此参考图像描述的是“地点长什么样”，而不是“哪一帧必须出现它”，也不决定自车如何运动。',
        observe: [
          '参考图中的立面、标牌与路面标记，在自车到达该区域时是否依然可辨认。',
          '参考图中的车辆和拍摄时的光照，可以随控制条件改变。',
          '首个视角中缺失、但参考图中存在的细节，是否在各相机中一致出现。',
        ],
        caution: '取自序列中段的参考图并不是对输出中间帧的硬性约束。',
        basis: '参考 token 构成一个共享状态，与七个目标视角进行双向注意力交互（报告 §3.2.2）。',
      },
      '3dgs': {
        title: '3DGS 条件生成',
        input:
          '绝对静态场景的 3D Gaussian Splatting 重建（只保留持久结构，去除车辆与行人），沿参考轨迹渲染；再加上 X-World 动作条件，以及渲染与动作之间的逐帧位姿差。',
        output: '遵循动作条件、同时保持重建出的建筑、路面与护栏的七路同步视频；交通参与者由生成器合成。',
        relation:
          '渲染在生成之前就把静态场景放到目标视点，使条件与输出在空间上对齐。位姿差编码（同时进入 camPE 与 GeoPE）告诉模型渲染视点与所需运动之间的关系，使模型不会简单复制渲染结果。',
        observe: [
          '背景建筑、护栏与路面在推演中是否保持与原场景一致，而不是逐渐漂移。',
          '静态结构被生成的交通参与者遮挡与重新显露时是否正确。',
          '对照下方报告 Figure 6：没有 3DGS 条件时，场景特有细节会发生漂移。',
        ],
        recon:
          '静态重建采用两种策略之一：动态节点建模（OmniRe，配合基于 SAM3 的分割与跟踪），或在损失中屏蔽动态像素的 mask-out 重建。扩散训练使用约一百万组沿替代轨迹渲染的片段对。',
        basis: '报告 §3.3.1、Figure 6。',
      },
    },
    pcTitle: '点云条件',
    pcBody:
      '第四条路线：在每个时刻把绝对静态点云渲染为七个目标视角的 RGB 与深度图，并按像素位置通过通道拼接注入。深度为零表示“此处没有点云依据”，而不是“此处为空”。',
    pcStatus: '报告中已描述 · 暂无演示视频',
    fig6Title: '报告 Figure 6——有无绝对静态场景条件的对比',
  },

  dashcam: {
    eyebrow: '应用 · 数据生产',
    title: 'DashCam：为 VLA 2.0 生产训练数据',
    lede:
      '从互联网采集单目行车视频，经 X-World 扩展为七路同步视频，用于下游 VLA 2.0 模型训练。',
    input: '完整的行车视频序列：经视频 VAE 编码后，作为一路不加噪的附加视角流输入，并附带自身的 GeoPE 与相机条件。',
    output: '沿原始轨迹的七路目标视角；行车视频流在预测头之前被移除。',
    relation:
      '静态结构、交通参与者、信号灯状态与环境外观都跟随源视频。独立的自车动作注入被关闭，因为完整的行车视频已经提供了运动信息。',
    observe: [
      '跨视角：离开前视野的车辆，应在侧、后视角中以相同身份再次出现。',
      '时间：生成视角中的事件与源视频在时间上同步。',
      '覆盖：行车视频从未拍到的区域，被合理补全且在各相机之间一致。',
    ],
    training:
      '训练数据来自同步多相机记录：对前视相机做行车记录仪风格的增强（构图、尺度、宽高比、画质、残余畸变），原始七视角作为预测目标。',
    distinction: '与 R2V、3DGS 条件不同，Dashcam 生成不接受独立编辑的场景控制——它补全的是原始记录中的场景。',
    trainingTitle: '训练数据对',
    distinctionTitle: '不是可编辑的场景',
  },

  long: {
    iframeTitle: 'Self Forcing 与 Connected Self Forcing 交互对比',
    loading: '正在载入对比…',
    eyebrow: '长视频生成',
    title: '长时序生成',
    lede:
      '对比 Self Forcing 与 Connected Self Forcing，查看驾驶场景随时间延展的生成效果。',
    summary: 'Connected Self Forcing 改善长时序推演中的场景连贯性与画面稳定性。',
    durationNote:
      '片段时长 {d} 秒 · {f} 帧 · 播放帧率 {fps} fps。这是当前参考视频的长度，并非模型的最长推演能力；播放帧率也不代表推理速度。',
    sharedNote: '占位：当前与“受控生成”使用同一段视频。',
    noLoop: '静音自动循环播放。',
    inspect: '检查时刻',
    jumpTo: '跳转至 {t} 秒',
    observe: [
      '场景保持：早先出现的建筑与道路布局，再次出现或在其他相机中出现时保持一致。',
      '时间连续：块与块衔接处没有跳变、闪烁或身份交换。',
      '稳定性：越到推演后段，清晰度与色彩不出现明显退化。',
    ],
    momentLabels: ['开始', '25%', '50%', '75%', '结束'],
  },

  rl: {
    eyebrow: 'RL',
    title: 'Diffusion-RL',
    lede:
      '通过强化学习优化 X-World 自身，提升生成画面质量与自车运动对给定条件的遵循。',
    interactionHint: '左侧 GT、Base、RL 以同步帧叠层展开，右侧点云结果展示同一时刻的对比。',
    summary: '联合优化运动一致性与画面质量；这些示例用于定性对比。',
    comparedTitle: '对比对象',
    compared: 'Base（第 0 次迭代，RL 之前）与 iter150（第 150 次迭代的 RL checkpoint），在同一片段、同一随机种子下生成。',
    trajTitle: '轨迹含义',
    traj:
      'GT 为真值参考；Base 与 iter150 分别对应两段生成视频。每条轨迹都是由已有 IDM 动作缓存、从车辆原点在 BEV 中连续积分得到的，并非新计算的评分。',
    scope:
      '为定性说明而选取的样本，不代表全量 RL 评估结论。',
    frameTitle: '交互对比',
    open: '独立打开',
    loading: '正在加载对比组件…',
    error: '对比组件无法在此加载。',
    iframeTitle: 'Diffusion-RL：GT、Base、RL 与点云结果同步对比',
    distinctTitle: '与闭环策略 RL 不同',
    distinct: '本节优化的是世界模型本身。把 X-World 作为环境、在闭环中训练驾驶策略，是另一项应用。',
  },

  method: {
    eyebrow: '模型结构',
    title: '模型结构',
    lede:
      '场景依据与驾驶条件在多视角 DiT 中融合，联合生成七路同步视频。',
    figure: {
      alt: '图 3：整体网络结构、包含驾驶条件分支的 DiT 模块，以及七视角共享的场景—视频自注意力。',
      viewFull: '查看大图',
    },
    archTitle: '模型结构',
    archLede:
      '场景锚定与可控演化在 X-World 多视角 DiT 中结合：场景依据经四条路线之一进入，控制条件经各自的分支进入，骨干网络通过跨视角与时间交互联合合成七个视角。',
    colScene: '场景依据 S',
    colSceneSub: '在哪里 · 每个模型一条路线',
    colBackbone: 'X-World 多视角 DiT',
    colBackboneSub: '每种条件模式训练一个模型实例',
    colControl: '场景控制 C',
    colControlSub: '发生什么',
    colOut: '输出',
    out7: '7 路同步视角',
    outSub: '联合去噪 · T 帧 × 7 相机',
    g2d: '二维观测',
    g3d: '三维表示',
    rDashcam: '行车视频',
    rDashcamHow: '不加噪的附加视角流 · GeoPE',
    rDashcamFix: '决定“在哪里”和“发生什么”',
    rR2V: '参考图像（R2V）',
    rR2VHow: '共享参考状态 · GeoPE',
    rR2VFix: '决定“在哪里”',
    r3DGS: '3DGS 渲染',
    r3DGSHow: '渲染的参考视频 · 位姿差（camPE + GeoPE）',
    r3DGSFix: '几何 + 外观',
    rPC: '点云',
    rPCHow: 'RGB + 深度渲染 · 像素级通道拼接',
    rPCFix: '仅几何',
    bSelf: '逐视角时空自注意力',
    bText: '逐视角文本交叉注意力',
    bTFL: '红绿灯分支（掩码）',
    bCross: '跨视角注意力',
    bStruct: '结构化交叉注意力（O · M · L，掩码）',
    bFFN: '前馈层',
    bAdaLN: 'AdaLN-Zero 调制 ← 动作 A',
    bInit: '初始化 · Wan2.2-TI2V-5B',
    bIn: '所选路线提供的场景 token / latent',
    bRepeat: '× N 个 DiT 块',
    cA: '自车运动 A',
    cAHow: '速度 · 曲率 · roll · pitch → AdaLN-Zero',
    cOML: '交通参与者 O · 标记 M · 车道 L',
    cOMLHow: '各自编码器 → 共享掩码交叉注意力',
    cF: '红绿灯 F',
    cFHow: '逐帧状态 token + 投影掩码',
    cE: '环境文本 E',
    cEHow: '天气 · 时段 → 逐视角文本分支',
    archNote:
      '参考图像与输出帧来自同一个 R2V 案例；动画示意生成过程，页面不运行模型。不同条件模式分别训练独立模型。',
    trainTitle: '训练流程',
    trainLede: '双向预训练之后是自回归后训练。每个阶段解决上一阶段模型的一个问题；选择一个阶段查看详情。',
    pre: '预训练',
    post: '后训练',
    lProblem: '解决的问题',
    lChange: '关键变化',
    lResult: '产出',
    lShown: '对应演示',
    trainNote: '依据报告 Figure 8 与第 5.1–5.6 节重绘。',
    viz: {
      full: '全注意力',
      dropout: '丢弃率 · 阶段 1 → 2',
      mask: '块因果掩码',
      cleanGT: '干净真值',
      noisy: '加噪',
      oneStep: '一步 CFG Euler',
      teacher: '冻结的 TF 教师',
      student: '学生 Gθ',
      ema: 'EMA 学生',
      match: '对齐干净终点',
      chunk: '随时间推进的块',
      kv: 'KV 写入',
      dmd: '逐块 DMD 梯度',
      replay: '捷径梯度回放',
      shortWin: '原教师窗口',
      longWin: '加长的教师窗口',
      rollouts: 'K 条候选推演',
      reward: 'HPSv3 + IDM 奖励',
      adv: '归一化 · 裁剪 · 混合',
      update: '更新当前策略',
    },
    stages: {
      s1: {
        name: '双向预训练',
        short: '全注意力 · 流匹配',
        problem: '在多种可选条件下学习七视角驾驶视频生成。',
        change:
          '从 Wan2.2-TI2V-5B 初始化；全时间注意力、Rectified Flow 目标。第一阶段对各条件使用高丢弃率（所有条件都缺失时加入时间维 latent 补全）；第二阶段降低丢弃率以增强条件遵循。VAE 与文本编码器保持冻结。',
        result: '双向 checkpoint：作为因果训练的初始化，并作为 DMD 的 real-score 教师。',
        shown: '基础可控性',
      },
      s2: {
        name: 'Teacher Forcing 适配',
        short: '块因果 · 真值历史',
        problem: '双向模型无法基于历史进行因果生成。',
        change:
          '全注意力替换为块因果掩码（块内保持双向）。干净的真值块与加噪块拼接，每个加噪块只能看到更早的干净块和它自己。',
        result: '能根据历史预测下一块的因果模型。',
        shown: '因果推演',
      },
      s3: {
        name: '因果一致性蒸馏',
        short: '少步数去噪',
        problem: '去噪步数过多，难以交互式推演。',
        change: '冻结的 Teacher Forcing 教师执行一步带 CFG 的 Euler 去噪，得到相邻噪声水平的状态；学生预测的干净终点与其 EMA 从该状态预测的终点对齐。',
        result: '少步数因果生成器，作为 Connected Self Forcing 的初始化。',
        shown: '因果推演',
      },
      s4: {
        name: 'Connected Self Forcing',
        short: '自生成历史 · DMD',
        problem: '训练与推理不一致：推理时模型以自身输出为条件，而 Self Forcing 分离 KV 缓存，切断了块间梯度。',
        change:
          '在自生成历史上推演，由 DMD 监督（冻结的双向 real-score 教师 + 可训练的 fake-score 模型）。Shortcut Gradient Replay 把后续块的梯度重新连回早期块：g<sub>DMD</sub> + g<sub>cross</sub>。仅用于训练，推理流程不变。',
        result: '上下文同时针对自身质量及其对后续预测的有用性进行优化。',
        shown: '长时序生成',
      },
      s5: {
        name: '长时序调优',
        short: '更长的教师与推演',
        problem: '更长推演中的场景演化不合理与视觉幻觉。',
        change:
          '先在更长的七视角序列上微调双向教师，并替换原 real-score 教师；随后继续 CSF，加长学生推演与监督窗口。报告还在 DMD 之外引入辅助 GAN 分支以提升画质。',
        result: '在更长推演中保持质量，因果架构与推理流程不变。',
        shown: '长时序生成',
      },
      s6: {
        name: 'RL 后训练',
        short: 'DiffusionNFT · HPSv3 + IDM',
        problem: '使画质与运动一致性对齐偏好。',
        change:
          '在四步因果模型上使用 DiffusionNFT；Causal Multi-Block NFT 配合块因果干净 KV 库；HPSv3 与 IDM 奖励分别归一化、裁剪后混合为一个优势；参考模型正则。',
        result: '对齐偏好的因果生成器。',
        shown: 'RL',
      },
    },
  },

  data: {
    eyebrow: '数据',
    title: '数据构建',
    lede: '更多真实数据、剔除采集缺陷并向困难机动重新平衡。',
    s1Value: '4×',
    s1Label: '候选数据池规模（相对 X-World 1.0）',
    s2Value: '2×',
    s2Label: '选入训练集的数据量（相对 X-World 1.0）',
    s3Value: '150+',
    s3Label: '个场景标签（质量、细粒度行为、长尾场景）',
    s4Value: '≈1M',
    s4Label: '组用于 3DGS 条件训练的渲染片段对',
    pipeTitle: '数据筛选流程',
    pipeHint: '从真实驾驶记录到入选训练数据。',
    pipeCaption:
      '灰色流表示被剔除或未入选的数据；流宽仅为示意，并非实际数量。',
    reportLink: '在报告中查看数据方法',
    pipeAria: '数据管线桑基图：原始数据、数据清洗、行为打标、SFT 选择',
    kind: { pool: '数据池', tag: '行为标签', sft: '入选 SFT', drop: '剔除 / 未入选' },
    swipe: '左右滑动查看完整图示 →',
    pRaw: '原始驾驶数据池',
    pClean: '数据清洗',
    pTag: '行为打标',
    pSft: 'SFT 选择',
    pRawSub: '扩充后的候选记录',
    pCleanSub: '剔除采集缺陷',
    pTagSub: '150+ 标签，准确率提升',
    pSftSub: '运动学 + 行为挖掘',
    evalTitle: '评估体系',
    e1Title: '人工评估',
    e1: '对七个视角做基于异常的审查，按图像区域与时间定位，覆盖视觉保真、场景一致性、动态合理性与条件遵循；按相机优先级、目标大小与驾驶相关性加权。',
    e2Title: 'VLM 评估器',
    e2: '基于 Qwen3-VL-8B-Instruct，先在单帧、再在视频片段上微调，并用 GRPO 优化，以与人工标注相同的格式定位异常，作为人工复核前的初筛。',
    e2Stat: '在 150 个生成视频上：标注耗时由 2 天降至 1 天（−50%）；70% 的预标注相机视角无需修改即被接受。',
    e3Title: '基于 IDM 的动作评估',
    e3: '逆动力学模型从生成视频中反推自车运动，用于衡量动作遵循程度。',
    e3Status: '报告该节撰写中',
    e4Title: '时间与跨视角一致性',
    e4: '无需真值参考的生成视频诊断：目标跟踪（SAM 3 + ByteTrack + FG-CLIP 2——外观一致性、衰减率、射线残差）、压缩（H.264 帧间与全帧内编码的增益）、重建（UniSplat 重渲染——SSIM、PSNR、MAE）。',
    tableSummary: '初步 checkpoint 诊断（报告 Table 1）',
    tableNote: '报告注明该表的分析尚待完成。此处按原值展示、不做排名；“–”表示未报告。SF = Self Forcing，CSF = Connected Self Forcing。',
    tStage: '阶段 / 变体',
    tTracking: '跟踪',
    tCompression: '压缩',
    tRecon: '重建',
  },

  apps: {
    eyebrow: '应用',
    title: '应用',
    lede: '这些能力的预期用途。状态标签依据报告，区分已描述的流程与规划中的工作。',
    planned: '规划中',
    inProgress: '进行中',
    described: '流程已描述',
    vcTitle: 'Virtual City 平台',
    vcBody:
      '规划中的平台：把真实路口或路段的依据——现场照片、位置匹配的图像、重建结果或点云——整理为可复用的地点资产。开发者配置场景族（例如对向来车、天气或信号配时不同的左转场景），预览七路视角，再细化并连同完整配置保存每个案例。',
    vcObj1: '地点资产',
    vcObj1Sub: '观测 · 几何 · 相机',
    vcObj2: '场景配置',
    vcObj2Sub: '自车任务 · 交通 · 信号 · 天气',
    vcObj3: '生成案例',
    vcObj3Sub: '7 视角 + 资产版本 + 生成设置',
    clTitle: '闭环仿真',
    clStatus: '失败终止机制尚未启用',
    clBody:
      '策略模型预测的轨迹作为 X-World 的条件，生成的七路视角再回馈给策略模型。实采数据只在触发时刻（事件前数秒）进入循环，之后完全由生成观测驱动。固定随机种子与条件时推演可复现，因此不同策略可以在完全相同的仿真场景中比较。',
    clSpec: '案例：7 相机、12 Hz、时长至少 30 秒；触发点例如设在事件前 5 秒。',
    openLoop: '开环',
    openLoopBody: '每一步都与实采回放比较打分；预测无法改变下一步的观测。',
    closedLoop: '闭环',
    closedLoopBody: '预测会移动仿真中的自车；X-World 生成它接下来应看到的画面。',
    nRecorded: '实采数据',
    nRecordedSub: '仅在触发时刻进入',
    nPolicy: '策略模型',
    nPolicySub: '7 视角 → 自车轨迹',
    nWorld: 'X-World',
    nWorldSub: '动作 + 条件 → 下一步 7 视角',
    nEval: '评估',
    nEvalSub: '逐步记录轨迹与行为',
    aAction: '轨迹作为动作',
    aViews: '生成的视角',
    oReplay: '实采回放',
    oReplaySub: '逐帧 t = 0, 1, 2, …',
    oPred: '预测',
    oPredSub: '仅对当前步打分',
    noFeedback: '预测不会反馈到下一步观测',
    steps: ['在触发时刻初始化', '生成下一步七路视角', '预测新的轨迹', '记录该步用于评估', '迭代直至时长结束或触发终止'],
    rlTitle: '面向驾驶策略的闭环 RL',
    rlBody: '同一推演机制计划作为驾驶策略闭环强化学习的环境。这与上文世界模型自身的 RL 后训练不同；报告中该部分仍在撰写。',
    prior: '背景：X-World 1.0 已在 VLA 开发流程中支持闭环评估、在线 RL 与合成数据生成（报告 §1）。',
  },

  resources: {
    eyebrow: '资源',
    title: '资源',
    reportTitle: '技术报告',
    reportMeta: 'arXiv:2611.00596',
    draft: '草稿',
    reportNote: '技术报告 · 已在 arXiv 公开。',
    related: '报告引用的相关工作',
    code: '代码',
    models: '模型',
    arxiv: 'arXiv',
    video: '视频',
    cite: '引用',
    copy: '复制',
    copied: '已复制',
    moreSoon: '代码、模型与引用信息将在发布后列于此处。',
  },

  footer: {
    line1: 'X-World 由 XPeng GWM 团队开发 · 研究项目主页',
    top: '回到顶部',
  },
};
