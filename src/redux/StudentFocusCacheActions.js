import RNFetchBlob from 'rn-fetch-blob';

export const cacheAndWriteStudentFocus = studentFocus => {
  let { dirs } = RNFetchBlob.fs;
  RNFetchBlob.fs.writeFile(
    `${dirs.LibraryDir || dirs.DocumentDir}/cacheStudentFocus`,
    JSON.stringify(studentFocus),
    'utf8'
  );
  return { studentFocus, type: 'STUDENTFOCUS' };
};

export const cacheStudentFocus = studentFocus => ({
  studentFocus,
  type: 'STUDENTFOCUS'
});
