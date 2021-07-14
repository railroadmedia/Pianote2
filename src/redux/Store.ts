import {
  createStore,
  combineReducers,
  Dispatch,
  Store,
  CombinedState,
  AnyAction
} from 'redux';
import IUserState from './IUserState';
import { UserAction } from './UserActions';
import userReducer from './UserReducer';

export interface IAppState {
  userState: IUserState;
}

export type AppAction = UserAction;

export type AppDispatch = Dispatch<AppAction>;

const configureStore = (): Store<CombinedState<IAppState>, AnyAction> =>
  createStore(
    combineReducers<IAppState>({
      userState: userReducer
    })
  );

export { configureStore };
