'use strict';
const SF_DICTS = {
  en: {
    title: 'Self Forcing / Connected Self Forcing — X-World 1.6',
    comparison: 'Synchronized SF and CSF comparison', play: 'Play comparison', pause: 'Pause comparison', restart: 'Restart comparison',
    seek: 'Seek comparison', seekValue: '{time} of {duration}', cases: 'Choose comparison case', previous: 'Previous case', next: 'Next case',
    first: 'First comparison', second: 'Second comparison', third: 'Third comparison', appearance: 'Page appearance', day: 'Day', night: 'Night',
    main: '{method} full scene', reference: '{method} initial detail', current: '{method} later detail',
    loading: 'Loading comparison…', playbackError: 'Playback is temporarily unavailable. Choose a case to retry.',
  },
  zh: {
    title: 'Self Forcing / Connected Self Forcing 对比 — X-World 1.6',
    comparison: 'SF 与 CSF 同步对比', play: '播放对比', pause: '暂停对比', restart: '重新播放对比',
    seek: '拖动对比进度', seekValue: '已播放 {time}，共 {duration}', cases: '选择对比案例', previous: '上一个案例', next: '下一个案例',
    first: '第一个对比案例', second: '第二个对比案例', third: '第三个对比案例', appearance: '页面外观', day: '日间', night: '夜间',
    main: '{method} 完整场景', reference: '{method} 早期细节', current: '{method} 后期细节',
    loading: '正在载入对比…', playbackError: '暂时无法播放，请切换案例重试。',
  },
};
let sfLang = new URLSearchParams(location.search).get('lang') === 'zh' ? 'zh' : 'en';
const sfLabel = (key, values = {}) => (SF_DICTS[sfLang][key] || key).replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');
