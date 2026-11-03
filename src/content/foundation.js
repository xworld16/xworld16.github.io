/** Data: technical report §2, §3.3.2 and §6.
 * Evaluator results: the user's 2026-10-30 annotation-efficiency / agreement supplement.
 * Efficiency and agreement use different cohorts; keep their denominators separate.
 */
export const foundationMetrics = {
  data: [
    { key: 'candidate', value: '4×' },
    { key: 'selected', value: '2×' },
    { key: 'tags', value: '150+' },
    { key: 'pairs', value: '≈1M' },
  ],
  annotation: { videos: 150, annotators: 5, beforeDays: 2, afterDays: 1, reductionPercent: 50 },
  agreement: {
    scenes: 30, videos: 60, views: 420, nonTiedScenes: 28, humanTies: 2, majorityBaseline: 60.7,
    models: [
      { key: 'ours', accuracy: 71.4, correct: 20, ci: [53.6, 88.5] },
      { key: 'zeroShot', accuracy: 21.4, ci: [7.4, 37.9] },
    ],
  },
  detection: { views: 420, recall: 86, precision: 87.6, perViewRecall: 71.7, perViewPrecision: 73 },
};

export const foundation = {
  dataTitle: { en: 'Data That Supports Controllable Generation', zh: '支撑可控生成的数据构建' },
  dataLede: {
    en: 'A larger recording pool makes room for stricter quality screening and more interaction-rich training examples.',
    zh: '扩大真实驾驶数据池，在更严格的质量筛选下，保留更多可用片段与交互丰富的驾驶场景。',
  },
  scaleLabels: [
    { en: 'Candidate recording pool vs 1.0', zh: '候选数据池规模，相对 1.0' },
    { en: 'Selected training data vs 1.0', zh: '入选训练数据量，相对 1.0' },
    { en: 'Quality, behavior and corner-case tags', zh: '质量、行为与长尾场景标签' },
    { en: 'Clip pairs for 3DGS conditioning', zh: '用于 3DGS 条件训练的片段对' },
  ],
  dataMethods: [
    {
      title: { en: 'Screen Capture Quality', zh: '筛除采集缺陷' },
      body: {
        en: 'Remove flicker, stripes, lens obstruction and exposure defects. Cross-camera checks and VLM verification help distinguish faulty capture from rain, fog and low light.',
        zh: '筛除闪烁、条纹、镜头遮挡与曝光缺陷，结合跨相机检查和 VLM 复核，区分采集问题与雨雾、弱光等环境条件。',
      },
    },
    {
      title: { en: 'Select Informative Maneuvers', zh: '补充交互与长尾场景' },
      body: {
        en: 'Combine behavior tags with ego kinematics to select turns, merges, high-curvature motion and full stops, increasing their representation beyond routine cruising.',
        zh: '结合行为标签与自车轨迹，定向选择转弯、并线、高曲率运动和刹停片段，提高这些场景在训练数据中的占比。',
      },
    },
    {
      title: { en: 'Pair Scene Evidence with Motion', zh: '构建场景条件训练对' },
      body: {
        en: 'Reconstruct real scenes and render references along alternative trajectories, while keeping the recorded video as the target. Scene appearance informs generation without fixing its motion.',
        zh: '重建真实场景，沿不同轨迹渲染参考视频，并保留原始录制视频作为目标，让场景外观提供依据，而不固定生成运动。',
      },
    },
  ],
  evaluationTitle: { en: 'Evaluation That Informs Model Iteration', zh: '以生成评测支持模型迭代' },
  evaluationLede: {
    en: 'A task-trained VLM proposes localized defects; human verification turns those predictions into consistent evidence for comparing model versions.',
    zh: '由经过专项训练的 VLM 提出缺陷预标注，再经人工核验，形成可用于模型版本比较的一致评测依据。',
  },
  workflow: [
    {
      title: { en: 'VLM Pre-Labeling', zh: 'VLM 预标注' },
      body: { en: 'Predict defect categories, frame ranges and bounding boxes across seven camera views.', zh: '逐相机预测缺陷类别、时间范围与空间位置。' },
    },
    {
      title: { en: 'Human Verification', zh: '人工核验' },
      body: { en: 'Accept, correct or reject predictions, with sampled quality-control reviews.', zh: '接受、修正或拒绝预标注，并通过抽样质检复核。' },
    },
    {
      title: { en: 'Scoring & Iteration', zh: '评分与迭代' },
      body: { en: 'Aggregate defect penalties to compare videos; verified annotations also refine the evaluator.', zh: '汇总缺陷罚分比较视频，校正后的标注也用于迭代评测模型。' },
    },
  ],
  efficiencyTitle: { en: 'Half the Annotation Time', zh: '标注耗时减半' },
  efficiencyCohort: { en: '150 generated videos · the same five annotators', zh: '150 条生成视频 · 同一组 5 名标注人员' },
  efficiencyBefore: { en: 'Annotate from scratch', zh: '从零标注' },
  efficiencyAfter: { en: 'Correct VLM pre-labels', zh: '校正 VLM 预标注' },
  efficiencySaving: { en: 'less total annotation time', zh: '总标注耗时减少' },
  day: { en: 'day', zh: '天' },
  days: { en: 'days', zh: '天' },
  efficiencyNote: { en: 'Human review remains part of the workflow.', zh: '人工核验仍是评测流程的一部分。' },
  agreementTitle: { en: 'Agreement on Which Video Is Better', zh: '与人工偏好的吻合度' },
  agreementCohort: { en: 'Same-scene pairwise accuracy · higher is better', zh: '同场景成对偏好准确率 · 越高越好' },
  evaluatorNames: [
    { en: 'X-World evaluator', zh: 'X-World 评测模型' },
    { en: 'Qwen3-VL-8B-Instruct · zero-shot', zh: 'Qwen3-VL-8B-Instruct · 零样本' },
  ],
  agreementBaseline: { en: 'Always prefer X-World 1.6', zh: '始终选择 X-World 1.6 的基线' },
  agreementInterval: { en: '95% confidence interval', zh: '95% 置信区间' },
  agreementNote: {
    en: '30 paired scenes, 60 videos and 420 views. Accuracy uses the 28 scenes with a human winner; evaluator ties count as errors. Whiskers show scene-bootstrap 95% confidence intervals.',
    zh: '30 个成对场景、60 条视频、420 路视角。准确率统计 28 个有人工胜者的场景；评测模型判平计为错误。误差线为按场景重采样的 95% 置信区间。',
  },
  detectionTitle: { en: 'Detecting Defects That Carry Greater Penalties', zh: '识别影响更大的缺陷' },
  detectionRecall: { en: 'Penalty-weighted recall', zh: '罚分加权召回率' },
  detectionPrecision: { en: 'Penalty-weighted precision', zh: '罚分加权精确率' },
  detectionNote: {
    en: 'Across 420 camera views. Weighting by defect penalties emphasizes more severe failures; per-view recall and precision are 71.7% and 73.0%.',
    zh: '统计 420 路相机视角，以缺陷罚分加权，突出严重失败。逐视角计数的召回率与精确率分别为 71.7% 和 73.0%。',
  },
};
