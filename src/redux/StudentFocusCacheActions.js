import RNFetchBlob from 'rn-fetch-blob';

export const cacheStudentFocus = studentFocus => {
  RNFetchBlob.fs.writeFile(
    `${RNFetchBlob.fs.dirs.DocumentDir}/cacheStudentFocus`,
    JSON.stringify(studentFocus),
    'utf8'
  );
  return { studentFocus, type: 'STUDENTFOCUS' };
};
