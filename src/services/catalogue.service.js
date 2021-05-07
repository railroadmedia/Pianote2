import commonService from './common.service';

export function getContent(options) {
  return new Promise(res => {
    switch (options.scene) {
      case 'COURSES':
        Promise.all([getAll()]).then(([{ all }]) => res({ all }));
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
  page,
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
          scene
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
  page,
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
          scene
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
function pickIncludedTypes(scene) {
  let it = 'included_types[]=';
  switch (scene) {
    case 'COURSES':
      return it + course;
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
