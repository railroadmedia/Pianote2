import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Dimensions,
  StatusBar,
  Image,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import RNIap from 'react-native-iap';
import Pianote from '../../assets/img/svgs/pianote.svg';
import GradientFeature from '../../components/GradientFeature.js';
import { validateSignUp, restorePurchase } from '../../services/UserDataAuth';
import CustomModal from '../../modals/CustomModal';
import Loading from '../../components/Loading';
import Orientation from 'react-native-orientation-locker';
import { navigate } from '../../../AppNavigator.js';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const isTablet = global.onTablet;
const skus = Platform.select({
  android: ['pianote_app_1_year_2021', 'pianote_app_1_month_2021'],
  ios: [
    'pianote_app_1_month_membership_2021',
    'pianote_app_1_year_membership_2021'
  ]
});
let purchases = [];
const images = {
  1: [
    require('../../../src/assets/img/imgs/lisa-foundations.png'),
    require('../../../src/assets/img/imgs/devices.png')
  ],
  2: [
    require('../../../src/assets/img/imgs/prescreenPractice.png'),
    require('../../../src/assets/img/imgs/practice.png')
  ],
  3: [
    require('../../../src/assets/img/imgs/prescreenSongs.png'),
    require('../../../src/assets/img/imgs/favorite-songs.png')
  ],
  4: [
    require('../../../src/assets/img/imgs/prescreenSupport.png'),
    require('../../../src/assets/img/imgs/support.png')
  ],
  5: ['', '']
};

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    Orientation.lockToPortrait();
    this.state = {
      page: 1,
      signupAlertText: ''
    };
  }

  changePage(number) {
    number = Math.round(number.nativeEvent.contentOffset.x / width);
    if (number === 0) {
      this.setState({ page: 1 });
    } else if (number === 1) {
      this.setState({ page: 2 });
    } else if (number === 2) {
      this.setState({ page: 3 });
    } else if (number === 3) {
      this.setState({ page: 4 });
    } else if (number === 4) {
      this.setState({ page: 5 });
    }
  }

  onLogin = () => navigate('LOGINCREDENTIALS');

  iapInitialized = async () => {
    try {
      return await RNIap.initConnection();
    } catch (e) {
      this.iapConnectionError();
    }
  };

  iapConnectionError = () => {
    Alert.alert(
      `Connection to ${isiOS ? 'app store' : 'play store'} refused`,
      'Please try again later.',
      [{ text: 'OK' }],
      {
        cancelable: false
      }
    );
  };

  userCanSignUp = async () => {
    if (await this.iapInitialized())
      try {
        return !(await this.userHasSubscription());
      } catch (e) {
        this.iapConnectionError();
        this.loadingRef?.toggleLoading();
      }
  };

  userHasSubscription = async () => {
    this.loadingRef?.toggleLoading();
    purchases = await RNIap.getPurchaseHistory();
    if (purchases.some(p => skus.includes(p.productId))) {
      if (!isiOS) {
        purchases = purchases.map(p => ({
          purchase_token: p.purchaseToken,
          package_name: 'com.pianote2',
          product_id: p.productId
        }));
      }
      let resp = await validateSignUp(purchases);
      if (resp.message) {
        this.subscriptionExists.toggle(`Signup Blocked`, resp.message);
        this.setState({
          signupAlertText: resp.shouldRenew
            ? 'Renew'
            : resp.shouldLogin
            ? 'Login'
            : 'Restore'
        });
      } else {
        this.subscriptionExists.toggle(
          `Signup Blocked`,
          `You cannot create multiple pianote accounts under the same ${
            isiOS ? 'apple' : 'google'
          } account.`
        );
        this.setState({ signupAlertText: 'Restore' });
      }
      this.loadingRef?.toggleLoading();
      return true;
    }
    this.loadingRef?.toggleLoading();
  };

  restorePurchases = async () => {
    this.subscriptionExists.toggle();
    if (this.loadingRef) this.loadingRef?.toggleLoading();
    try {
      let restoreResponse = await restorePurchase(purchases);
      if (this.loadingRef) this.loadingRef?.toggleLoading();
      if (restoreResponse.title && restoreResponse.message)
        return this.alert.toggle(
          restoreResponse.title,
          restoreResponse.message
        );
      if (restoreResponse.email)
        return navigate('LOGINCREDENTIALS', {
          email: restoreResponse.email
        });
      if (
        !restoreResponse.email &&
        ((!isiOS && restoreResponse.purchase) || (isiOS && purchases[0]))
      ) {
        let purchase = restoreResponse.purchase || purchases[0];
        const product = await RNIap.getSubscriptions([
          purchase.product_id || purchase.productId
        ]);
        purchase.price = product[0].price;
        purchase.currency = product[0].currency;
        return navigate('CREATEACCOUNT', {
          purchase
        });
      }
    } catch (err) {
      this.loadingRef?.toggleLoading(false);
      Alert.alert(
        'Something went wrong',
        'Please try Again later.',
        [{ text: 'OK' }],
        {
          cancelable: false
        }
      );
    }
  };

  renderButtons = () => (
    <View style={localStyles.renderButtonsContainer}>
      <TouchableOpacity
        onPress={this.onLogin}
        style={localStyles.renderButtonsInnerContainer}
      >
        <Text style={localStyles.loginText}>LOG IN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          if (await this.userCanSignUp()) return navigate('CREATEACCOUNT');
        }}
        style={localStyles.signupButton}
      >
        <Text style={localStyles.signupText}>SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );

  renderDots() {
    return (
      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        {[1, 2, 3, 4, 5].map(dot => (
          <View
            key={dot}
            style={[
              localStyles.dots,
              {
                backgroundColor:
                  this.state.page === dot ? '#fb1b2f' : 'transparent',
                borderColor: this.state.page === dot ? '#fb1b2f' : 'grey'
              }
            ]}
          />
        ))}
      </View>
    );
  }

  renderWords = num => {
    if (num === 1) {
      return (
        <>
          <Text style={[localStyles.bigText, localStyles.boldText]}>
            {'Pianote Lessons, Songs, \n& Support'}
          </Text>
          <Text style={localStyles.normalText}>Everywhere you go.</Text>
        </>
      );
    } else if (num === 2) {
      return (
        <>
          <Text style={localStyles.bigText}>
            Always know
            <Text style={localStyles.boldText}>{' exactly '}</Text>
            what to practice.
          </Text>
          <Text style={localStyles.normalText}>
            Unlike "video game" learning where you only learn what keys to hit,
            you'll actually play music with step-by-step lessons that will build
            your piano playing foundations!
          </Text>
        </>
      );
    } else if (num === 3) {
      return (
        <>
          <Text style={localStyles.bigText}>
            Play Your {'\n'}
            <Text style={localStyles.boldText}>{' Favorite Songs'}</Text>
          </Text>
          <Text style={localStyles.normalText}>
            Nothing is better than playing to real music! So you'll get custom
            play-alongs to help you apply specific-skills PLUS breakdowns of
            popular music so you can play your favorite tunes!
          </Text>
        </>
      );
    } else if (num === 4) {
      return (
        <>
          <Text style={localStyles.bigText}>
            Personalized
            <Text style={localStyles.boldText}>{' Lessons & Support'}</Text>
          </Text>
          <Text style={localStyles.normalText}>
            Get direct access to real teachers any time you have a question,
            access weekly live-streaming video lessons, and connect with
            teachers and students in the community forums!
          </Text>
        </>
      );
    } else if (num === 5) {
      return (
        <>
          <Text style={[localStyles.bigText, localStyles.boldText]}>
            Not a member?
          </Text>
          <Text style={localStyles.normalText}>
            Try it for free for 7-days when you click the sign up button below
            to set up your Pianote account.
          </Text>
        </>
      );
    }
  };

  renderPage(num) {
    if (num === 5) {
      return (
        <View style={localStyles.backgroundContainer}>
          <SafeAreaView style={localStyles.finalPageContainer}>
            <Pianote
              height={onTablet ? 80 : 60}
              width={onTablet ? 200 : 120}
              fill={'#fb1b2f'}
              style={{ alignSelf: 'center' }}
            />
          </SafeAreaView>
          <GradientFeature
            color={'grey'}
            opacity={1}
            height={'30%'}
            borderRadius={0}
          />
          <View style={[styles.centerContent, localStyles.aboveWordsContainer]}>
            <View
              style={[
                styles.centerContent,
                {
                  width: '100%',
                  zIndex: 3,
                  elevation: 3
                }
              ]}
            />
            {this.renderWords(num)}
          </View>
          <View style={localStyles.dotsContainer}>
            {this.renderDots()}
            <View style={{ height: '20%' }} />
            {this.renderButtons()}
          </View>
        </View>
      );
    } else {
      return (
        <View style={localStyles.backgroundContainer}>
          <SafeAreaView style={localStyles.finalPageContainer}>
            <Pianote
              height={onTablet ? 80 : 60}
              width={onTablet ? 200 : 120}
              fill={'#fb1b2f'}
              style={{ alignSelf: 'center' }}
            />
          </SafeAreaView>
          <GradientFeature
            color={'grey'}
            opacity={1}
            height={'70%'}
            borderRadius={0}
          />
          <View style={{ flex: 0.75, alignSelf: 'stretch' }}>
            <Image
              style={{ height: '100%', width: '100%' }}
              source={images[num][0]}
              resizeMode={'cover'}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: '23%',
              width: '100%',
              zIndex: 3,
              elevation: 3
            }}
          >
            <View style={styles.centerContent}>
              <Image
                style={{
                  height: onTablet ? 200 : 100,
                  width: '100%'
                }}
                source={images[num][1]}
                resizeMode={'contain'}
              />
              {this.renderWords(num)}
            </View>
          </View>
          <View style={localStyles.dotsContainer}>
            {this.renderDots()}
            <View style={{ height: '20%' }} />
            {this.renderButtons()}
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'black' }}
        forceInset={{ top: 'never', bottom: 'never' }}
      >
        <StatusBar backgroundColor='black' barStyle='light-content' />
        <ScrollView
          horizontal={true}
          ref={ref => (this.myScroll = ref)}
          pagingEnabled={true}
          onMomentumScrollEnd={e => this.changePage(e)}
          style={{ flex: 1 }}
        >
          {this.renderPage(1)}
          {this.renderPage(2)}
          {this.renderPage(3)}
          {this.renderPage(4)}
          {this.renderPage(5)}
        </ScrollView>
        <Loading ref={ref => (this.loadingRef = ref)} />
        <CustomModal
          ref={r => (this.subscriptionExists = r)}
          onClose={() => this.loadingRef?.toggleLoading(false)}
          additionalBtn={
            <TouchableOpacity
              onPress={this.restorePurchases}
              style={{
                marginTop: 10,
                borderRadius: 50,
                backgroundColor: colors.pianoteRed
              }}
            >
              <Text style={localStyles.signupAlertText}>
                {this.state.signupAlertText}
              </Text>
            </TouchableOpacity>
          }
        />
      </SafeAreaView>
    );
  }
}

