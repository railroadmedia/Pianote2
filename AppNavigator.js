/**
 *  Router
 */
import {Animated, Dimensions, Easing} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

// content
import StudentFocusCatalog from './src/views/content/StudentFocusCatalog.js';
import StudentFocusShow from './src/views/content/StudentFocusShow.js';
import VideoPlayerSong from './src/views/content/VideoPlayerSong.js';
import FoundationsLevel from './src/views/content/FoundationsLevel.js';
import Foundations from './src/views/content/Foundations';
import VideoPlayer from './src/views/content/VideoPlayer.js';
import SongCatalog from './src/views/content/SongCatalog.js';
import PathOverview from './src/views/content/PathOverview';
import SinglePack from './src/views/content/SinglePack.js';
import Downloads from './src/views/content/Downloads.js';
import Lessons from './src/views/content/Lessons.js';
import Filters from './src/views/content/Filters.js';
import SeeAll from './src/views/content/SeeAll.js';
import Course from './src/views/content/Course.js';
import MyList from './src/views/content/MyList.js';
import Search from './src/views/content/Search.js';
import Packs from './src/views/content/Packs.js';

// onboard
import MembershipExpired from './src/views/onboard/MembershipExpired.js';
import LoginCredentials from './src/views/onboard/LoginCredentials.js';
import CreateAccount2 from './src/views/onboard/CreateAccount2.js';
import CreateAccount3 from './src/views/onboard/CreateAccount3.js';
import ForgotPassword from './src/views/onboard/ForgotPassword.js';
import NewMembership from './src/views/onboard/NewMembership.js';
import CreateAccount from './src/views/onboard/CreateAccount.js';
import SupportSignUp from './src/views/onboard/SupportSignUp.js';
import WelcomeBack from './src/views/onboard/WelcomeBack.js';
import GetRestarted from './src/views/onboard/GetRestarted';
import LoadPage from './src/views/onboard/LoadPage.js';
import Login from './src/views/onboard/Login.js';

// user
import NotificationSettings from './src/views/user/NotificationSettings.js';
import PaymentHistory from './src/views/user/PaymentHistory.js';
import ProfileSettings from './src/views/user/ProfileSettings';
import PrivacyPolicy from './src/views/user/PrivacyPolicy.js';
import Settings from './src/views/user/Settings.js';
import Profile from './src/views/user/Profile.js';
import Support from './src/views/user/Support.js';
import Terms from './src/views/user/Terms.js';

const AppNavigator = createStackNavigator(
    {
        initialRoute: LoadPage,

        // user
        NOTIFICATIONSETTINGS: {screen: NotificationSettings},
        PROFILESETTINGS: {screen: ProfileSettings},
        PAYMENTHISTORY: {screen: PaymentHistory},
        PRIVACYPOLICY: {screen: PrivacyPolicy},
        SETTINGS: {screen: Settings},
        PROFILE: {screen: Profile},
        SUPPORT: {screen: Support},
        TERMS: {screen: Terms},

        // content
        STUDENTFOCUSCATALOG: {screen: StudentFocusCatalog},
        STUDENTFOCUSSHOW: {screen: StudentFocusShow},
        VIDEOPLAYERSONG: {screen: VideoPlayerSong},
        FOUNDATIONSLEVEL: {screen: FoundationsLevel},
        FOUNDATIONS: {screen: Foundations},
        PATHOVERVIEW: {screen: PathOverview},
        SONGCATALOG: {screen: SongCatalog},
        VIDEOPLAYER: {screen: VideoPlayer},
        SINGLEPACK: {screen: SinglePack},
        DOWNLOADS: {screen: Downloads},
        LESSONS: {screen: Lessons},
        FILTERS: {screen: Filters},
        SEEALL: {screen: SeeAll},
        COURSE: {screen: Course},
        MYLIST: {screen: MyList},
        SEARCH: {screen: Search},
        PACKS: {screen: Packs},

        // onboard
        MEMBERSHIPEXPIRED: {screen: MembershipExpired},
        LOGINCREDENTIALS: {screen: LoginCredentials},
        SUPPORTSIGNUP: {screen: SupportSignUp},
        FORGOTPASSWORD: {screen: ForgotPassword},
        CREATEACCOUNT2: {screen: CreateAccount2},
        CREATEACCOUNT3: {screen: CreateAccount3},
        NEWMEMBERSHIP: {screen: NewMembership},
        CREATEACCOUNT: {screen: CreateAccount},
        GETRESTARTED: {screen: GetRestarted},
        WELCOMEBACK: {screen: WelcomeBack},
        LOADPAGE: {screen: LoadPage},
        LOGIN: {screen: Login},
    },
    {
        headerMode: 'screen',
        mode: 'card',
        defaultNavigationOptions: {
            gesturesEnabled: true,
            // if you want to change the back swipe width
            //just put the number, e.g. 100 would be fine to get the iOS effect
            gestureResponseDistance: {
                horizontal: Dimensions.get('window').width,
            },
        },
        transitionConfig: () => ({
            transitionSpec: {
                duration: 300,
                easing: Easing.out(Easing.poly(4)),
                timing: Animated.timing,
                useNativeDriver: true,
            },
            screenInterpolator: (sceneProps) => {
                const {layout, position, scene} = sceneProps;
                const {index} = scene;

                const width = layout.initWidth;
                const translateX = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [width, 0, 0],
                });

                const opacity = position.interpolate({
                    inputRange: [index - 1, index - 0.99, index],
                    outputRange: [0, 1, 1],
                });

                return {opacity, transform: [{translateX}]};
            },
        }),
    },
);

export default createAppContainer(AppNavigator);