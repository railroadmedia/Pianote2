export default {
  updateMessage: function (message) {
    return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { message });
  },
  deleteMessage: function (id) {
    return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { id });
  },
  reportMessage: function (id) {
    return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { id });
  },
  likeComment: function (id) {
    return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { id });
  },
  disLikeComment: function (id) {
    return this.tryCall(`${this.rootUrl}/TBD`, 'DELETE', { id });
  },
  addReply: function (reply) {
    return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { reply });
  }
};
