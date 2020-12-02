import RNFetchBlob from 'rn-fetch-blob';

export const cacheMyList = myList => {
  RNFetchBlob.fs.writeFile(
    `${RNFetchBlob.fs.dirs.DocumentDir}/cacheMyList`,
    JSON.stringify(myList),
    'utf8'
  );
  return { myList, type: 'MYLIST' };
};
