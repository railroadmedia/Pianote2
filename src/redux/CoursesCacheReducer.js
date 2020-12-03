const coursesCacheReducer = (state = null, { type, courses }) => {
  switch (type) {
    case 'COURSES':
      return courses;
    default:
      return state;
  }
};

export default { coursesCache: coursesCacheReducer };
