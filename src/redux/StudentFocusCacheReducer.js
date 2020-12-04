const studentFocusCacheReducer = (state = null, { type, studentFocus }) => {
  switch (type) {
    case 'STUDENTFOCUS':
      return studentFocus;
    default:
      return state;
  }
};

export default { studentFocusCache: studentFocusCacheReducer };
