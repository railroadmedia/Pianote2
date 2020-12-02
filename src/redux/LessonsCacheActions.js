import RNFetchBlob from 'rn-fetch-blob';

export const cacheLessons = (lessons, id, action) => {
  RNFetchBlob.fs.writeFile(
    `${RNFetchBlob.fs.dirs.DocumentDir}/cacheLessons`,
    JSON.stringify(lessons),
    'utf8'
  );
  // RNFetchBlob.fs.unlink(`${RNFetchBlob.fs.dirs.DocumentDir}/cacheLessons`);
  return { lessons, type: 'LESSONS' };
};
