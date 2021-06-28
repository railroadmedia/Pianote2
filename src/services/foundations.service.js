import commonService from './common.service';

export default {
  getFoundation: async function (slug) {
    return commonService.tryCall(
      `${commonService.rootUrl}/musora-api/learning-paths/${slug}`
    );
  },
  getUnit: function (url) {
    return commonService.tryCall(url);
  }
};
