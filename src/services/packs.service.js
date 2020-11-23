import commonService from './common.service';

export default {
  allPacks: async function () {
    return commonService.tryCall(`${commonService.rootUrl}/api/members/packs`);
  },
  getPack: async function (url, getLessonsVideos) {
    return commonService.tryCall(
      `${url}${getLessonsVideos ? '?download=true' : ''}`
    );
  }
};
