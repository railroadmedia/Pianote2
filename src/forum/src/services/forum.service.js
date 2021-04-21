export default {
  updateMessage: function (message) {
    return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { message });
  },
  deleteMessage: function (id) {
    return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { id });
  },
  reportMessage: function (id) {
    return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { id });
  }
};
