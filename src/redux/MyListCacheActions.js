import RNFetchBlob from 'rn-fetch-blob';

export const cacheAndWriteMyList = myList => {
  let { dirs } = RNFetchBlob.fs;
  RNFetchBlob.fs.writeFile(
    `${dirs.LibraryDir || dirs.DocumentDir}/cacheMyList`,
    JSON.stringify(myList),
    'utf8'
  );
  return { myList, type: 'MYLIST' };
};

export const cacheMyList = myList => ({ myList, type: 'MYLIST' });
