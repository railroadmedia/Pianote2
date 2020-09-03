import commonService from './common.service';

const rootUrl = 'http://app.staging';
export default {
    getContent: async function (id) {
        return commonService.tryCall(
            `http://app-staging.pianote.com/api/content/221215`,
        );
    },
};
