'use strict';
const FROSTED_DICTS = {
  en: {
    dashcam: 'DashCam Video to Multi-View Video', r2w: 'Single Reference Image to Multi-View Video', r2v: 'Arbitrary-View Images to Multi-View Video',
    previous: 'Previous sample', next: 'Next sample', navigation: 'Sample navigation', stage: 'Synchronized seven-view demo',
    strip: 'Reference frames: hover to preview the corresponding video frame', frame: 'Frame', input: 'Input', generated: 'Generated',
    reference: '{origin} reference frame {frame}; preview frame', video: '{kind} sample {sample}: synchronized seven-camera video',
    links: 'Connections from the front fisheye camera to the six surround cameras', play: 'Play demo', pause: 'Pause demo',
    frameError: 'A frame could not be loaded. Reload to try again.', videoError: 'This video could not be loaded. Choose another sample or reload.', noVideos: 'No videos found.',
    cam0: 'Front narrow', cam2: 'Front fisheye', cam3: 'Front left', cam4: 'Front right', cam5: 'Rear left', cam6: 'Rear right', cam7: 'Rear',
  },
  zh: {
    dashcam: '单目行车视频生成多视角视频', r2w: '单张参考图像生成多视角视频', r2v: '任意视角参考图像生成多视角视频',
    previous: '上一个案例', next: '下一个案例', navigation: '案例切换', stage: '七路同步视角演示',
    strip: '参考帧：悬停以预览对应时刻的七路画面', frame: '帧', input: '输入', generated: '生成',
    reference: '{origin}参考帧 {frame}；预览该帧', video: '{kind}，案例 {sample}：七路同步相机视频',
    links: '前鱼眼视角与其他六路环视相机的连线', play: '播放演示', pause: '暂停演示',
    frameError: '有参考帧无法加载，请刷新重试。', videoError: '视频无法加载，请切换案例或刷新。', noVideos: '没有可用视频。',
    cam0: '前窄视角', cam2: '前鱼眼', cam3: '左前', cam4: '右前', cam5: '左后', cam6: '右后', cam7: '后视角',
  },
};
let frostedLang = new URLSearchParams(location.search).get('lang') === 'zh' ? 'zh' : 'en';
const ft = (key, values = {}) => (FROSTED_DICTS[frostedLang][key] || key).replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');
