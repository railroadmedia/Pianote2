import RNFetchBlob from 'rn-fetch-blob';

export const cachePodcasts = podcasts => {
  RNFetchBlob.fs.writeFile(
    `${RNFetchBlob.fs.dirs.DocumentDir}/cachePodcasts`,
    JSON.stringify(podcasts),
    'utf8'
  );
  return { podcasts, type: 'PODCASTS' };
};
