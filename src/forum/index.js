import React from 'react';
import { Easing } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import CreateDiscussion from './src/components/CreateDiscussion';
import Discussions from './src/components/Discussions';

const Stack = createStackNavigator();

const timingAnim = {
  animation: 'timing',
  config: { duration: 250, easing: Easing.out(Easing.circle) }
};

export default props => (
  <Stack.Navigator
    screenOptions={{
      gestureEnabled: false,
      transitionSpec: { open: timingAnim, close: timingAnim },
      headerStyle: { backgroundColor: 'papayawhip' },
      headerTintColor: 'red',
      headerBackTitleVisible: false,
      headerBackTitleStyle: { fontSize: 8 }
    }}
  >
    <Stack.Screen
      name='Discussions'
      component={Discussions}
      options={{ title: 'Forums' }}
      initialParams={props.route.params}
    />
    <Stack.Screen
      name='CreateDiscussion'
      component={CreateDiscussion}
      initialParams={props.route.params}
    />
  </Stack.Navigator>
);