const localStyles = StyleSheet.create({
  finalPageContainer: {
    position: 'absolute',
    top: 0,
    zIndex: 3,
    elevation: 3,
    width: '100%'
  },
  renderButtonsContainer: {
    width: isTablet ? '80%' : '95%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: isTablet ? '10%' : '2.5%',
    marginRight: isTablet ? '10%' : '2.5%'
  },
  loginText: {
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: isTablet ? 24 : 16,
    textAlign: 'center',
    color: '#fb1b2f',
    padding: 10
  },
  signupText: {
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: isTablet ? 24 : 16,
    textAlign: 'center',
    color: 'white',
    padding: 10
  },
  renderButtonsInnerContainer: {
    flex: 1,
    marginHorizontal: 10,
    maxWidth: 400,
    justifyContent: 'center',
    borderRadius: 60,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fb1b2f'
  },
  backgroundContainer: {
    flex: 1,
    width: width,
    backgroundColor: 'rgba(23, 26, 26, 1)'
  },
  signupButton: {
    flex: 1,
    marginHorizontal: 10,
    maxWidth: 400,
    justifyContent: 'center',
    borderRadius: 60,
    backgroundColor: '#fb1b2f'
  },
  dots: {
    height: 10,
    width: 10,
    margin: 5,
    borderRadius: 100,
    borderWidth: 2
  },
  normalText: {
    fontFamily: 'OpenSans-Regular',
    padding: 5,
    fontSize: isTablet ? 24 : 16,
    textAlign: 'center',
    color: 'grey'
  },
  boldText: {
    fontFamily: 'OpenSans-Bold',
    padding: 5,
    textAlign: 'center',
    color: 'white'
  },
  bigText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 32 : 24,
    padding: 5,
    textAlign: 'center',
    color: 'white'
  },
  dotsContainer: {
    position: 'absolute',
    bottom: '5.5%',
    width: '100%',
    zIndex: 3,
    elevation: 3
  },
  aboveWordsContainer: {
    flex: 1,
    backgroundColor: 'rgba(23, 26, 26, 1)',
    alignSelf: 'stretch',
    zIndex: 3,
    marginBottom: 20
  },
  signupAlertText: {
    padding: 15,
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'OpenSans-Bold'
  }
});
