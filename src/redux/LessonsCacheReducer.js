const lessonsCacheReducer = (state = null, { type, lessons }) => {
  switch (type) {
    case 'LESSONS':
      return lessons;
    default:
      return state;
  }
};

export default { lessonsCache: lessonsCacheReducer };
