import commonService from './common.service';

export default {
  getFoundation: async function (slug) {
    return commonService.tryCall(
      `${commonService.rootUrl}/api/members/learning-paths/${slug}`
    );
  },
  getUnit: function (url) {
    return commonService.tryCall(url);
  },
  getUnitLesson: function (url) {
    return commonService.tryCall(url);
  }
};
