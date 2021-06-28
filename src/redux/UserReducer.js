import { SET_USER } from './UserActions';

const INITIAL_STATE = {
  user: {}
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default userReducer;
