import commonService from './common.service';

export async function getAllContent(type, sort, page, filters = '') {
  let included_types = '';

  if (type == '')
    included_types = `included_types[]=learning-path-course&included_types[]=course&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=pack-bundle-lesson&included_types[]=podcasts&`;
  else included_types = `included_types[]=${type}&`;

  if (sort == 'newest') sort = '-published_on';
  else if (sort == 'oldest') sort = 'published_on';

  try {
    let url = `${commonService.rootUrl}/api/railcontent/content?brand=pianote&sort=${sort}&statuses[]=published&limit=20&page=${page}&${included_types}${filters}`;
    let response = await commonService.tryCall(url);
    // if there is no filters available, then dont just show a blank array, maintain data structure

    if (response.meta.filterOptions.length == 0) {
      response.meta.filterOptions = {
        artist: [],
        content_type: [],
        difficulty: [],
        instructor: [],
        style: [],
        topic: []
      };
    }
    if (typeof response.meta.filterOptions.artist == 'undefined') {
      response.meta.filterOptions.artist = [];
    }
    if (typeof response.meta.filterOptions.content_type == 'undefined') {
      response.meta.filterOptions.content_type = [];
    }
    if (typeof response.meta.filterOptions.difficulty == 'undefined') {
      response.meta.filterOptions.difficulty = [];
    }
    if (typeof response.meta.filterOptions.instructor == 'undefined') {
      response.meta.filterOptions.instructor = [];
    }
    if (typeof response.meta.filterOptions.style == 'undefined') {
      response.meta.filterOptions.style = [];
    }
    if (typeof response.meta.filterOptions.topic == 'undefined') {
      response.meta.filterOptions.topic = [];
    }
    return response;
  } catch (error) {
    return new Error(error);
  }
}

export async function getNewContent(type) {
  try {
    if (type == '') {
      // if type not specified take almost all lesson types
      type =
        'course&included_types[]=song&included_types[]=learning-path-level&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chords-and-scales&included_types[]=pack&included_types[]=podcasts';
    }

    let response = await commonService.tryCall(
      `${commonService.rootUrl}/api/railcontent/content?show_in_new_feed,1&brand=pianote&sort=-published_on&statuses[]=published&limit=40&page=1&included_types[]=${type}`,
      'GET'
    );

    return response;
  } catch (error) {
    return new Error(error);
  }
}

export async function getStartedContent(type) {
  try {
    if (type == '') {
      type =
        'learning-path-lesson&included_types[]=course&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=podcasts&included_types[]=pack-bundle-lesson';
    }
    return commonService.tryCall(
      `${commonService.rootUrl}/api/railcontent/content?brand=pianote&sort=-progress&statuses[]=published&limit=40&page=1&included_types[]=${type}&required_user_states[]=started`
    );
  } catch (error) {
    return new Error(error);
  }
}

export async function searchContent(term, page, filtersDict) {
  let included_types = ''; // types
  if (isPackOnly == true) {
    included_types =
      included_types +
      '&included_types[]=unit&included_types[]=pack-bundle-lesson';
  } else if (filtersDict.content_type.length > 0) {
    for (i in filtersDict.content_type) {
      included_types =
        included_types + `&included_types[]=${filtersDict.content_type[i]}`;
    }
  } else {
    included_types =
      included_types +
      '&included_types[]=learning-path&included_types[]=course&included_types[]=learning-path-level&included_types[]=course-part&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=pack-bundle-lesson';
  }

  try {
    let url =
      `${commonService.rootUrl}/api/railcontent/search?brand=pianote&limit=20&statuses[]=published&sort=-score&term=${term}&page=${page}` +
      included_types;
    return commonService.tryCall(url);
  } catch (error) {
    return new Error(error);
  }
}

export async function getMyListContent(page, filtersDict, progressState) {
  let included_types = '';
  let progress_types = ''; // completed || started
  let sort = '-published_on';

  if (progressState !== '') {
    progress_types = '&state=' + progressState;
    sort = '-progress';
  }

  if (filtersDict.content_type.length > 0) {
    for (i in filtersDict.content_type) {
      included_types =
        included_types + `&included_types[]=${filtersDict.content_type[i]}`;
    }
  } else {
    included_types =
      included_types +
      '&included_types[]=learning-path&included_types[]=learning-path-level&included_types[]=learning-path-course&included_types[]=learning-path-lesson&included_types[]=course&included_types[]=course-part&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=pack-bundle-lesson&included_types[]=podcasts';
  }

  try {
    var url =
      `${commonService.rootUrl}/api/railcontent/my-list?brand=pianote&limit=20&statuses[]=published&sort=${sort}&page=${page}` +
      included_types +
      progress_types;

    return await commonService.tryCall(url);
  } catch (error) {
    return new Error(error);
  }
}

export async function seeAllContent(contentType, type, page, filtersDict) {
  let url = `${commonService.rootUrl}/api/railcontent/content?brand=pianote&limit=20&statuses[]=published&page=${page}`;

  if (contentType == 'lessons') {
    // add types
    if (filtersDict.content_type.length > 0) {
      // if user filtered for types
      for (i in filtersDict.content_type) {
        url = url + `&included_types[]=${filtersDict.content_type[i]}`;
      }
    } else {
      // if user did not filter for types use all types except 2
      url =
        url +
        '&included_types[]=learning-path-lesson&included_types[]=course&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chords-and-scales&included_types[]=podcasts&included_types[]=pack-bundle-lesson';
    }
    // if user clicked see all on started videos
  } else if (contentType == 'courses') {
    // add types
    url = url + `&included_types[]=course`;
  } else if (contentType == 'song') {
    url = url + `&included_types[]=song`;
  }
  if (type == 'continue') {
    url = url + `&required_user_states[]=started&sort=-progress`;
  } else {
    url = url + `&sort=-published_on`;
  }
  try {
    let x = await commonService.tryCall(url);
    return x;
  } catch (error) {
    return new Error(error);
  }
}

export async function getContentById(contentID) {
  try {
    return commonService.tryCall(
      `${commonService.rootUrl}/railcontent/content/${contentID}`
    );
  } catch (error) {
    return new Error(error);
  }
}

export async function getStudentFocusTypes() {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/railcontent/shows`
  );
}
