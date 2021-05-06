import commonService from './common.service';

export function getContent(options) {
  switch (options.scene) {
    case 'COURSES':
      return Promise.all([getAll()]);
    case 'HOME':
      return Promise.all([
        getMethod(),
        getAll(options),
        getInProgress(options)
      ]);
  }
}
export function getAll({ scene, page, filters = '', sort = '-published_on' }) {
  return commonService.tryCall(
    `${
      commonService.rootUrl
    }/musora-api/all?brand=pianote&statuses[]=published&limit=20&${pickIncludedTypes(
      scene
    )}&page=${page}&sort=${sort}${filters}`
  );
}
export function getInProgress({
  scene,
  page,
  filters = '',
  sort = 'progress'
}) {
  return commonService.tryCall(
    `${
      commonService.rootUrl
    }/musora-api/in-progress?brand=pianote&&statuses[]=published&limit=20&${pickIncludedTypes(
      scene
    )}&required_user_states[]=started&sort=${sort}&page=${page}${filters}`
  );
}
function getMethod() {
  return commonService.tryCall(
    `${commonService.rootUrl}/musora-api/learning-paths/pianote-method`
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
