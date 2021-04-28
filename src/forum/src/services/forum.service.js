export const setForumService = function (options) {
  // setting tryCall, rootUrl, NetworkContext etc
  Object.assign(this, options);
};
export const getTopic = function (page = 1) {
  /* TBR */
  return new Promise(res =>
    setTimeout(
      () => res(mocks.discussions.slice((page - 1) * 10, page * 10)),
      2000
    )
  );
  /*******/
  return this.tryCall(`${this.rootUrl}/TBD`);
};
export const getTopics = function (page = 1) {
  /* TBR */
  return new Promise(res =>
    setTimeout(() => res(mocks.topics.slice((page - 1) * 10, page * 10)), 2000)
  );
  /*******/
  return this.tryCall(`${this.rootUrl}/TBD`);
};
export const getFollowed = function (page = 1) {
  /* TBR */
  return new Promise(res =>
    setTimeout(
      () => res(mocks.discussions.slice((page - 1) * 10, page * 10)),
      2000
    )
  );
  /*******/
  return this.tryCall(`${this.rootUrl}/TBD`);
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

const mocks = {
  topics: [
    { title: 'General Drum Discussion' },
    { title: 'Drumeo Edge Discussion' },
    { title: 'Student Progress Discussion' },
    { title: 'Drumeo Packs Discussion' },
    { title: 'Name that tune' },
    { title: 'Name that tune' },
    { title: 'Name that tune' },
    { title: 'Name that tune' }
  ].map(({ title }, id) => ({
    id,
    title,
    postsNo: 70,
    lastPost: {
      date: new Date(
        'Wed Apr 19 2021 17:57:00 GMT+0300 (Eastern European Summer Time)'
      ),
      user: {
        name: 'Me'
      }
    },
    image:
      'https://d2vyvo0tyx8ig5.cloudfront.net/avatars/d1dfa3b0-28e5-4042-b6f4-b78c8063c663-1618221945-149628.jpg'
  })),
  discussions: [
    { title: 'Introducing Yourself', pinned: true },
    { title: 'Name that tune' },
    { title: 'The Weekly Weekend Chord Progression Challenge' },
    { title: 'Name that tune' },
    { title: 'Name that tune' },
    { title: 'Name that tune' },
    { title: 'Name that tune' },
    { title: 'Name that tune' }
  ].map(({ title, pinned }, id) => ({
    id,
    pinned,
    title,
    followed: true,
    topicName: 'General',
    repliesNo: 70,
    lastPost: {
      date: new Date(
        'Wed Apr 19 2021 17:57:00 GMT+0300 (Eastern European Summer Time)'
      ),
      user: {
        name: 'Me'
      }
    },
    user: {
      accessLevelName: 'coach',
      avatarUrl:
        'https://d2vyvo0tyx8ig5.cloudfront.net/avatars/d1dfa3b0-28e5-4042-b6f4-b78c8063c663-1618221945-149628.jpg'
    }
  }))
};
