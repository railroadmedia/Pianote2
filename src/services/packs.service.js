import commonService from './common.service';

export default {
  allPacks: async function () {
    return commonService.tryCall({
      url: `${commonService.rootUrl}/musora-api/packs`
    });
  },
  getPack: async function (url, getLessonsVideos) {
    return commonService.tryCall({
      url: `${url}${getLessonsVideos ? '?download=true' : ''}`
    });
  }
};
