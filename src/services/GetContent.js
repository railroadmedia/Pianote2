import commonService from './common.service';

export async function getAllContent(type, sort, page, filtersDict) {
  let filters = ''; // instructor, topic, level
  let required_user_states = ''; // progress
  let included_types = '';

  if (type == '') {
    included_types = `included_types[]=unit-part&included_types[]=course&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=pack-bundle-lesson&included_types[]=podcasts&`;
  } else {
    included_types = `included_types[]=${type}&`;
  }

  for (i in filtersDict.topics) {
    filters = filters + `required_fields[]=${filtersDict.topics[i]}&`;
  }
  for (i in filtersDict.instructors) {
    filters =
      filters + `required_fields[]=instructor,${filtersDict.instructors[i]}&`;
  }
  for (i in filtersDict.level) {
    if (typeof filtersDict.level[i] == 'number') {
      filters =
        filters + `required_fields[]=difficulty,${filtersDict.level[i]}&`;
    }
  }
  for (i in filtersDict.progress) {
    if (filtersDict.progress[i] !== 'all') {
      required_user_states =
        required_user_states +
        `required_user_states[]=${filtersDict.progress[i]}`;
    }
  }

  if (sort == 'newest') {
    sort = '-published_on';
  } else if (sort == 'oldest') {
    sort = 'published_on';
  }

  try {
    let url =
      `${commonService.rootUrl}/api/railcontent/content?brand=pianote&sort=${sort}&statuses[]=published&limit=20&page=${page}&${included_types}` +
      filters +
      required_user_states;
      console.log('URL', url)
    return await commonService.tryCall(url);
  } catch (error) {
    console.log('Error: ', error);
    return new Error(error);
  }
}

export async function getNewContent(type) {
  try {
    if (type == '') {
      // if type not specified take almost all lesson types
      type =
        'course&included_types[]=song&included_types[]=unit&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chords-and-scales&included_types[]=pack&included_types[]=podcasts';
    }

    let response = await commonService.tryCall(
      `${commonService.rootUrl}/api/railcontent/content?show_in_new_feed,1&brand=pianote&sort=-published_on&statuses[]=published&limit=40&page=1&included_types[]=${type}`,
      'GET'
    );

    return response;
  } catch (error) {
    console.log('Error', error);
    return new Error(error);
  }
}

export async function getStartedContent(type) {
  try {
    if (type == '') {
      type =
        'unit&included_types[]=unit-part&included_types[]=course&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=podcasts&included_types[]=pack-bundle-lesson';
    }
    return commonService.tryCall(
      `${commonService.rootUrl}/api/railcontent/content?brand=pianote&sort=-progress&statuses[]=published&limit=40&page=1&included_types[]=${type}&required_user_states[]=started`
    );
  } catch (error) {
    console.log('Error', error);
    return new Error(error);
  }
}

export async function searchContent(term, page, filtersDict) {
  let included_types = ''; // types
  if (isPackOnly == true) {
    included_types =
      included_types +
      '&included_types[]=unit&included_types[]=pack-bundle-lesson';
  } else if (filtersDict.topics.length > 0) {
    for (i in filtersDict.topics) {
      included_types =
        included_types + `&included_types[]=${filtersDict.topics[i]}`;
    }
  } else {
    included_types =
      included_types +
      '&included_types[]=learning-path&included_types[]=unit&included_types[]=course&included_types[]=unit-part&included_types[]=course-part&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=pack-bundle-lesson';
  }

  try {
    let url =
      `${commonService.rootUrl}/api/railcontent/search?brand=pianote&limit=20&statuses[]=published&sort=-score&term=${term}&page=${page}` +
      included_types;
    return commonService.tryCall(url);
  } catch (error) {
    console.log('Error: ', error);
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

  if (filtersDict.topics.length > 0) {
    for (i in filtersDict.topics) {
      included_types =
        included_types + `&included_types[]=${filtersDict.topics[i]}`;
    }
  } else {
    included_types =
      included_types +
      '&included_types[]=learning-path&included_types[]=unit&included_types[]=course&included_types[]=unit-part&included_types[]=course-part&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=pack-bundle-lesson';
  }

  try {
    var url =
      `${commonService.rootUrl}/api/railcontent/my-list?brand=pianote&limit=20&statuses[]=published&sort=${sort}&page=${page}` +
      included_types +
      progress_types;
    return commonService.tryCall(url);
  } catch (error) {
    console.log('Error: ', error);
    return new Error(error);
  }
}

export async function seeAllContent(contentType, type, page, filtersDict) {
  let url = `${commonService.rootUrl}/api/railcontent/content?brand=pianote&limit=20&statuses[]=published&sort=-published_on&page=${page}`;

  if (contentType == 'lessons') {
    // add types
    if (filtersDict.topics.length > 0) {
      // if user filtered for types
      for (i in filtersDict.topics) {
        url = url + `&included_types[]=${filtersDict.topics[i]}`;
      }
    } else {
      // if user did not filter for types use all types except 2
      url =
        url +
        '&included_types[]=course&included_types[]=song&included_types[]=unit&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chords-and-scales&included_types[]=pack&included_types[]=podcasts';
    }
    // if user clicked see all on started videos
    if (type == 'continue') {
      url = url + `&required_user_states[]=started`;
    }
  } else if (contentType == 'courses') {
    // add types
    url = url + `&included_types[]=course`;

    //if (filtersDict.topics.length > 0) {
    // if user filtered for types
    //  for (i in filtersDict.topics) {
    //    url = url + `&included_types[]=${filtersDict.topics[i]}`;
    // }
    //}
  }
  try {
    let x = await commonService.tryCall(url);
    return x;
  } catch (error) {
    console.log('Error: ', error);
    return new Error(error);
  }
}

export async function getContentById(contentID) {
  try {
    return commonService.tryCall(
      `${commonService.rootUrl}/railcontent/content/${contentID}`
    );
  } catch (error) {
    console.log('Get content by ID error: ', error);
    return new Error(error);
  }
}

export async function getStudentFocusTypes() {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/railcontent/shows`
  );
}
