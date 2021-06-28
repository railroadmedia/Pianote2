import RNFetchBlob from 'rn-fetch-blob';

export const cacheAndWriteQuickTips = quickTips => {
  let { dirs } = RNFetchBlob.fs;
  RNFetchBlob.fs.writeFile(
    `${dirs.LibraryDir || dirs.DocumentDir}/cacheQuickTips`,
    JSON.stringify(quickTips),
    'utf8'
  );
  return { quickTips, type: 'QUICKTIPS' };
};

export const cacheQuickTips = quickTips => ({ quickTips, type: 'QUICKTIPS' });
