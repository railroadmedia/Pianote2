import commonService from './common.service';

export default {
    getContent: async function (id) {
        return commonService.tryCall(
            `${commonService.rootUrl}/api/content/${id}`,
        );
    },
};
