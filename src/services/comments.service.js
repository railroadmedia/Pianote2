import commonService from './common.service';

const rootUrl = 'https://app-staging.pianote';
export default {
    getComments: async function (id, sortBy, limit) {
        // TODO change hardcoded id
        let reqUrl = `${rootUrl}/api/railcontent/comments?content_id=264204&limit=${limit}`;
        if (sortBy === 'popular') {
            reqUrl += `&sort=-like_count`;
        } else if (sortBy === 'latest') {
            reqUrl += `&sort=-created_on`;
        } else if (sortBy === 'oldest') {
            reqUrl += `&sort=created_on`;
        } else if (sortBy === 'my_comments') {
            reqUrl += `&sort=-mine`;
        }
        return commonService.tryCall(reqUrl);
    },
    addComment: async function (commentText, contentId) {
        return commonService.tryCall(
            `${rootUrl}/api/railcontent/comment?comment=${commentText}&content_id=${264204}`,
            'PUT',
        );
    },
    likeComment: async function (id) {
        return commonService.tryCall(
            `${rootUrl}/api/railcontent/comment-like/${id}`,
            'PUT',
        );
    },
    dislikeComment: async function (id) {
        return commonService.tryCall(
            `${rootUrl}/api/railcontent/comment-like/${id}`,
            'DELETE',
        );
    },
    addReplyToComment: async function (replyText, comentId) {
        return commonService.tryCall(
            `${rootUrl}/api/railcontent/comment/reply?comment=${replyText}&parent_id=${comentId}`,
            'PUT',
        );
    },
    getCommentLikes: async function (commentId) {
        return commonService.tryCall(
            `${rootUrl}/api/railcontent/comment-likes/${commentId}`,
        );
    },
    deleteComment: async function (commentId) {
        return commonService.tryCall(
            `${rootUrl}/api/railcontent/comment/${commentId}`,
            'DELETE',
        );
    },
};
