import RNFetchBlob from 'rn-fetch-blob';

export const cacheAndWriteLessons = lessons => {
  let { dirs } = RNFetchBlob.fs;
  RNFetchBlob.fs.writeFile(
    `${dirs.LibraryDir || dirs.DocumentDir}/cacheLessons`,
    JSON.stringify(lessons),
    'utf8'
  );
  return { lessons, type: 'LESSONS' };
};

export const cacheLessons = lessons => ({ lessons, type: 'LESSONS' });
