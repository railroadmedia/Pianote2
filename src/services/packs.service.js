import commonService from './common.service';

const rootUrl = 'http://app-staging.pianote.com/api';
export default {
    allPacks: async function () {
        return commonService.tryCall(`${rootUrl}/members/packs`);
    },
    getPack: async function (url) {
        return commonService.tryCall(url);
    },
};
