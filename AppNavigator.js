/**
 *  Router
 */
import { Animated, Dimensions, Easing } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// content
import StudentFocusCatalog from './src/views/content/StudentFocusCatalog';
import StudentFocusShow from './src/views/content/StudentFocusShow';
import VideoPlayerSong from './src/views/content/VideoPlayerSong';
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
import Packs from './src/views/content/Packs';
import Method from './src/views/content/Method';
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

const AppNavigator = createStackNavigator(
  {
    initialRoute: LoadPage,

    // user
    NOTIFICATIONSETTINGS: { screen: NotificationSettings },
    PROFILESETTINGS: {
      screen: ProfileSettings,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    PRIVACYPOLICY: { screen: PrivacyPolicy },
    SETTINGS: { screen: Settings },
    PROFILE: { screen: Profile },
    SUPPORT: { screen: Support },
    TERMS: { screen: Terms },

    // content
    STUDENTFOCUSCATALOG: { screen: StudentFocusCatalog },
    STUDENTFOCUSSHOW: { screen: StudentFocusShow },
    VIDEOPLAYERSONG: { screen: VideoPlayerSong },
    METHODLEVEL: { screen: MethodLevel },
    METHOD: { screen: Method },
    FOUNDATIONS: { screen: Foundations },
    PATHOVERVIEW: { screen: PathOverview },
    SONGCATALOG: { screen: SongCatalog },
    VIDEOPLAYER: {
      screen: VideoPlayer,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    SINGLEPACK: { screen: SinglePack },
    DOWNLOADS: { screen: Downloads },
    LESSONS: { screen: Lessons },
    SEEALL: { screen: SeeAll },
    COURSE: { screen: Course },
    MYLIST: { screen: MyList },
    SEARCH: { screen: Search },
    PACKS: { screen: Packs },

    // onboard
    MEMBERSHIPEXPIRED: { screen: MembershipExpired },
    LOGINCREDENTIALS: { screen: LoginCredentials },
    SUPPORTSIGNUP: { screen: SupportSignUp },
    FORGOTPASSWORD: { screen: ForgotPassword },
    CREATEACCOUNT2: { screen: CreateAccount2 },
    CREATEACCOUNT3: {
      screen: CreateAccount3,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    NEWMEMBERSHIP: { screen: NewMembership },
    CREATEACCOUNT: { screen: CreateAccount },
    GETRESTARTED: { screen: GetRestarted },
    WELCOMEBACK: { screen: WelcomeBack },
    LOADPAGE: { screen: LoadPage },
    LOGIN: { screen: Login },
    RESETPASSWORD: { screen: ResetPassword }
  },
  {
    headerMode: 'screen',
    mode: 'card',
    defaultNavigationOptions: {
      gesturesEnabled: true,
      // if you want to change the back swipe width
      //just put the number, e.g. 100 would be fine to get the iOS effect
      gestureResponseDistance: {
        horizontal: Dimensions.get('window').width
      }
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
        useNativeDriver: true
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const width = layout.initWidth;
        const translateX = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [width, 0, 0]
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1]
        });

        return { opacity, transform: [{ translateX }] };
      }
    })
  }
);

export default createAppContainer(AppNavigator);
