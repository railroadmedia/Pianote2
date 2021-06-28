import RNFetchBlob from 'rn-fetch-blob';

export const cacheAndWritePodcasts = podcasts => {
  let { dirs } = RNFetchBlob.fs;
  RNFetchBlob.fs.writeFile(
    `${dirs.LibraryDir || dirs.DocumentDir}/cachePodcasts`,
    JSON.stringify(podcasts),
    'utf8'
  );
  return { podcasts, type: 'PODCASTS' };
};

export const cachePodcasts = podcasts => ({ podcasts, type: 'PODCASTS' });
