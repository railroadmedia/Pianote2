import RNFetchBlob from 'rn-fetch-blob';

export const cacheAndWriteSongs = songs => {
  let { dirs } = RNFetchBlob.fs;
  RNFetchBlob.fs.writeFile(
    `${dirs.LibraryDir || dirs.DocumentDir}/cacheSongs`,
    JSON.stringify(songs),
    'utf8'
  );
  return { songs, type: 'SONGS' };
};

export const cacheSongs = songs => ({ songs, type: 'SONGS' });
