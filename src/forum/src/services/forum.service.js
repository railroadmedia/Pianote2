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
  return new Promise(res => setTimeout(() => res([]), 2000));
};
export const getAllThreads = function (discussionId, page = 1) {
  return this.tryCall(
    `${this.rootUrl}/forums/api/thread/index?page=${page}&category_id=${
      discussionId || ''
    }`
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
