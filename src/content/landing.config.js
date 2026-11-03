/** Native-resolution synchronized cameras packed without scaling into one decoder clock. */
export const landing = {
  openingSrc: 'media/landing/opening.mp4',
  src: 'media/landing/synchronized.mp4',
  source: 'synchronized/cam0,cam2,cam3,cam4,cam5,cam6,cam7.mp4',
  posterAt: 1,
  views: [
    { id: '01', camera: 0, crop: [0, 0, 1920, 960], poster: 'media/landing/view-01.jpg', side: 'main', row: 0 },
    { id: '02', camera: 2, crop: [1920, 0, 1024, 512], poster: 'media/landing/view-02.jpg', side: 'left', row: 0 },
    { id: '03', camera: 3, crop: [0, 960, 512, 416], poster: 'media/landing/view-03.jpg', side: 'left', row: 1 },
    { id: '04', camera: 5, crop: [1024, 960, 512, 416], poster: 'media/landing/view-04.jpg', side: 'left', row: 2 },
    { id: '05', camera: 7, crop: [1920, 512, 896, 448], poster: 'media/landing/view-05.jpg', side: 'right', row: 0 },
    { id: '06', camera: 4, crop: [512, 960, 512, 416], poster: 'media/landing/view-06.jpg', side: 'right', row: 1 },
    { id: '07', camera: 6, crop: [1536, 960, 512, 416], poster: 'media/landing/view-07.jpg', side: 'right', row: 2 },
  ],
};
