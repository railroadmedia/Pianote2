/**
 *  Router
 *  Feb 7, 2020
 *  Attatches screen to string
 *      ex. 'MEMBERSHIP' shows file Membership.js
 */
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Animated } from 'react-native';

// content
import StudentFocusCatalog from './src/views/content/StudentFocusCatalog.js';
import StudentFocusShow from './src/views/content/StudentFocusShow.js';
import CourseCatalog from './src/views/content/CourseCatalog.js';
import VideoPlayer from './src/views/content/VideoPlayer.js';
import PathOverview from './src/views/content/PathOverview';
import SinglePack from './src/views/content/SinglePack.js';
import Downloads from './src/views/content/Downloads.js';
import Lessons from './src/views/content/Lessons.js';
import Course from './src/views/content/Course.js';
import MyList from './src/views/content/MyList.js';
import Search from './src/views/content/Search.js';
import Packs from './src/views/content/Packs.js';
import Home from './src/views/content/Home.js';

// onboard
import MembershipExpired from './src/views/onboard/MembershipExpired.js';
import LoginCredentials from './src/views/onboard/LoginCredentials.js';
import CreateAccount2 from './src/views/onboard/CreateAccount2.js';
import CreateAccount3 from './src/views/onboard/CreateAccount3.js';
import ForgotPassword from './src/views/onboard/ForgotPassword.js';
import NewMembership from './src/views/onboard/NewMembership.js';
import CreateAccount from './src/views/onboard/CreateAccount.js';
import GetRestarted from './src/views/onboard/GetRestarted';
import Subscriber from './src/views/onboard/Subscriber.js';
import WelcomeBack from './src/views/onboard/WelcomeBack';
import PackUser from './src/views/onboard/PackUser.js';
import LoadPage from './src/views/onboard/LoadPage.js';
import Login from './src/views/onboard/Login.js';

// user
import NotificationSettings from './src/views/user/NotificationSettings.js';
import PaymentHistory from './src/views/user/PaymentHistory.js';
import ProfileSettings from './src/views/user/ProfileSettings';
import PrivacyPolicy from './src/views/user/PrivacyPolicy.js';
import Membership from './src/views/user/Membership.js';
import Settings from './src/views/user/Settings.js';
import Profile from './src/views/user/Profile.js';
import Support from './src/views/user/Support.js';
import Terms from './src/views/user/Terms.js';

const AppNavigator = createStackNavigator({
    initialRoute: Home,

    // user
    NOTIFICATIONSETTINGS: {screen: NotificationSettings},
    PROFILESETTINGS: {screen: ProfileSettings},
    PAYMENTHISTORY: {screen: PaymentHistory},
    PRIVACYPOLICY: {screen: PrivacyPolicy},
    MEMBERSHIP: {screen: Membership},
    SETTINGS: {screen: Settings},
    PROFILE: {screen: Profile},
    SUPPORT: {screen: Support},
    TERMS: {screen: Terms},

    // content
    STUDENTFOCUSCATALOG: {screen: StudentFocusCatalog},
    STUDENTFOCUSSHOW: {screen: StudentFocusShow},
    COURSECATALOG: {screen: CourseCatalog},
    VIDEOPLAYER: {screen: VideoPlayer},
    PATHOVERVIEW: {screen: PathOverview},
    SINGLEPACK: {screen: SinglePack},
    DOWNLOADS: {screen: Downloads},
    LESSONS: {screen: Lessons},
    COURSE: {screen: Course},
    MYLIST: {screen: MyList},
    SEARCH: {screen: Search},
    PACKS: {screen: Packs},
    HOME: {screen: Home},

    // onboard
    MEMBERSHIPEXPIRED: {screen: MembershipExpired},
    LOGINCREDENTIALS: {screen: LoginCredentials},
    FORGOTPASSWORD: {screen: ForgotPassword},
    CREATEACCOUNT2: {screen: CreateAccount2},
    CREATEACCOUNT3: {screen: CreateAccount3},
    NEWMEMBERSHIP: {screen: NewMembership},
    CREATEACCOUNT: {screen: CreateAccount},
    GETRESTARTED: {screen: GetRestarted},
    WELCOMEBACK: {screen: WelcomeBack},
    SUBSCRIBER: {screen: Subscriber},
    LOADPAGE: {screen: LoadPage},
    PACKUSER: {screen: PackUser},
    LOGIN: {screen: Login},
},
{
    headerMode:'screen',
    mode:'card',
    defaultNavigationOptions: {gesturesEnabled: false},
    transitionConfig: () => (
        {transitionSpec: {duration: 0, timing: Animated.timing}}
    )
});

export default createAppContainer(AppNavigator);