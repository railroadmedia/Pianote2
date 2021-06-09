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
export const getForums = function () {
  return this.tryCall(`${this.rootUrl}/forums/api/discussions/index`);
};
export const getAllThreads = function (forumId, page = 1) {
  return this.tryCall(
    `${this.rootUrl}/forums/api/thread/index?page=${page}&category_id=${
      forumId || ''
    }`
  );
};
export const getThread = function (threadId, page = 1) {
  return this.tryCall(
    `${this.rootUrl}/forums/api/thread/show/${threadId}?page=${page}`
  );
};
export const search = function (text) {
  return this.tryCall(`${this.rootUrl}/forums/api/search?term=${text}`);
};
export const followThread = function (id) {
  return this.tryCall(`${this.rootUrl}/forums/api/thread/follow/${id}`, 'PUT');
};
export const unfollowThread = function (id) {
  return this.tryCall(
    `${this.rootUrl}/forums/api/thread/unfollow/${id}`,
    'DELETE'
  );
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
export const getFollowedThreads = function (forumId, page = 1) {
  return this.tryCall(
    `${
      this.rootUrl
    }/forums/api/thread/index?page=${page}&followed=1&category_id=${
      forumId || ''
    }`
  );
};
export const likePost = function (id) {
  return this.tryCall(`${this.rootUrl}/forums/api/post/like/${id}`, 'PUT');
};
export const disLikePost = function (id) {
  return this.tryCall(`${this.rootUrl}/forums/api/post/unlike/${id}`, 'DELETE');
};
export const reportPost = function (id) {
  return this.tryCall(`${this.rootUrl}/forums/api/post/report/${id}`, 'PUT');
};
export const createPost = function (body) {
  return this.tryCall(`${this.rootUrl}/forums/api/post/store`, 'PUT', body);
};
export const editPost = function (id, content) {
  return this.tryCall(`${this.rootUrl}/forums/api/post/update/${id}`, 'PATCH', {
    content
  });
};
export const deletePost = function (id) {
  return this.tryCall(`${this.rootUrl}/forums/api/post/delete/${id}`, 'DELETE');
};
