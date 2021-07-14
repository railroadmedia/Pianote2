import IUserState from './IUserState';
import { SetLoggedInUserActionType, UserAction } from './UserActions';
import IUser from '../model/IUser';

const userReducer = (
  state: IUserState = { user: {} as IUser },
  action: UserAction
): IUserState => {
  switch (action.type) {
    case SetLoggedInUserActionType:
      return { ...state, user: action.user };
    default:
      return state;
  }
};

export default userReducer;
