// NavigationService.js

import { navigate, reset } from '../../AppNavigator';
import commonService from './common.service';

function decideWhereToRedirect() {
  let url = decodeURIComponent(commonService.urlToOpen);
  commonService.urlToOpen = '';
  global.notifNavigation = true;
  if (url.slice(-1) === '/' || url.slice(-1) === '?') url = url.slice(0, -1);
  let id = parseInt(url.substr(url.lastIndexOf('/') + 1, url.length));

  if (isPackOnly) {
    return reset('PACKS');
  } else {
    reset('LESSONS');
    // links that should redirect edge users only

    if (url.includes('members/all')) return navigate('LESSONS');
    if (url.endsWith('courses') || (url.includes('courses') && isNaN(id))) {
      return navigate('COURSE', { url });
    }
    if (url.endsWith('songs') || (url.includes('songs') && isNaN(id))) {
      return navigate('SONGCATALOG', { url });
    }
    if (
      url.endsWith('student-focus') ||
      (url.includes('student-focus') && isNaN(id))
    ) {
      return navigate('STUDENTFOCUSCATALOG', { url });
    }
    if (
      url.endsWith('quick-tips') ||
      (url.includes('quick-tips') && isNaN(id))
    ) {
      return navigate('STUDENTFOCUSSHOW', { type: 'quick-tips', url });
    }
    if (url.includes('quick-tips')) {
      return navigate('VIDEOPLAYER', { id });
    }
    if (
      url.endsWith('student-reviews') ||
      (url.includes('student-reviews') && isNaN(id))
    ) {
      return navigate('STUDENTFOCUSSHOW', { type: 'student-review', url });
    }
    if (url.includes('student-reviews')) {
      return navigate('VIDEOPLAYER', { id });
    }
    if (
      url.endsWith('question-and-answer') ||
      (url.includes('question-and-answer') && isNaN(id))
    ) {
      return navigate('STUDENTFOCUSSHOW', { type: 'question-and-answer', url });
    }
    if (url.includes('question-and-answer')) {
      return navigate('VIDEOPLAYER', { id });
    }
    if (url.endsWith('podcasts') || (url.includes('podcasts') && isNaN(id))) {
      return navigate('STUDENTFOCUSSHOW', { type: 'podcasts', url });
    }
    if (url.includes('podcasts')) {
      return navigate('VIDEOPLAYER', { id });
    }
    if (
      url.endsWith('boot-camps') ||
      (url.includes('boot-camps') && isNaN(id))
    ) {
      return navigate('STUDENTFOCUSSHOW', { type: 'boot-camps', url });
    }
    if (url.includes('boot-camps')) {
      return navigate('VIDEOPLAYER', { id });
    }
    if (url.includes('courses')) {
      if (url.split('/').length - 1 === 6) {
        return navigate('PATHOVERVIEW', { data: { id }, isMethod: false });
      }
      return navigate('VIDEOPLAYER', { id });
    }
    if (url.includes('songs')) {
      if (url.split('/').length - 1 === 6) {
        return navigate('PATHOVERVIEW', { data: { id }, isMethod: false });
      }
      return navigate('VIDEOPLAYER', { id });
    }
    if (url.endsWith('lists')) {
      return navigate('MYLIST', { url });
    }
    if (url.includes('learning-paths')) {
      if (url.includes('pianote-method')) {
        if (url.split('/').length - 1 === 6 && isNaN(id)) {
          return navigate('METHODLEVEL', {
            url:
              commonService.rootUrl +
              '/musora-api/members/learning-paths' +
              url.substr(url.indexOf('/pianote-method'))
          });
        }
        if (url.split('/').length - 1 === 6) {
          return navigate('METHOD');
        }
        if (url.split('/').length - 1 === 8) {
          return navigate('PATHOVERVIEW', {
            data: {
              mobile_app_url:
                commonService.rootUrl +
                '/musora-api/members/learning-path-courses/' +
                id
            },
            isMethod: true
          });
        }
        return navigate('VIDEOPLAYER', {
          url:
            commonService.rootUrl +
            '/musora-api/members/learning-path-lesson/' +
            id
        });
      } else if (url.includes('foundations')) {
        if (url.split('/').length - 1 === 6) {
          return navigate('FOUNDATIONS');
        }
        if (url.split('/').length - 1 === 8) {
          let cutId = url.slice(0, url.lastIndexOf('/'));
          let slug = cutId.substr(cutId.lastIndexOf('/') + 1, cutId.length);

          return navigate('PATHOVERVIEW', {
            data: {
              mobile_app_url:
                commonService.rootUrl +
                '/musora-api/members/learning-path-levels/foundations-2019/' +
                slug
            },
            isFoundations: true
          });
        }
        return navigate('VIDEOPLAYER', {
          url:
            commonService.rootUrl +
            '/musora-api/members/learning-path-lessons/' +
            id
        });
      }
    }
  }

  // links that should work for both pack and edge users
  if (url.endsWith('lists?state=started')) {
    return navigate('SEEALL', {
      title: 'In Progress',
      parent: 'My List'
    });
  }
  if (url.endsWith('lists?state=completed')) {
    return navigate('SEEALL', {
      title: 'Completed',
      parent: 'My List'
    });
  }
  if (url.includes('profile/notifications')) {
    return navigate('PROFILE', { url });
  }
  if (url.includes('profile') && !url.includes('lists')) {
    return navigate('PROFILE', { url });
  }
  if (url.includes('search')) {
    return navigate('SEARCH', { url });
  }
  if (url.endsWith('packs')) {
    return navigate('PACKS');
  }
  if (url.includes('packs') && !isNaN(id)) {
    if (url.split('/').length - 1 === 8)
      return navigate('SINGLEPACK', {
        url: commonService.rootUrl + '/musora-api/members/pack/' + id
      });
    return navigate('VIDEOPLAYER', {
      url: commonService.rootUrl + '/musora-api/content/' + id
    });
  }
  if (url.includes('packs') && isNaN(id)) {
    if (url.split('/').length - 1 === 5)
      return navigate('SINGLEPACK', {
        url:
          commonService.rootUrl +
          '/musora-api' +
          url.substr(url.indexOf('/members'))
      });
  }
}

// add other navigation functions that you need and export them

export default {
  decideWhereToRedirect
};
