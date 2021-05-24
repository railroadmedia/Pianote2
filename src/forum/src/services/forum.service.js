export const setForumService = function (options) {
  // setting tryCall, rootUrl, NetworkContext etc
  Object.assign(this, options);
};
export const connection = function (alert) {
  if (this.networkContext.isConnected) return true;
  if (alert) this.networkContext.showNoConnectionAlert();
};
export const networkContext = function () {
  return this.networkContext;
};
export const NetworkContext = function () {
  return this.NetworkContext;
};

export const getDiscussions = function () {
  return this.tryCall(`${this.rootUrl}/forums/api/discussions/index`);
};
export const getAllThreads = function (discussionId, page = 1) {
  return this.tryCall(
    `${this.rootUrl}/forums/api/thread/index?page=${page}&category_id=${
      discussionId || ''
    }`
  );
};
export const search = function (text) {
  return this.tryCall(`${this.rootUrl}/forums/api/search?term=${text}`);
};
export const followThread = function (id) {
  return this.tryCall(`${this.rootUrl}/forums/api/thread/follow/${id}`);
};
export const unfollowThread = function (id) {
  return this.tryCall(`${this.rootUrl}/forums/api/thread/unfollow/${id}`);
};
export const createThread = function (title, content, category_id) {
  return this.tryCall(`${this.rootUrl}/forums/api/thread/store`, 'PUT', {
    title,
    first_post_content: content,
    category_id
  });
};
export const updateThread = function (id, body) {
  return this.tryCall(
    `${this.rootUrl}/forums/api/thread/update/${id}`,
    'PATCH',
    body
  );
};
export const deleteThread = function (id) {
  return this.tryCall(
    `${this.rootUrl}/forums/api/thread/delete/${id}`,
    'DELETE'
  );
};
export const getDiscussion = function (page = 1) {
  return this.tryCall(`${this.rootUrl}/TBD`);
};
export const getFollowedThreads = function (discussionId, page = 1) {
  return this.tryCall(
    `${
      this.rootUrl
    }/forums/api/thread/index?page=${page}&followed=1&category_id=${
      discussionId || ''
    }`
  );
};
export const likeComment = function (id) {
  return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { id });
};
export const disLikeComment = function (id) {
  return this.tryCall(`${this.rootUrl}/TBD`, 'DELETE', { id });
};
export const updateMessage = function (message) {
  return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { message });
};
export const deleteMessage = function (id) {
  return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { id });
};
export const reportMessage = function (id) {
  return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { id });
};
export const addReply = function (reply) {
  return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { reply });
};
export const createPost = function (content, thread_id) {
  return this.tryCall(`${this.rootUrl}/forums/api/post/store`, 'PUT', {
    data: { content, thread_id }
  });
};
export const editPost = function (id, content) {
  return this.tryCall(`${this.rootUrl}/post/api/update/${id}`, 'PATCH', {
    data: { content }
  });
};
export const deletePost = function (id) {
  return this.tryCall(`${this.rootUrl}/forums/api/post/delete/${id}`, 'DELETE');
};
