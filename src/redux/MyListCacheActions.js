import RNFetchBlob from 'rn-fetch-blob';

export const cacheAndWriteMyList = myList => {
  RNFetchBlob.fs.writeFile(
    `${RNFetchBlob.fs.dirs.DocumentDir}/cacheMyList`,
    JSON.stringify(myList),
    'utf8'
  );
  return { myList, type: 'MYLIST' };
};

export const cacheMyList = myList => ({ myList, type: 'MYLIST' });
