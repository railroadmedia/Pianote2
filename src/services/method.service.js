import commonService from './common.service';

export default {
  getMethod: async function () {
    return commonService.tryCall(
      `${commonService.rootUrl}/api/members/learning-paths/pianote-method`
    );
  },
  getMethodContent: function (url) {
    return commonService.tryCall(url);
  }
};
