export default {
  updateMessage: function (message) {
    return this.tryCall(`${this.rootUrl}/TBD`, 'PUT', { message });
  }
};
