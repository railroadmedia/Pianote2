// NavigationService.js

import commonService from './common.service';

function decideWhereToRedirect() {
  let url = decodeURIComponent(commonService.urlToOpen);
  commonService.urlToOpen = '';
  if (url.slice(-1) === '/' || url.slice(-1) === '?') url = url.slice(0, -1);
  let id = parseInt(url.substr(url.lastIndexOf('/') + 1, url.length));

  if (url.includes('members/all')) navigate('LESSONS');
  else if (url.endsWith('courses') || (url.includes('courses') && isNaN(id))) {
    return navigate('COURSE', { url });
  } else if (url.endsWith('songs') || (url.includes('songs') && isNaN(id))) {
    return navigate('SONGCATALOG', { url });
  } else if (
    url.endsWith('student-focus') ||
    (url.includes('student-focus') && isNaN(id))
  ) {
    return navigate('STUDENTFOCUSCATALOG', { url });
  } else if (
    url.endsWith('quick-tips') ||
    (url.includes('quick-tips') && isNaN(id))
  ) {
    return navigate('STUDENTFOCUSSHOW', { type: 'quick-tips', url });
  } else if (
    url.endsWith('student-reviews') ||
    (url.includes('student-reviews') && isNaN(id))
  ) {
    return navigate('STUDENTFOCUSSHOW', { type: 'student-reviews', url });
  } else if (
    url.endsWith('question-and-answer') ||
    (url.includes('question-and-answer') && isNaN(id))
  ) {
    return navigate('STUDENTFOCUSSHOW', { type: 'question-and-answer', url });
  } else if (
    url.endsWith('podcasts') ||
    (url.includes('podcasts') && isNaN(id))
  ) {
    return navigate('STUDENTFOCUSSHOW', { type: 'podcasts', url });
  } else if (
    url.endsWith('boot-camps') ||
    (url.includes('boot-camps') && isNaN(id))
  ) {
    return navigate('STUDENTFOCUSSHOW', { type: 'boot-camps', url });
  } else if (url.includes('courses')) {
    return navigate('PATHOVERVIE', { id, contentType: 'course' });
  } else if (url.includes('lists')) {
    return navigate('MYLIST', { url });
  } else if (url.includes('profile') && !url.includes('lists')) {
    return navigate('PROFILE', { url });
  }
}

// add other navigation functions that you need and export them

export default {
  decideWhereToRedirect
};
