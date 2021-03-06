import commonService from './common.service';

export async function getAllContent(type, sort, page, filters = '') {
  let included_types = '';

  if (type === '')
    included_types = `included_types[]=learning-path-course&included_types[]=course&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=pack-bundle-lesson&included_types[]=podcasts&`;
  else included_types = `included_types[]=${type}&`;

  if (sort === 'newest') sort = '-published_on';
  else if (sort === 'oldest') sort = 'published_on';
  let url = `${commonService.rootUrl}/musora-api/all?brand=pianote&sort=${sort}&statuses[]=published&limit=10&page=${page}&${included_types}${filters}`;
  let response = await commonService.tryCall(url);
  // if there is no filters available, then dont just show a blank array, maintain data structure

  if (response.meta.filterOptions.length === 0) {
    response.meta.filterOptions = {
      artist: [],
      content_type: [],
      difficulty: [],
      instructor: [],
      style: [],
      topic: []
    };
  }
  if (typeof response.meta.filterOptions.artist === 'undefined') {
    response.meta.filterOptions.artist = [];
  }
  if (typeof response.meta.filterOptions.content_type === 'undefined') {
    response.meta.filterOptions.content_type = [];
  }
  if (typeof response.meta.filterOptions.difficulty === 'undefined') {
    response.meta.filterOptions.difficulty = [];
  }
  if (typeof response.meta.filterOptions.instructor === 'undefined') {
    response.meta.filterOptions.instructor = [];
  }
  if (typeof response.meta.filterOptions.style === 'undefined') {
    response.meta.filterOptions.style = [];
  }
  if (typeof response.meta.filterOptions.topic === 'undefined') {
    response.meta.filterOptions.topic = [];
  }
  return response;
}

export async function getLiveContent() {
  return (response = await commonService.tryCall(
    `${commonService.rootUrl}/musora-api/live-event`,
    'GET'
    // ?forced-content-id=299539
    // ?forced-upcoming-content-id=275886
  ));
}

export async function getScheduleContent() {
  return (response = await commonService.tryCall(
    `${commonService.rootUrl}/musora-api/schedule`,
    'GET'
  ));
}

export async function getLiveScheduleContent() {
  return (response = await commonService.tryCall(
    `${commonService.rootUrl}/musora-api/live-schedule`,
    'GET'
  ));
}

export async function getStartedContent(type, page, filters = '') {
  if (type === '') {
    type =
      'learning-path-lesson&included_types[]=course&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=podcasts&included_types[]=pack-bundle-lesson';
  }
  return commonService.tryCall(
    `${commonService.rootUrl}/musora-api/in-progress?brand=pianote&sort=-progress&statuses[]=published&limit=10&included_types[]=${type}&required_user_states[]=started&page=${page}${filters}`
  );
}

export async function searchContent(term, page, filters = '') {
  let url = `${commonService.rootUrl}/musora-api/search?brand=pianote&limit=10&statuses[]=published&sort=-score&term=${term}&page=${page}${filters}`;

  return commonService.tryCall(url);
}

export async function getMyListContent(page, filters = '', progressState) {
  let progress_types = ''; // completed || started
  let sort = '-published_on';

  if (progressState !== '') {
    progress_types = '&state=' + progressState;
    sort = '-progress';
  }

  try {
    var url =
      `${commonService.rootUrl}/musora-api/my-list?brand=pianote&limit=10&statuses[]=published&sort=${sort}&page=${page}${filters}` +
      progress_types;
    return await commonService.tryCall(url);
  } catch (error) {
    return new Error(error);
  }
}

export async function getStudentFocusTypes() {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/railcontent/shows`
  );
}
