import React, { useContext } from 'react';
import { Easing, KeyboardAvoidingView, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import CRUD from './src/components/CRUD';
import Threads from './src/components/Threads';
import Thread from './src/components/Thread';
import Forums from './src/components/Forums';
import Search from './src/commons/Search.js';

import NavigationHeader from './src/commons/NavigationHeader';

import { setForumService } from './src/services/forum.service';

import threadsReducer from './src/redux/ThreadReducer';

const store = createStore(combineReducers({ ...threadsReducer }));
const Stack = createStackNavigator();
const timingAnim = {
  animation: 'timing',
  config: { duration: 250, easing: Easing.out(Easing.circle) }
};

export default ({
  route: {
    params,
    params: { tryCall, rootUrl, NetworkContext, isDark }
  }
}) => {
  const networkContext = useContext(NetworkContext);
  setForumService({ tryCall, rootUrl, networkContext, NetworkContext });
  return (
    <Provider store={store}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: isDark ? '#00101d' : 'white' }}
      >
        <Stack.Navigator
          headerMode={'screen'}
          screenOptions={{
            gestureEnabled: false,
            transitionSpec: { open: timingAnim, close: timingAnim }
          }}
        >
          <Stack.Screen
            name='Forums'
            component={Forums}
            options={props => ({
              header: () => <NavigationHeader {...props} title={'Forums'} />
            })}
            initialParams={params}
          />
          <Stack.Screen
            name='Threads'
            component={Threads}
            options={props => ({
              header: () => (
                <NavigationHeader {...props} title={props.route.params.title} />
              )
            })}
            initialParams={params}
          />
          <Stack.Screen
            name='CRUD'
            component={CRUD}
            initialParams={params}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Thread'
            component={Thread}
            initialParams={params}
            options={props => ({
              header: () => <NavigationHeader {...props} />
            })}
          />
          <Stack.Screen
            name='Search'
            component={Search}
            initialParams={params}
          />
        </Stack.Navigator>
      </KeyboardAvoidingView>
    </Provider>
  );
};
