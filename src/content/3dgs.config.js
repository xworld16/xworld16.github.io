/** Seven generated cameras and the main 3DGS render share one packed playback clock. */
export const gsViews = [
  { camera: 0, side: 'main', row: 0, crop: [0, 0, 1024, 512] },
  { camera: 2, side: 'left', row: 0, crop: [0, 512, 320, 160] },
  { camera: 3, side: 'left', row: 1, crop: [320, 512, 320, 260] },
  { camera: 4, side: 'right', row: 1, crop: [640, 512, 320, 260] },
  { camera: 5, side: 'left', row: 2, crop: [960, 512, 320, 260] },
  { camera: 6, side: 'right', row: 2, crop: [1280, 512, 320, 260] },
  { camera: 7, side: 'right', row: 0, crop: [1600, 512, 320, 160] },
];

export const gsComparison = { crop: [1024, 0, 1024, 512] };

export const gsDemos = [
  ['demo-01', 'eval154__c-2caed5cb-a096-3020-a3ef-b9a482e8043e'],
  ['demo-02', 'eval154__c-65b0788f-5595-3ae8-9936-e7449c431b8a'],
  ['demo-04', 'eval154__c-79df2d50-4bd2-3e53-b936-da76aa54f68e'],
].map(([id, folder]) => {
  return {
    id,
    source: `3dgs_diffusion_web_embed_final/media/${folder}`,
    src: `media/grounding/3dgs/${id}.mp4`,
    poster: (camera) => `media/grounding/3dgs/${id}-cam${camera}.jpg`,
    comparisonPoster: `media/grounding/3dgs/${id}-3dgs.jpg`,
  };
});
