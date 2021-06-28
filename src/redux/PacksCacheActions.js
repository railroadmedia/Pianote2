import RNFetchBlob from 'rn-fetch-blob';

export const cacheAndWritePacks = packs => {
  let { dirs } = RNFetchBlob.fs;
  RNFetchBlob.fs.writeFile(
    `${dirs.LibraryDir || dirs.DocumentDir}/cachePacks`,
    JSON.stringify(packs),
    'utf8'
  );
  return { packs, type: 'PACKS' };
};

export const cachePacks = packs => ({ packs, type: 'PACKS' });
