export const SET_USER = 'SET_USER';

export const setLoggedInUser = user => ({
  type: SET_USER,
  payload: user
});
