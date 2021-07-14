import IUser from '../model/IUser';

const SetLoggedInUserActionType = 'SET_USER';

interface ISetLoggedInUserAction {
  type: typeof SetLoggedInUserActionType;
  user: IUser;
}

const setLoggedInUser = (user: IUser): ISetLoggedInUserAction => ({
  type: SetLoggedInUserActionType,
  user
});

export type UserAction = ISetLoggedInUserAction;

export { setLoggedInUser, SetLoggedInUserActionType };
