import commonService from './common.service';

export default {
  getComments: async function (id, sortBy, limit) {
    let url = `${commonService.rootUrl}/api/railcontent/comments?content_id=${id}&limit=${limit}`;
    if (sortBy === 'Popular') {
      url += `&sort=-like_count`;
    } else if (sortBy === 'Newest') {
      url += `&sort=-created_on`;
    } else if (sortBy === 'Oldest') {
      url += `&sort=created_on`;
    } else if (sortBy === 'Mine') {
      url += `&sort=-mine`;
    }
    return commonService.tryCall({ url });
  },
  getComment: async function (commendId) {
    return commonService.tryCall({
      url: `${commonService.rootUrl}/api/railcontent/comment/${commendId}`
    });
  },
  addComment: async function (commentText, contentId) {
    return commonService.tryCall({
      url: `${commonService.rootUrl}/api/railcontent/comment?comment=${commentText}&content_id=${contentId}`,
      method: 'PUT'
    });
  },
  likeComment: async function (id) {
    return commonService.tryCall({
      url: `${commonService.rootUrl}/api/railcontent/comment-like/${id}`,
      method: 'PUT'
    });
  },
  dislikeComment: async function (id) {
    return commonService.tryCall({
      url: `${commonService.rootUrl}/api/railcontent/comment-like/${id}`,
      method: 'DELETE'
    });
  },
  addReplyToComment: async function (replyText, comentId) {
    return commonService.tryCall({
      url: `${commonService.rootUrl}/api/railcontent/comment/reply?comment=${replyText}&parent_id=${comentId}`,
      method: 'PUT'
    });
  },
  getCommentLikes: async function (commentId) {
    return commonService.tryCall({
      url: `${commonService.rootUrl}/api/railcontent/comment-likes/${commentId}`
    });
  },
  deleteComment: async function (commentId) {
    return commonService.tryCall({
      url: `${commonService.rootUrl}/api/railcontent/comment/${commentId}`,
      method: 'DELETE'
    });
  }
};
