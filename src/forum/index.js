import React from 'react';
import {
  Easing,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import CreateDiscussion from './src/components/CreateDiscussion';
import Discussions from './src/components/Discussions';
import Edit from './src/components/Edit';

import { arrowLeft } from './src/assets/svgs';

import forumService from './src/services/forum.service';

const Stack = createStackNavigator();

const timingAnim = {
  animation: 'timing',
  config: { duration: 250, easing: Easing.out(Easing.circle) }
};

export default ({ route: { params } }) => {
  forumService.tryCall = params.tryCall;
  forumService.rootUrl = params.rootUrl;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: params.isDark ? '#00101d' : 'white' }}
    >
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
              {arrowLeft({
                height: 20,
                fill: params.isDark ? 'white' : 'black'
              })}
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
        <Stack.Screen
          name='Edit'
          component={Edit}
          options={{ title: 'Edit Reply' }}
          initialParams={params}
        />
      </Stack.Navigator>
    </KeyboardAvoidingView>
  );
};
