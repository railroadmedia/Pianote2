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

import { arrowLeft } from './src/assets/svgs';

import { setForumService } from './src/services/forum.service';

const Stack = createStackNavigator();

const timingAnim = {
  animation: 'timing',
  config: { duration: 250, easing: Easing.out(Easing.circle) }
};

export default ({
  route: {
    params,
    params: { tryCall, rootUrl, NetworkContext }
  }
}) => {
  const networkContext = useContext(NetworkContext);
  setForumService({ tryCall, rootUrl, networkContext, NetworkContext });
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
          name='Threads'
          component={Threads}
          options={{ title: 'Threads' }}
          initialParams={params}
        />
        <Stack.Screen
          name='CRUD'
          component={CRUD}
          initialParams={params}
          options={{ title: 'Create Discussion' }}
        />
        <Stack.Screen
          name='Thread'
          component={Thread}
          options={({ route: { params } }) => ({ title: params.title })}
          initialParams={params}
        />
      </Stack.Navigator>
    </KeyboardAvoidingView>
  );
};
