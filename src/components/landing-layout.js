// Fit the diagram between its translated heading and caption, including short
// desktop windows. Source crops stay unchanged; only their presentation moves.
export function landingLayout({ width, height, titleBottom, captionHeight, aspect = 2, contentRatio = 0.85 }) {
  const contentWidth = Math.min(1720, width * contentRatio);
  const gap = Math.min(20, Math.max(10, height * 0.018));
  const captionGap = height < 720 ? 18 : 26;
  const top = titleBottom + (height < 720 ? 22 : 32);
  const bottom = height - 64 - captionHeight - captionGap;
  const availableHeight = Math.max(60, bottom - top);
  const railHeight = Math.min(160, contentWidth * 0.105, (availableHeight - gap * 2) / 3);
  const railWidth = railHeight * 1.8;
  const mainWidth = Math.min(900, contentWidth * 0.52, availableHeight * aspect);
  const mainHeight = mainWidth / aspect;
  const railStack = railHeight * 3 + gap * 2;
  const diagramHeight = Math.max(mainHeight, railStack);
  const centerY = top + availableHeight / 2;
  const main = { x: (width - mainWidth) / 2, y: centerY - mainHeight / 2, w: mainWidth, h: mainHeight };
  const railTop = centerY - railStack / 2;
  const contentLeft = (width - contentWidth) / 2;
  return {
    start: { x: 0, y: 0, w: width, h: height },
    main,
    rail: (side, row) => ({ x: side === 'left' ? contentLeft : width - contentLeft - railWidth, y: railTop + row * (railHeight + gap), w: railWidth, h: railHeight }),
    captionTop: centerY + diagramHeight / 2 + captionGap,
  };
}
