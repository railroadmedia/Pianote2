import AsyncStorage from '@react-native-community/async-storage';

const threadsReducer = (
  state = { signShown: false },
  { type, threads, thread }
) => {
  switch (type) {
    case 'SETDISCUSSIONS':
      return {
        ...state,
        discussions: Object.assign({}, ...threads.map(t => ({ [t.id]: t })))
      };
    case 'SETALL':
      return {
        ...state,
        all: Object.assign({}, ...threads.map(t => ({ [t.id]: t })))
      };
    case 'SETFOLLOWED':
      return {
        ...state,
        followed: Object.assign({}, ...threads.map(t => ({ [t.id]: t })))
      };
    case 'UPDATE':
      let discussions = {},
        followed = {},
        all = {};
      if (state.all[thread.id]) all = { [thread.id]: thread };
      if (state.discussions[thread.id]) discussions = { [thread.id]: thread };
      if (state.followed[thread.id]) followed = { [thread.id]: thread };
      return {
        ...state,
        all: { ...state.all, ...all },
        discussions: { ...state.discussions, ...discussions },
        followed: { ...state.followed, ...followed }
      };
    case 'TOGGLESIGN':
      AsyncStorage.setItem('signShown', state.signShown ? '' : '1');
      return {
        ...state,
        signShown: !state.signShown
      };
    default:
      return state;
  }
};

export default { threads: threadsReducer };
