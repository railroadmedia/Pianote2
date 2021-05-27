import React, { useContext } from 'react';
import {
  Easing,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import CRUD from './src/components/CRUD';
import Threads from './src/components/Threads';
import Thread from './src/components/Thread';
import Discussions from './src/components/Discussions';

import NavigationHeader from './src/commons/NavigationHeader';

import { setForumService } from './src/services/forum.service';

const Stack = createStackNavigator();

const timingAnim = {
  animation: 'timing',
  config: { duration: 250, easing: Easing.out(Easing.circle) }
};

export default ({
  navigation: { navigate },
  route: {
    params,
    params: { tryCall, rootUrl, NetworkContext, isDark, loggesInUserId }
  }
}) => {
  const networkContext = useContext(NetworkContext);
  setForumService({ tryCall, rootUrl, networkContext, NetworkContext });
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: isDark ? '#00101d' : 'white' }}
    >
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          gestureEnabled: false,
          transitionSpec: { open: timingAnim, close: timingAnim }
        })}
      >
        <Stack.Screen
          name='Discussions'
          component={Discussions}
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
          options={props => ({
            header: () => (
              <NavigationHeader {...props} title={props.route.params.action} />
            )
          })}
        />
        <Stack.Screen name='Thread' component={Thread} initialParams={params} />
      </Stack.Navigator>
    </KeyboardAvoidingView>
  );
};
