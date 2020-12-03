import RNFetchBlob from 'rn-fetch-blob';

export const cacheCourses = courses => {
  RNFetchBlob.fs.writeFile(
    `${RNFetchBlob.fs.dirs.DocumentDir}/cacheCourses`,
    JSON.stringify(courses),
    'utf8'
  );
  return { courses, type: 'COURSES' };
};
