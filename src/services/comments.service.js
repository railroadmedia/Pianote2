import commonService from './common.service';

export default {
  getComments: async function (id, sortBy, limit) {
    let reqUrl = `${commonService.rootUrl}/api/railcontent/comments?content_id=${id}&limit=${limit}`;
    if (sortBy === 'Popular') {
      reqUrl += `&sort=-like_count`;
    } else if (sortBy === 'Newest') {
      reqUrl += `&sort=-created_on`;
    } else if (sortBy === 'Oldest') {
      reqUrl += `&sort=created_on`;
    } else if (sortBy === 'Mine') {
      reqUrl += `&sort=-mine`;
    }
    return commonService.tryCall(reqUrl);
  },
  addComment: async function (commentText, contentId) {
    return commonService.tryCall(
      `${commonService.rootUrl}/api/railcontent/comment?comment=${commentText}&content_id=${contentId}`,
      'PUT'
    );
  },
  likeComment: async function (id) {
    return commonService.tryCall(
      `${commonService.rootUrl}/api/railcontent/comment-like/${id}`,
      'PUT'
    );
  },
  dislikeComment: async function (id) {
    return commonService.tryCall(
      `${commonService.rootUrl}/api/railcontent/comment-like/${id}`,
      'DELETE'
    );
  },
  addReplyToComment: async function (replyText, comentId) {
    return commonService.tryCall(
      `${commonService.rootUrl}/api/railcontent/comment/reply?comment=${replyText}&parent_id=${comentId}`,
      'PUT'
    );
  },
  getCommentLikes: async function (commentId) {
    return commonService.tryCall(
      `${commonService.rootUrl}/api/railcontent/comment-likes/${commentId}`
    );
  },
  deleteComment: async function (commentId) {
    return commonService.tryCall(
      `${commonService.rootUrl}/api/railcontent/comment/${commentId}`,
      'DELETE'
    );
  }
};
