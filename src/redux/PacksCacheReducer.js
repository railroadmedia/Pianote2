const packsCacheReducer = (state = null, { type, packs }) => {
  switch (type) {
    case 'PACKS':
      return packs;
    default:
      return state;
  }
};

export default { packsCache: packsCacheReducer };
