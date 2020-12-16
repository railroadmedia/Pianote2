const podcastsCacheReducer = (state = null, { type, podcasts }) => {
  switch (type) {
    case 'PODCASTS':
      return podcasts;
    default:
      return state;
  }
};

export default { podcastsCache: podcastsCacheReducer };
