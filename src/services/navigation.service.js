// NavigationService.js

import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  try {
    _navigator.dispatch(
      NavigationActions.navigate({
        type: NavigationActions.NAVIGATE,
        routeName,
        params
      })
    );
  } catch (error) {
    console.log(error);
  }
}

function reset(routeName, params) {
  try {
    _navigator.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: routeName,
            params
          })
        ]
      })
    );
  } catch (error) {
    console.log(error);
  }
}

// add other navigation functions that you need and export them

export default {
  navigate,
  reset,
  setTopLevelNavigator
};
