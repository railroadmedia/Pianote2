import commonService from './common.service';

export function getContent(options) {
  return new Promise(res => {
    switch (options.scene) {
      case 'SHOW':
        Promise.all([
          getAll(options),
          getStudentFocus(options.signal)
        ]).then(([{ all }, { studentFocus }]) => res({ all, studentFocus }));
        break;
      case 'SONGS':
      case 'COURSES':
        Promise.all([
          getAll(options),
          getInProgress(options)
        ]).then(([{ all }, { inProgress }]) => res({ all, inProgress }));
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
          res({ studentFocus, inProgress });
        });
        break;
      case 'HOME':
        Promise.all([
          getMethod(options.signal),
          getAll(options),
          getInProgress(options)
        ]).then(([{ method }, { all }, { inProgress }]) =>
          res({ method, all, inProgress })
        );
        break;
      default:
        res({});
    }
  });
}
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
        }/musora-api/all?brand=pianote&statuses[]=published&limit=20&${pickIncludedTypes(
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
        }/musora-api/in-progress?brand=pianote&&statuses[]=published&limit=20&${pickIncludedTypes(
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
function pickIncludedTypes(scene, showType) {
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
