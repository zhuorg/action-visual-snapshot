import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';

import {fileToPng} from './fileToPng';
import {resizeImage} from './resizeImage';

type PixelmatchOptions = Exclude<Parameters<typeof pixelmatch>[5], undefined>;

export async function getDiff(
  file1: string | PNG,
  file2: string | PNG,
  {includeAA = true, threshold = 0.2, ...options}: PixelmatchOptions = {}
) {
  let img1 = typeof file1 === 'string' ? await fileToPng(file1) : file1;
  let img2 = typeof file2 === 'string' ? await fileToPng(file2) : file2;
  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);
  const diff = new PNG({width, height});

  if (img1.width !== img2.width || img1.height !== img2.height) {
    // resize images
    img1 = resizeImage(img1, width, height);
    img2 = resizeImage(img2, width, height);
  }

  const result = pixelmatch(img1.data, img2.data, diff.data, width, height, {
    includeAA,
    threshold,
    ...options,
  });

  return {
    result,
    diff,
    img1,
    img2,
  };
}
