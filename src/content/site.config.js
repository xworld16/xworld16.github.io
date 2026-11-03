/**
 * Site-level configuration: links, release metadata and display switches.
 * Anything set to null / empty stays hidden on the page — fill it in when the real information exists.
 */
export const site = {
  name: 'X-World 1.6',
  defaultLang: 'en',
  storageKey: 'xworld16.lang',

  // Published technical report.
  report: {
    title: 'X-World 1.6: Building Controllable Virtual Cities with World Models',
    href: 'https://arxiv.org/abs/2611.00596',
    pages: 27,
    isDraft: false,
  },

  // Release metadata — intentionally empty until final. Empty values hide the corresponding UI.
  authors: [], // e.g. [{ name: 'Name', affiliation: 1, url: '' }]
  affiliations: [], // e.g. ['Institution']
  links: {
    code: null, // e.g. 'https://github.com/org/repo'
    models: null, // e.g. 'https://huggingface.co/org/model'
    arxiv: 'https://arxiv.org/abs/2611.00596',
    video: null,
  },
  // arXiv BibTeX, with XPeng retained as a group author and its separator colon omitted.
  bibtex: `@misc{xpeng2026xworld16buildingcontrollable,
      title={X-World 1.6: Building Controllable Virtual Cities with World Models},
      author={{XPeng} and Boyang Wang and Boyi Sun and Chaoda Zheng and Dongbin Zhang and Guangfeng Jiang and Hanlong Chen and Hongbin Lin and Jianlei Zheng and Jinhao Deng and Kai Yang and Kangjie Chen and Linkun Xu and Minqi Wang and Puyi Wang and Rongliang Cheng and Ruixin Liu and Shijia Chen and Shuang Deng and Sijia Chen and Sin Wai Choo and Tianyuan Xie and Xiangyu Li and Xianming Liu and Xingjie Liu and Xinlong Zheng and Xuejie Lv and Xuezhi Yang and Yi Guo and Yixiao Zeng and Yu Zhang and Yuecheng Ma and Yuhao Wang and Yuqi Zhang and Yuxin Peng},
      year={2026},
      eprint={2611.00596},
      archivePrefix={arXiv},
      primaryClass={cs.AI},
      url={https://arxiv.org/abs/2611.00596},
}`,
  releaseDate: null, // e.g. '2026-11-01'

  // Prior work cited in the report (verified reference, shown under Resources).
  related: [
    {
      label: { en: 'X-World 1.0 — previous version', zh: 'X-World 1.0 — 前序版本' },
      href: 'https://arxiv.org/abs/2603.19979',
      meta: 'arXiv:2603.19979',
    },
    {
      label: { en: 'Connected Self Forcing', zh: 'Connected Self Forcing' },
      href: 'https://arxiv.org/abs/2610.12156',
      meta: 'arXiv:2610.12156',
    },
  ],

  flags: {
    // Show the small "Reference clip · to be replaced" badges on every media item marked isReference.
    showReferenceBadges: true,
    // Global notice under the hero that all videos are reference clips.
    showReferenceNotice: true,
    // Report Table 1 (consistency across training stages). The report marks its analysis as pending.
    showPreliminaryTable: true,
  },

  // Hero media id (see media.config.js)
  heroMedia: 'hero',

  // RL comparison component served from public/rl-comparison.
  rl: {
    path: 'rl-comparison/index.html',
  },
};
