import commonService from './common.service';

export default {
  getMethod: async function () {
    return commonService.tryCall(
      `${commonService.rootUrl}/musora-api/learning-paths/pianote-method`
    );
  },
  getMethodContent: function (url) {
    return commonService.tryCall(url);
  }
};
