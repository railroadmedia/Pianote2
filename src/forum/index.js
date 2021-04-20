import React from 'react';
import { Easing, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import CreateDiscussion from './src/components/CreateDiscussion';
import Discussions from './src/components/Discussions';

import { arrowLeft } from './src/assets/svgs';

const Stack = createStackNavigator();

const timingAnim = {
  animation: 'timing',
  config: { duration: 250, easing: Easing.out(Easing.circle) }
};

export default ({ route: { params } }) => (
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      gestureEnabled: false,
      transitionSpec: { open: timingAnim, close: timingAnim },
      headerStyle: {
        backgroundColor: params.isDark ? '#00101d' : 'white',
        elevation: 0,
        shadowColor: 'transparent'
      },
      headerTintColor: params.isDark ? 'white' : 'black',
      headerBackTitleVisible: false,
      headerTitleStyle: {
        fontFamily: 'OpenSans',
        fontSize: 20,
        fontWeight: '900'
      },
      headerLeft: () => (
        <TouchableOpacity
          style={{ paddingHorizontal: 15 }}
          onPress={navigation.goBack}
        >
          {arrowLeft({ height: 20, fill: params.isDark ? 'white' : 'black' })}
        </TouchableOpacity>
      )
    })}
  >
    <Stack.Screen
      name='Discussions'
      component={Discussions}
      options={{ title: 'Forums' }}
      initialParams={params}
    />
    <Stack.Screen
      name='CreateDiscussion'
      component={CreateDiscussion}
      initialParams={params}
      options={{ title: 'Create Discussion' }}
    />
  </Stack.Navigator>
);
