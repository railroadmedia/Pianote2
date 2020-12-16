const songsCacheReducer = (state = null, { type, songs }) => {
  switch (type) {
    case 'SONGS':
      return songs;
    default:
      return state;
  }
};

export default { songsCache: songsCacheReducer };
