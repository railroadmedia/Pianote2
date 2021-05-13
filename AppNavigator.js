/**
 *  Router
 */
import React from 'react';
import { Dimensions, Easing } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Forum from './src/forum/index';

// content
import StudentFocusCatalog from './src/views/content/StudentFocusCatalog';
import StudentFocusShow from './src/views/content/StudentFocusShow';
import VideoPlayerSong from './src/views/content/VideoPlayerSong';
import Schedule from './src/views/content/Schedule';
import VideoPlayer from './src/views/content/VideoPlayer';
import SongCatalog from './src/views/content/SongCatalog';
import PathOverview from './src/views/content/PathOverview';
import SinglePack from './src/views/content/SinglePack';
import Downloads from './src/views/content/Downloads';
import Lessons from './src/views/content/Lessons';
import SeeAll from './src/views/content/SeeAll';
import Course from './src/views/content/Course';
import MyList from './src/views/content/MyList';
import Search from './src/views/content/Search';
import Method from './src/views/content/Method';
import Packs from './src/views/content/Packs';
import Live from './src/views/content/Live';
import MethodLevel from './src/views/content/MethodLevel';
import Foundations from './src/views/content/Foundations';

// onboard
import MembershipExpired from './src/views/onboard/MembershipExpired';
import LoginCredentials from './src/views/onboard/LoginCredentials';
import CreateAccount2 from './src/views/onboard/CreateAccount2';
import CreateAccount3 from './src/views/onboard/CreateAccount3';
import ForgotPassword from './src/views/onboard/ForgotPassword';
import NewMembership from './src/views/onboard/NewMembership';
import CreateAccount from './src/views/onboard/CreateAccount';
import SupportSignUp from './src/views/onboard/SupportSignUp';
import WelcomeBack from './src/views/onboard/WelcomeBack';
import GetRestarted from './src/views/onboard/GetRestarted';
import LoadPage from './src/views/onboard/LoadPage';
import Login from './src/views/onboard/Login';
import ResetPassword from './src/views/onboard/ResetPassword';
// user
import NotificationSettings from './src/views/user/NotificationSettings';
import ProfileSettings from './src/views/user/ProfileSettings';
import PrivacyPolicy from './src/views/user/PrivacyPolicy';
import Settings from './src/views/user/Settings';
import Profile from './src/views/user/Profile';
import Support from './src/views/user/Support';
import Terms from './src/views/user/Terms';
import NetworkProvider from './src/context/NetworkProvider';
import Catalogue from './src/views/content/Catalogue';
import OrientationProvider from './src/context/OrientationProvider';
import CombinedContexts from './src/context/CombinedContexts';

import NavMenuHeaders from './src/components/NavMenuHeaders';
import NavigationBar from './src/components/NavigationBar';

const Stack = createStackNavigator();

const navigationRef = React.createRef();

export function navigate(name, params = {}) {
  navigationRef.current?.navigate(name, params);
}

export function reset(name, params) {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name, params }]
  });
}

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}

export function currentScene() {
  return navigationRef.current?.getCurrentRoute().name;
}

