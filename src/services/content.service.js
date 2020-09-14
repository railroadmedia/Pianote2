import commonService from './common.service';

const rootUrl = 'http://app-staging.pianote.com/api';
export default {
    getContent: async function (id) {
        return commonService.tryCall(`${rootUrl}/content/259648`);
    },
};
