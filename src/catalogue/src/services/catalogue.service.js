import RNFetchBlob from 'rn-fetch-blob';
const { dirs } = RNFetchBlob.fs;

import commonService from './common.service';

/* cache holders */
// cacheCards only keep the cards data from all and in progress arrays
let cacheCards = {};
// cacheCatalogue keeps each scene's data
// all and in progress arrays only keep the ids to avoid duplicate data and storage memory waste
let cacheCatalogue = {};

// the combined cache of cacheCards and cacheCatalogue
export let cache = {};
/* END */

/* data fetchers */
/** data fetcher for the whole catalogue page **/
export function getContent(options) {
  return new Promise(res => {
    switch (options.scene) {
      case 'SHOW':
        Promise.all([
          getAll(options),
          getStudentFocus(options.signal)
        ]).then(([{ all }, { studentFocus }]) =>
          setCache({ all, studentFocus }, options.scene, res)
        );
        break;
      case 'SONGS':
      case 'COURSES':
        Promise.all([
          getAll(options),
          getInProgress(options)
        ]).then(([{ all }, { inProgress }]) =>
          setCache({ all, inProgress }, options.scene, res)
        );
        break;
      case 'STUDENTFOCUS':
        Promise.all([
          getStudentFocus(options.signal),
          getInProgress(options)
        ]).then(([{ studentFocus }, { inProgress }]) => {
          Object.keys(studentFocus).map(sfk => {
            studentFocus[sfk].showType = sfk;
            studentFocus[sfk].type = 'show';
          });
          setCache({ studentFocus, inProgress }, options.scene, res);
        });
        break;
      case 'HOME':
        Promise.all([
          getMethod(options.signal),
          getAll(options),
          getInProgress(options)
        ]).then(([{ method }, { all }, { inProgress }]) =>
          setCache({ method, all, inProgress }, options.scene, res)
        );
        break;
      default:
        res({});
    }
  });
}
/** END **/
/** data fetcher for 'all' section used in loading more, filtering, sorting and getContent() **/
export function getAll({
  scene,
  showType,
  page = 1,
  filters = '',
  sort = '-published_on',
  signal
}) {
  return new Promise(res =>
    commonService
      .tryCall(
        `${
          commonService.rootUrl
        }/musora-api/all?brand=pianote&statuses[]=published&limit=20&${getIncludedTypes(
          scene,
          showType
        )}&page=${page}&sort=${sort}${filters}`,
        null,
        null,
        signal
      )
      .then(all => res({ all }))
  );
}
/** END **/
/** data fetcher for 'in progress' section used in 'see all' and getContent() **/
export function getInProgress({
  scene,
  showType,
  page = 1,
  filters = '',
  sort = 'progress',
  signal
}) {
  return new Promise(res =>
    commonService
      .tryCall(
        `${
          commonService.rootUrl
        }/musora-api/in-progress?brand=pianote&&statuses[]=published&limit=20&${getIncludedTypes(
          scene,
          showType
        )}&required_user_states[]=started&sort=${sort}&page=${page}${filters}`,
        null,
        null,
        signal
      )
      .then(inProgress => res({ inProgress }))
  );
}
/** END **/
/** data fetcher for home's method section used in getContent() **/
function getMethod(signal) {
  return new Promise(res =>
    commonService
      .tryCall(
        `${commonService.rootUrl}/musora-api/learning-paths/pianote-method`,
        null,
        null,
        signal
      )
      .then(method => res({ method }))
  );
}
/** END **/
/** data fetcher for student focus catalogue used in getContent() **/
function getStudentFocus(signal) {
  return new Promise(res =>
    commonService
      .tryCall(
        `${commonService.rootUrl}/api/railcontent/shows`,
        null,
        null,
        signal
      )
      .then(studentFocus => res({ studentFocus }))
  );
}
/** END **/
/** form the included_types part of the url **/
function getIncludedTypes(scene, showType) {
  let it = 'included_types[]=';
  switch (scene) {
    case 'SHOW':
      switch (showType) {
        case 'boot-camps':
          return it + 'boot-camps';
        case 'quick-tips':
          return it + 'quick-tips';
        case 'student-review':
          return it + 'student-review';
        case 'question-and-answer':
          return it + 'question-and-answer';
        case 'podcasts':
          return it + 'podcasts';
      }
    case 'COURSES':
      return it + 'course';
    case 'SONGS':
      return it + 'song';
    case 'STUDENTFOCUS':
      return [
        'quick-tips',
        'question-and-answer',
        'student-review',
        'boot-camps',
        'podcast'
      ]
        .map(t => it + t)
        .join('&');
    case 'HOME':
      return [
        'learning-path-course',
        'course',
        'song',
        'quick-tips',
        'question-and-answer',
        'student-review',
        'boot-camps',
        'chord-and-scale',
        'pack-bundle-lesson',
        'podcasts'
      ]
        .map(t => it + t)
        .join('&');
  }
}
/** END **/
/* END */

/* data caching */
/** set the cache after the initial data fetch in componentDidMount() **/
function setCache({ method, all, inProgress, studentFocus }, scene, resolve) {
  cacheCatalogue[scene] = {
    method,
    // only keep the ids in cacheCatalogue all
    // move the actual data from all in cacheCards
    all: all?.data?.map(a => {
      cacheCards[a.id] = a;
      return a.id;
    }),
    // only keep the ids in cacheCatalogue inProgress
    // move the actual data from inProgress in cacheCards
    inProgress: inProgress?.data?.map(ip => {
      cacheCards[ip.id] = ip;
      return ip.id;
    }),
    studentFocus
  };
  combineCache(cacheCatalogue, cacheCards);
  ['chCatalogue', 'chCards'].map((path, i) =>
    RNFetchBlob.fs.writeFile(
      `${dirs.LibraryDir || dirs.DocumentDir}/${path}`,
      JSON.stringify(i ? cacheCards : cacheCatalogue),
      'utf8'
    )
  );
  resolve({ method, all, inProgress, studentFocus });
}
/** END **/
/** set the cards cache in case 'add to my list' or 'like' states are changed used in CardsReducer **/
export function setCardsCache(card) {
  cacheCards[card.id] = card;
  combineCache(cacheCatalogue, cacheCards);
  RNFetchBlob.fs.writeFile(
    `${dirs.LibraryDir || dirs.DocumentDir}/chCards`,
    JSON.stringify(cacheCards),
    'utf8'
  );
}
/** END **/
/** combine catalogue's cache with the cards' cache **/
function combineCache(chCatalogue, chCards) {
  Object.keys(chCatalogue).map(key => {
    cache[key] = { ...chCatalogue[key] };
    cache[key].all = cache[key].all.map(a => chCards[a]);
    cache[key].inProgress = cache[key].inProgress.map(ip => chCards[ip]);
  });
}
/** END **/
/** get the cache from storage at app launch and prepare it for export **/
(function () {
  // RNFetchBlob.fs.unlink(`${dirs.LibraryDir || dirs.DocumentDir}/chCatalogue`);
  // RNFetchBlob.fs.unlink(`${dirs.LibraryDir || dirs.DocumentDir}/chCards`);
  Promise.all(
    ['chCatalogue', 'chCards'].map(path =>
      RNFetchBlob.fs.readFile(
        `${dirs.LibraryDir || dirs.DocumentDir}/${path}`,
        'utf8'
      )
    )
  )
    .then(([chCatalogue, chCards]) =>
      combineCache(
        (cacheCatalogue = JSON.parse(chCatalogue) || {}),
        (cacheCards = JSON.parse(chCards) || {})
      )
    )
    .catch(_ => {});
})();
/** END **/
/* END */
