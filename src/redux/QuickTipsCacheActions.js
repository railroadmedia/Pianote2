import RNFetchBlob from 'rn-fetch-blob';

export const cacheAndWriteQuickTips = quickTips => {
  RNFetchBlob.fs.writeFile(
    `${RNFetchBlob.fs.dirs.DocumentDir}/cacheQuickTips`,
    JSON.stringify(quickTips),
    'utf8'
  );
  return { quickTips, type: 'QUICKTIPS' };
};

export const cacheQuickTips = quickTips => ({ quickTips, type: 'QUICKTIPS' });
