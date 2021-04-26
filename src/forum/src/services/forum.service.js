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
  getTopics: function (page = 1) {
    /* TBR */
    return new Promise(res =>
      setTimeout(
        () => res(mocks.topics.slice((page - 1) * 10, page * 10)),
        4000
      )
    );
    /*******/
    return this.tryCall(`${this.rootUrl}/TBD`);
  },
  getFollowed: function (page = 1) {
    /* TBR */
    return new Promise(res =>
      setTimeout(
        () => res(mocks.followed.slice((page - 1) * 10, page * 10)),
        4000
      )
    );
    /*******/
    return this.tryCall(`${this.rootUrl}/TBD`);
  },
  getDiscussions: function () {
    return new Promise(res => res(discussions));
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
  followed: [
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

const discussions = [
  {
    comment:
      'I love this song! Thanks for removing the double treble clef but I am missing the version which is one octave higher. It sounds better in my eyes/ ears. :-) Please please please publish a second full score version. Or am I doing something wrong? Thanks so much!',
    content_id: 298776,
    created_on: '2021-04-20 19:22:43',
    id: 187599,
    is_liked: false,
    like_count: 1,
    replies: [
      {
        comment:
          'This song is awesome, I totally agree!For the full score, I think that this is something that we can look at adding some time in the future. :) ',
        created_on: '2021-04-20 20:25:02',
        id: 187607,
        is_liked: false,
        like_count: 0,
        user: {
          display_name: 'Sam Vesely',
          xp: '0',
          rank: 'Casual',
          access_level: 'team',
          'fields.profile_picture_image_url':
            'https://d2vyvo0tyx8ig5.cloudfront.net/avatars/344840_1609278236577-1609278354-344840.jpg'
        }
      }
    ],
    user: {
      display_name: 'Richard Unger',
      'fields.profile_picture_image_url':
        'https://d2vyvo0tyx8ig5.cloudfront.net/avatars/411372_1609944384220-1609944386-411372.jpg',
      xp: '0',
      rank: 'Casual'
    },
    user_id: 411372
  },
  {
    comment:
      'Just started to learn this song, just to check, bar 23 is F chord right? Love this song..',
    content_id: 298776,
    created_on: '2021-04-20 19:22:43',
    id: 187599,
    is_liked: false,
    like_count: 5,
    replies: [],
    user: {
      display_name: 'Maggie',
      'fields.profile_picture_image_url':
        'https://d2vyvo0tyx8ig5.cloudfront.net/avatars/417188_1615416395888-1615416399-417188.jpg',
      xp: '0',
      rank: 'Casual'
    },
    user_id: 411372
  },
  {
    comment:
      "This song is kind of challenging somehow but I understand am just new on the keyboard someone's attention please thanks ",
    content_id: 298776,
    created_on: '2021-04-20 19:22:43',
    id: 187599,
    is_liked: true,
    like_count: 1,
    user: {
      display_name: '"ankundachristof98187"',
      'fields.profile_picture_image_url':
        'https://d2vyvo0tyx8ig5.cloudfront.net/avatars/411372_1609944384220-1609944386-411372.jpg',
      xp: '0',
      rank: 'Casual'
    },
    user_id: 411372
  }
];
