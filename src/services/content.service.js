import commonService from './common.service';

export default {
  getContent: async function (id, getLessonsVideos) {
    return commonService.tryCall(
      `${commonService.rootUrl}/api/content/${id}${
        getLessonsVideos ? '?download=true' : ''
      }`
    );
  }
};
