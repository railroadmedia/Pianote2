import RNFetchBlob from 'rn-fetch-blob';

export const cacheAndWriteCourses = courses => {
  let { dirs } = RNFetchBlob.fs;
  RNFetchBlob.fs.writeFile(
    `${dirs.LibraryDir || dirs.DocumentDir}/cacheCourses`,
    JSON.stringify(courses),
    'utf8'
  );
  return { courses, type: 'COURSES' };
};

export const cacheCourses = courses => ({ courses, type: 'COURSES' });