export function currentParams() {
  return navigationRef.current?.getCurrentRoute().params;
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function refreshOnFocusListener() {
  let reFocused;
  return this.props.navigation?.addListener('focus', () =>
    reFocused ? this.refresh?.() : (reFocused = true)
  );
}

const timingAnim = {
  animation: 'timing',
  config: { duration: 250, easing: Easing.out(Easing.circle) }
};

export default () => (
  <NetworkProvider>
    <OrientationProvider>
      <CombinedContexts>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            headerMode={'screen'}
            mode={'card'}
            keyboardHandlingEnabled={false}
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              gestureResponseDistance: {
                horizontal: Dimensions.get('window').width
              },
              transitionSpec: { open: timingAnim, close: timingAnim }
            }}
          >
            {/* onboard */}
            <Stack.Screen name='LOADPAGE' component={LoadPage} />
            <Stack.Screen name='LOGIN' component={Login} />
            <Stack.Screen
              name='MEMBERSHIPEXPIRED'
              component={MembershipExpired}
            />
            <Stack.Screen
              name='LOGINCREDENTIALS'
              component={LoginCredentials}
            />
            <Stack.Screen name='SUPPORTSIGNUP' component={SupportSignUp} />
            <Stack.Screen name='FORGOTPASSWORD' component={ForgotPassword} />
            <Stack.Screen name='CREATEACCOUNT2' component={CreateAccount2} />
            <Stack.Screen
              name='CREATEACCOUNT3'
              component={CreateAccount3}
              options={{
                gestureEnabled: false
              }}
            />
            <Stack.Screen name='CREATEACCOUNT' component={CreateAccount} />
            <Stack.Screen name='NEWMEMBERSHIP' component={NewMembership} />
            <Stack.Screen name='GETRESTARTED' component={GetRestarted} />
            <Stack.Screen name='WELCOMEBACK' component={WelcomeBack} />
            <Stack.Screen name='RESETPASSWORD' component={ResetPassword} />
            {/* user */}
            <Stack.Screen
              name='NOTIFICATIONSETTINGS'
              component={NotificationSettings}
            />
            <Stack.Screen
              name='PROFILESETTINGS'
              component={ProfileSettings}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name='PRIVACYPOLICY' component={PrivacyPolicy} />
            <Stack.Screen name='SETTINGS' component={Settings} />
            <Stack.Screen name='PROFILE' component={Profile} />
            <Stack.Screen name='SUPPORT' component={Support} />
            <Stack.Screen name='TERMS' component={Terms} />
            {/* content */}
            {/* <Stack.Screen
              name='STUDENTFOCUSCATALOG'
              component={StudentFocusCatalog}
            /> */}
            {/* <Stack.Screen name='STUDENTFOCUSSHOW' component={StudentFocusShow} /> */}
            <Stack.Screen name='VIDEOPLAYERSONG' component={VideoPlayerSong} />
            <Stack.Screen name='METHODLEVEL' component={MethodLevel} />
            <Stack.Screen name='LIVE' component={Live} />
            <Stack.Screen name='SCHEDULE' component={Schedule} />
            <Stack.Screen name='METHOD' component={Method} />
            <Stack.Screen name='FOUNDATIONS' component={Foundations} />
            <Stack.Screen name='PATHOVERVIEW' component={PathOverview} />
            {/* <Stack.Screen name='SONGCATALOG' component={SongCatalog} /> */}
            <Stack.Screen
              name='VIDEOPLAYER'
              component={VideoPlayer}
              options={{
                gestureEnabled: false
              }}
            />
            <Stack.Screen name='SINGLEPACK' component={SinglePack} />
            <Stack.Screen name='DOWNLOADS' component={Downloads} />
            {/* <Stack.Screen name='HOME' component={Lessons} /> */}
            <Stack.Screen name='SEEALL' component={SeeAll} />
            {/* <Stack.Screen name='COURSE' component={Course} /> */}
            <Stack.Screen name='MYLIST' component={MyList} />
            <Stack.Screen name='SEARCH' component={Search} />
            <Stack.Screen name='PACKS' component={Packs} />
            <Stack.Screen
              name='Forum'
              component={Forum}
              options={{ gestureEnabled: false }}
            />

            <Stack.Screen name='HOME'>
              {props => Navigators('both', 'HOME', props)}
            </Stack.Screen>
            <Stack.Screen name='COURSES'>
              {props => Navigators('both', 'COURSES', props)}
            </Stack.Screen>
            <Stack.Screen name='SONGS'>
              {props => Navigators('both', 'SONGS', props)}
            </Stack.Screen>
            <Stack.Screen name='STUDENTFOCUS'>
              {props => Navigators('both', 'STUDENTFOCUS', props)}
            </Stack.Screen>
            <Stack.Screen name='SHOW'>
              {props => Navigators('bottom', 'SHOW', props)}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </CombinedContexts>
    </OrientationProvider>
  </NetworkProvider>
);

function Navigators(mode, screen, props) {
  return (
    <>
      {!!mode.match(/^(both|top)$/) && (
        <NavMenuHeaders
          isMethod={!!screen.match(/^(HOME)$/)}
          currentPage={screen}
          parentPage={screen}
        />
      )}
      <Catalogue
        {...props}
        onNavigateToCard={navigateTo}
        onNavigateToMethodLesson={navigateTo}
        onNavigateToMethod={(started, completed) =>
          navigate('METHOD', {
            methodIsStarted: started,
            methodIsCompleted: completed
          })
        }
        onNavigateToSeeAll={() =>
          navigate('SEEALL', { title: 'Continue', parent: this.scene })
        }
      />
      {!!mode.match(/^(both|bottom)$/) && (
        <NavigationBar
          currentPage={'HOME'}
          isMethod={!!screen.match(/^(HOME)$/)}
        />
      )}
    </>
  );
}

function navigateTo(card) {
  switch (card.type) {
    case 'show':
      return navigate('SHOW', { showType: card.showType });
    case 'course':
      return navigate('PATHOVERVIEW', {
        data: card,
        isMethod: false
      });
    case 'song':
      if (card.lesson_count === 1)
        return navigate('VIDEOPLAYER', {
          id: card.currentLessonId
        });
      return navigate('PATHOVERVIEW', {
        data: card,
        isMethod: false
      });
    case 'learning-path':
      return navigate('METHOD', {
        url: card.mobile_app_url
      });
    case 'learning-path-level':
      return navigate('METHODLEVEL', {
        url: card.mobile_app_url,
        level: index + 1
      });
    case 'learning-path-course':
      return navigate('PATHOVERVIEW', {
        data: card,
        isMethod: true
      });
    case 'unit':
      return navigate('PATHOVERVIEW', {
        data: card,
        isFoundations: true
      });
    case 'learning-path-lesson':
      return navigate('VIDEOPLAYER', {
        url: card.mobile_app_url
      });
    case 'pack':
      return navigate('SINGLEPACK', {
        url: card.mobile_app_url
      });
    case 'pack-bundle':
      return navigate('SINGLEPACK', {
        url: card.mobile_app_url
      });
    case 'pack-bundle-lesson':
      return navigate('VIDEOPLAYER', {
        url: card.mobile_app_url
      });
    default:
      return navigate('VIDEOPLAYER', {
        id: card.id
      });
  }
}
