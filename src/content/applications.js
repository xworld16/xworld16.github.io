/** Application results from report §7.2–7.3 / Table 3, PDF page 19. */
export const applications = {
  uses: [
    {
      title: { en: 'Closed-Loop Simulation', zh: '闭环仿真' },
      description: {
        en: 'Evaluate a fixed policy in recorded scenes to reproduce target behaviors, diagnose failures and run regression tests.',
        zh: '在记录的场景中评估固定策略，复现目标行为，支持问题诊断与回归测试。',
      },
    },
    {
      title: { en: 'Closed-Loop RL Training', zh: '闭环 RL 训练' },
      description: {
        en: 'Improve the driving policy through interaction feedback. In the research setup described in the report, the world model stays frozen while the policy learns.',
        zh: '利用交互反馈优化驾驶策略。在报告介绍的研究方案中，世界模型保持冻结，更新驾驶策略。',
      },
    },
  ],
  evidenceTitle: { en: 'Environment Fidelity', zh: '仿真环境复现表现' },
  fdeValue: '−20.9%',
  fdeTitle: { en: 'Mean final displacement error', zh: '平均终点位移误差（FDE）' },
  fdeCaption: { en: 'Relative to trajectory predictions from the corresponding real videos.', zh: '以对应实拍视频的轨迹预测为参考。' },
  thresholdTitle: { en: 'Cases within each FDE threshold', zh: '误差低于各阈值的案例' },
  thresholdUnit: { en: 'Cumulative case share · gain in percentage points', zh: '累计达标占比增量（百分点）' },
  thresholds: [
    { threshold: 1, gain: 5.6 },
    { threshold: 2, gain: 9.4 },
    { threshold: 5, gain: 10.6 },
  ],
  behaviorTitle: { en: 'Target-Behavior Reproduction', zh: '目标行为复现' },
  behaviorUnit: { en: 'Paired review · share of all reviewed cases', zh: '配对评审 · 占全部评审案例的比例' },
  outcomes: [
    { value: 19, key: 'improved', label: { en: 'Improved', zh: '改善' } },
    { value: 77.4, key: 'comparable', label: { en: 'Comparable', zh: '相当' } },
    { value: 3.6, key: 'worse', label: { en: 'Worse', zh: '退步' } },
  ],
  evidenceNote: {
    en: 'Matched scenes, policy versions and review criteria. These results measure environment reproduction fidelity, not policy-training gains or an absolute success rate.',
    zh: '比较对齐场景、策略版本与评审标准。以上衡量环境复现表现，不代表策略训练收益或绝对成功率。',
  },
};
