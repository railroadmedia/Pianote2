import commonService from './common.service';

const rootUrl = 'http://app-staging.pianote.com/api';
export default {
    getFoundation: async function (slug) {
        return commonService.tryCall(
            `${rootUrl}/members/learning-paths/${slug}`,
        );
    },
    getUnit: function (url) {
        return commonService.tryCall(url);
    },
    getUnitLesson: function (url) {
        return commonService.tryCall(url);
    },
};
