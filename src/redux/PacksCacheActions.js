import RNFetchBlob from 'rn-fetch-blob';

export const cachePacks = packs => {
  RNFetchBlob.fs.writeFile(
    `${RNFetchBlob.fs.dirs.DocumentDir}/cachePacks`,
    JSON.stringify(packs),
    'utf8'
  );
  return { packs, type: 'PACKS' };
};
