window.PXW_EMBED_DICTS={"en":{"viewer":"Point-cloud-conditioned generation · synchronized scene viewer","generated":"Generated RGB","condition":"Point cloud","display":"Camera display","compareDrag":"Drag CAM2 to compare generated video on the left and point-cloud renders on the right across all seven views","compareValue":"{value}% generated RGB; point cloud on the right","cam2Condition":"Point cloud / cam2","generatedBadge":"Generated","previousScene":"Previous scene","nextScene":"Next scene","videoError":"This video could not be loaded. Choose another sample or reload.","chooseScene":"Choose scene…","pointSize":"LiDAR point size","sceneG150":"Town intersection","sceneG387":"Urban left turn","sceneG293":"Night left curve","cam0":"Front narrow","cam2":"Front fisheye","cam3":"Front left","cam4":"Front right","cam5":"Rear left","cam6":"Rear right","cam7":"Rear","enlarge":"Enlarge {view}","lidarLabel":"Interactive scene point cloud. Drag to orbit, scroll to zoom, R to reset.","resetLidar":"Reset LiDAR direction","enlargeLidar":"Enlarge LiDAR","rotate":"Drag to rotate","orbitHelp":"Drag to orbit · scroll to zoom · R to reset","loadingCloud":"Loading point cloud…","play":"Play synchronized scene","pause":"Pause synchronized scene","restart":"Restart scene","timeline":"Scene timeline","enterFull":"Enter fullscreen","exitFull":"Exit fullscreen","previous":"Previous frame","next":"Next frame","loop":"Loop","speed":"Playback speed","details":"Enlarged sensor view","close":"Close enlarged view","playPause":"Play / pause","download":"Download video ↗","hint":"Click a camera or LiDAR to enlarge. Drag LiDAR to orbit.","keys":"Automatic synchronized loop","fullCamera":"Full camera frame · synchronized with the scene.","lidarTitle":"LiDAR · Scene point cloud","enlargedCloud":"Enlarged interactive point cloud","preview":"Preview · final results pending","loading":"Loading synchronized scene…","switching":"Switching synchronized views…","generatedState":"Point-cloud-conditioned generation","conditionState":"Rendered point-cloud conditions","loadedCameras":"{count} / 7 camera videos loaded","dataError":"Point cloud data is invalid","dataLoadError":"Point cloud file could not be loaded","manifestError":"Scene manifest is unavailable.","previewNote":"Preview results. Final clips will replace these videos. LiDAR and rendered conditions share the selected scene and time window.","finalNote":"LiDAR visualizes the static input point cloud along the selected trajectory."},"zh":{"viewer":"点云条件生成 · 同步场景查看器","generated":"生成 RGB","condition":"点云条件","display":"相机显示模式","compareDrag":"拖动 CAM2 同步对比七视角：左侧生成视频，右侧对应点云渲染","compareValue":"左侧生成 RGB 占 {value}%，右侧为点云","cam2Condition":"点云条件 / CAM2","generatedBadge":"生成结果","previousScene":"上一个场景","nextScene":"下一个场景","videoError":"视频无法加载，请切换案例或刷新页面。","chooseScene":"选择场景…","pointSize":"LiDAR 点大小","sceneG150":"城镇路口","sceneG387":"城市左转","sceneG293":"夜间左弯","cam0":"前窄视角","cam2":"前鱼眼","cam3":"左前","cam4":"右前","cam5":"左后","cam6":"右后","cam7":"后视角","enlarge":"放大{view}","lidarLabel":"交互式场景点云。拖动旋转，滚轮缩放，按 R 复位。","resetLidar":"复位 LiDAR 方向","enlargeLidar":"放大 LiDAR","rotate":"拖动旋转","orbitHelp":"拖动旋转 · 滚轮缩放 · R 复位","loadingCloud":"正在加载点云…","play":"播放同步场景","pause":"暂停同步场景","restart":"重播场景","timeline":"场景时间轴","enterFull":"进入全屏","exitFull":"退出全屏","previous":"上一帧","next":"下一帧","loop":"循环","speed":"播放速度","details":"放大的传感器视图","close":"关闭放大视图","playPause":"播放 / 暂停","download":"下载视频 ↗","hint":"点击相机或 LiDAR 放大，拖动 LiDAR 旋转视角。","keys":"自动同步循环播放","fullCamera":"完整相机画幅 · 与场景同步。","lidarTitle":"LiDAR · 场景点云","enlargedCloud":"放大的交互式点云","preview":"预览 · 最终结果待更新","loading":"正在加载同步场景…","switching":"正在切换同步视角…","generatedState":"点云条件生成","conditionState":"渲染的点云条件","loadedCameras":"已加载 {count} / 7 路相机视频","dataError":"点云数据无效","dataLoadError":"点云文件加载失败","manifestError":"场景清单不可用。","previewNote":"当前为预览结果，后续将替换为最终视频。LiDAR 与渲染的点云条件使用同一场景和时间窗口。","finalNote":"LiDAR 沿选定轨迹展示输入的静态场景点云。"}};
/* PXW_EMBED_DICTS is generated from the project's EN/ZH dictionaries. */
(() => {
  const dictionaries = window.PXW_EMBED_DICTS;
  let language = new URLSearchParams(location.search).get('lang') === 'zh' ? 'zh' : 'en';
  const t = (key, vars = {}) => (dictionaries[language][key] ?? dictionaries.en[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
  function labels() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = t('viewer');
    document.querySelector('.sample-nav').setAttribute('aria-label', t('chooseScene'));
    document.querySelector('.pointcloud-stage').setAttribute('aria-label', t('viewer'));
    document.querySelectorAll('[data-camera]').forEach(tile => {
      tile.querySelector('.camera-tag-text').textContent = t(tile.dataset.camera);
      tile.querySelector('video').setAttribute('aria-label', `${t('generatedBadge')} · ${t(tile.dataset.camera)}`);
      tile.querySelector('.comparison-condition video').setAttribute('aria-label', `${t('condition')} · ${t(tile.dataset.camera)}`);
    });
    for (const [id, key] of [['prev','previousScene'],['next','nextScene']]) document.getElementById(id).setAttribute('aria-label', t(key));
    document.getElementById('generated-label').textContent = t('generatedBadge');
    document.getElementById('pointcloud-label').textContent = t('condition');
    document.getElementById('comparison').setAttribute('aria-label', t('compareDrag'));
    window.PXW_EMBED_API?.refreshLabels();
  }
  function reportSize() {
    parent.postMessage({ type: 'xworld-pointcloud-size', height: Math.ceil(document.getElementById('content').getBoundingClientRect().height) + 2 }, location.origin);
  }
  window.PXW_EMBED = { t };
  window.addEventListener('message', event => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== 'xworld-pointcloud-settings') return;
    language = event.data.lang === 'zh' ? 'zh' : 'en';
    document.documentElement.dataset.theme = event.data.theme === 'night' ? 'dark' : 'light';
    labels();
    window.PXW_EMBED_API?.setActive(Boolean(event.data.active));
    reportSize();
  });
  document.addEventListener('DOMContentLoaded', () => {
    labels();
    new ResizeObserver(reportSize).observe(document.getElementById('content'));
    parent.postMessage({ type: 'xworld-pointcloud-ready' }, location.origin);
    reportSize();
  });
})();
