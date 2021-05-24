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

import HeaderMenu from './src/commons/HeaderMenu';

import { arrowLeft } from './src/assets/svgs';

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
    params: { tryCall, rootUrl, NetworkContext, isDark }
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
          transitionSpec: { open: timingAnim, close: timingAnim },
          headerStyle: {
            backgroundColor: isDark ? '#00101d' : 'white',
            elevation: 0,
            shadowColor: 'transparent'
          },
          headerTintColor: isDark ? 'white' : 'black',
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
                fill: isDark ? 'white' : 'black'
              })}
            </TouchableOpacity>
          )
        })}
      >
        <Stack.Screen
          name='Discussions'
          component={Discussions}
          options={{
            title: 'Forums',
            headerRight: () => (
              <HeaderMenu
                isDark={isDark}
                onForumRules={() => navigate('Thread', { forumRules: true })}
              />
            )
          }}
          initialParams={params}
        />
        <Stack.Screen
          name='Threads'
          component={Threads}
          options={({ route: { params } }) => ({
            title: params.title,
            headerRight: () => (
              <HeaderMenu
                isDark={isDark}
                onForumRules={() => navigate('Thread', { forumRules: true })}
              />
            )
          })}
          initialParams={params}
        />
        <Stack.Screen
          name='CRUD'
          component={CRUD}
          initialParams={params}
          options={{ title: 'Create Discussion', headerShown: false }}
        />
        <Stack.Screen
          name='Thread'
          component={Thread}
          options={({ navigation, route: { params } }) => ({
            headerRight: () => (
              <HeaderMenu
                title={params.title}
                isDark={isDark}
                locked={params.locked}
                pinned={params.pinned}
                is_followed={params.is_followed}
                id={params.id}
                onEdit={() =>
                  navigate('CRUD', { type: 'edit', threadId: params.threadId })
                }
                onForumRules={() => navigate('Thread', { forumRules: true })}
                setHeaderTitle={headerTitle =>
                  navigation.setOptions({ headerTitle })
                }
              />
            )
          })}
          initialParams={params}
        />
      </Stack.Navigator>
    </KeyboardAvoidingView>
  );
};
