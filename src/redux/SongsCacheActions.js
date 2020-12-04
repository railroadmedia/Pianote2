import RNFetchBlob from 'rn-fetch-blob';

export const cacheAndWriteSongs = songs => {
  RNFetchBlob.fs.writeFile(
    `${RNFetchBlob.fs.dirs.DocumentDir}/cacheSongs`,
    JSON.stringify(songs),
    'utf8'
  );
  return { songs, type: 'SONGS' };
};

export const cacheSongs = songs => ({ songs, type: 'SONGS' });
