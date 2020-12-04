const quickTipsCacheReducer = (state = null, { type, quickTips }) => {
  switch (type) {
    case 'QUICKTIPS':
      return quickTips;
    default:
      return state;
  }
};

export default { quickTipsCache: quickTipsCacheReducer };
