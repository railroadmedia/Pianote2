/**
 * Login
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import RNIap from 'react-native-iap';
import FastImage from 'react-native-fast-image';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';

import GradientFeature from '../../components/GradientFeature.js';
import { validateSignUp, restorePurchase } from '../../services/UserDataAuth';
import CustomModal from '../../modals/CustomModal';
import Loading from '../../components/Loading';
import Orientation from 'react-native-orientation-locker';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;

const skus = Platform.select({
  android: ['pianote_app_1_month_member', 'pianote_app_1_year_member'],
  ios: ['pianote_app_1_month_membership', 'pianote_app_1_year_membership']
});
let purchases = [];

export default class Login extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    Orientation.lockToPortrait();
    this.state = {
      page: 1,
      signupAlertText: ''
    };
  }

  changeColor(number) {
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

  onLogin = () => {
    this.props.navigation.navigate('LOGINCREDENTIALS');
  };

  iapInitialized = async () => {
    try {
      return await RNIap.initConnection();
    } catch (e) {
      this.iapConnectionError();
    }
  };

  iapConnectionError = () => {
    Alert.alert(
      `Connection to ${
        Platform.OS === 'ios' ? 'app store' : 'play store'
      } refused`,
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
      }
  };

  userHasSubscription = async () => {
    purchases = await RNIap.getPurchaseHistory();
    console.log('purchases', purchases);
    if (purchases.some(p => skus.includes(p.productId))) {
      if (Platform.OS === 'android') {
        purchases = purchases.map(p => ({
          purchase_token: p.purchaseToken,
          package_name: 'com.pianote2',
          product_id: p.productId
        }));
      }
      let resp = await validateSignUp(purchases);
      console.log('validateSignUp resp', resp);
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
            Platform.OS === 'ios' ? 'apple' : 'google'
          } account.`
        );
        this.setState({ signupAlertText: 'Restore' });
      }
      return true;
    }
  };

  restorePurchases = async () => {
    this.subscriptionExists.toggle();
    if (this.loadingRef) this.loadingRef.toggleLoading();
    try {
      let restoreResponse = await restorePurchase(purchases);
      console.log('restoreResponse', restoreResponse);
      if (this.loadingRef) this.loadingRef.toggleLoading();
      if (restoreResponse.title && restoreResponse.message)
        return this.alert.toggle(
          restoreResponse.title,
          restoreResponse.message
        );
      if (restoreResponse.email)
        return this.props.navigation.navigate('LOGINCREDENTIALS', {
          email: restoreResponse.email
        });
      if (
        !restoreResponse.email &&
        ((Platform.OS === 'android' && restoreResponse.purchase) ||
          (Platform.OS === 'ios' && purchases[0]))
      )
        return this.props.navigation.navigate('CREATEACCOUNT', {
          purchase: restoreResponse.purchase || purchases[0]
        });
    } catch (err) {
      console.log('restore err', err);
      if (this.loadingRef) this.loadingRef.toggleLoading();
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
    <View
      key={'buttons'}
      style={{
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '10%',
        marginRight: '10%'
      }}
    >
      <TouchableOpacity
        onPress={this.onLogin}
        style={{
          flex: 1,
          marginHorizontal: 10,
          maxWidth: 400,
          justifyContent: 'center',
          borderRadius: 60,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: '#fb1b2f'
        }}
      >
        <Text
          style={{
            fontFamily: 'RobotoCondensed-Bold',
            fontSize: 18 * factorRatio,
            textAlign: 'center',
            color: '#fb1b2f',
            padding: 10
          }}
        >
          LOG IN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          if (await this.userCanSignUp())
            return this.props.navigation.navigate('CREATEACCOUNT');
        }}
        style={{
          flex: 1,
          marginHorizontal: 10,
          maxWidth: 400,
          justifyContent: 'center',
          borderRadius: 60,
          backgroundColor: '#fb1b2f'
        }}
      >
        <Text
          style={{
            fontFamily: 'RobotoCondensed-Bold',
            fontSize: 18 * factorRatio,
            textAlign: 'center',
            color: 'white',
            padding: 10
          }}
        >
          SIGN UP
        </Text>
      </TouchableOpacity>
    </View>
  );

  renderDots() {
    return (
      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        {[1, 2, 3, 4, 5].map(dot => (
          <View
            style={{
              height: 10 * factorRatio,
              width: 10 * factorRatio,
              margin: 5,
              borderRadius: 100,
              backgroundColor:
                this.state.page == dot ? '#fb1b2f' : 'transparent',
              borderWidth: 2,
              borderColor: this.state.page == dot ? '#fb1b2f' : 'grey'
            }}
          />
        ))}
      </View>
    );
  }

  renderFirstPage() {
    return (
      <View key={'loginSignup'} style={{ flex: 1, width }}>
        <View
          key={'pianote1'}
          style={{
            position: 'absolute',
            top:
              (Platform.OS === 'ios' && height > 811) || onTablet
                ? height * 0.03
                : height * 0.015,
            zIndex: 3,
            elevation: Platform.OS === 'android' ? 3 : 0,
            width: '100%'
          }}
        >
          <Pianote
            height={75 * factorRatio}
            width={125 * factorRatio}
            fill={'#fb1b2f'}
            style={{ alignSelf: 'center' }}
          />
        </View>
        <GradientFeature
          color={'grey'}
          opacity={1}
          height={'70%'}
          borderRadius={0}
        />
        <View
          key={'image1'}
          style={{
            flex: 0.75,
            alignSelf: 'stretch'
          }}
        >
          <FastImage
            style={{ flex: 1 }}
            source={require('Pianote2/src/assets/img/imgs/lisa-foundations.png')}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View
          key={'content1'}
          style={{
            position: 'absolute',
            bottom: height * 0.23,
            width: '100%',
            zIndex: 3,
            elevation: Platform.OS === 'android' ? 3 : 0
          }}
        >
          <View style={styles.centerContent}>
            <FastImage
              style={{
                height: 120 * factorRatio,
                width: width * 0.75
              }}
              source={require('Pianote2/src/assets/img/imgs/devices.png')}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: 28 * factorRatio,
              paddingLeft: 15,
              paddingRight: 15,
              fontWeight: Platform.OS == 'ios' ? '800' : 'bold',
              textAlign: 'center',
              color: 'white',
              marginTop: 7.5 * factorVertical
            }}
          >
            {'Pianote Lessons, Songs, & Support'}
          </Text>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: 18 * factorRatio,
              textAlign: 'center',
              color: 'grey',
              marginTop: 10 * factorVertical
            }}
          >
            Everywhere you go.
          </Text>
        </View>
        <View
          key={'content1b'}
          style={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
            zIndex: 3,
            elevation: Platform.OS === 'android' ? 3 : 0
          }}
        >
          {this.renderDots()}
          <View key={'buff'} style={{ height: height * 0.02 }}></View>
          {this.renderButtons()}
        </View>
      </View>
    );
  }

  renderSecondPage() {
    return (
      <View key={'whatToPractive'} style={{ flex: 1, width }}>
        <View
          key={'pianote1'}
          style={{
            position: 'absolute',
            top:
              (Platform.OS === 'ios' && height > 811) || onTablet
                ? height * 0.03
                : height * 0.015,
            zIndex: 2,
            elevation: Platform.OS === 'android' ? 3 : 0,
            width: '100%'
          }}
        >
          <Pianote
            height={75 * factorRatio}
            width={125 * factorRatio}
            fill={'#fb1b2f'}
            style={{ alignSelf: 'center' }}
          />
        </View>
        <GradientFeature
          color={'grey'}
          opacity={1}
          height={'70%'}
          borderRadius={0}
        />
        <View
          key={'image1'}
          style={{
            flex: 0.75,
            alignSelf: 'stretch'
          }}
        >
          <FastImage
            style={{ flex: 1 }}
            source={require('Pianote2/src/assets/img/imgs/prescreenPractice.png')}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View
          key={'content1'}
          style={{
            position: 'absolute',
            bottom: height * 0.215,
            width: '100%',
            zIndex: 3,
            elevation: Platform.OS === 'android' ? 3 : 0
          }}
        >
          <View style={styles.centerContent}>
            <FastImage
              style={{
                height: 120 * factorRatio,
                width: '100%'
              }}
              source={require('Pianote2/src/assets/img/imgs/practice.png')}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: 28 * factorRatio,
              paddingLeft: 15,
              paddingRight: 15,
              fontWeight: '500',
              textAlign: 'center',
              color: 'white'
            }}
          >
            Always know
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 28 * factorRatio,
                paddingLeft: 15,
                paddingRight: 15,
                fontWeight: Platform.OS == 'ios' ? '800' : 'bold',
                textAlign: 'center',
                color: 'white'
              }}
            >
              {' exactly '}
            </Text>
            what to practice.
          </Text>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              paddingLeft: 15,
              paddingRight: 15,
              fontSize: 18 * factorRatio,
              textAlign: 'center',
              color: 'grey',
              marginTop: 20 * factorVertical
            }}
          >
            Unlike "video game" learning where you only learn what keys to hit,
            you'll actually play music with step-by-step lessons that will build
            your piano playing foundations!
          </Text>
        </View>
        <View
          key={'content1b'}
          style={{
            position: 'absolute',
            bottom: height * 0.055,
            width: '100%',
            zIndex: 3,
            elevation: Platform.OS === 'android' ? 3 : 0
          }}
        >
          {this.renderDots()}
          <View key={'buff'} style={{ height: height * 0.02 }}></View>
          {this.renderButtons()}
        </View>
      </View>
    );
  }

  renderThirdpage() {
    return (
      <View key={'favSongs'} style={{ flex: 1, width }}>
        <View
          key={'pianote1'}
          style={{
            position: 'absolute',
            top:
              (Platform.OS === 'ios' && height > 811) || onTablet
                ? height * 0.03
                : height * 0.015,
            zIndex: 2,
            elevation: Platform.OS === 'android' ? 3 : 0,
            width: '100%'
          }}
        >
          <Pianote
            height={75 * factorRatio}
            width={125 * factorRatio}
            fill={'#fb1b2f'}
            style={{ alignSelf: 'center' }}
          />
        </View>
        <GradientFeature
          color={'grey'}
          opacity={1}
          height={'70%'}
          borderRadius={0}
        />
        <View
          key={'image1'}
          style={{
            flex: 0.75,
            alignSelf: 'stretch'
          }}
        >
          <FastImage
            style={{ flex: 1 }}
            source={require('Pianote2/src/assets/img/imgs/prescreenSongs.png')}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View
          key={'content1'}
          style={{
            position: 'absolute',
            bottom: height * 0.22,
            width: '100%',
            zIndex: 3,
            elevation: Platform.OS === 'android' ? 3 : 0
          }}
        >
          <View style={styles.centerContent}>
            <FastImage
              style={{
                height: 120 * factorRatio,
                width: '100%'
              }}
              source={require('Pianote2/src/assets/img/imgs/favorite-songs.png')}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: 28 * factorRatio,
              paddingLeft: 15,
              paddingRight: 15,
              fontWeight: '500',
              textAlign: 'center',
              color: 'white'
            }}
          >
            Play Your {'\n'}
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 28 * factorRatio,
                paddingLeft: 15,
                paddingRight: 15,
                fontWeight: Platform.OS == 'ios' ? '800' : 'bold',
                textAlign: 'center',
                color: 'white'
              }}
            >
              {' Favorite Songs'}
            </Text>
          </Text>
          <View style={{ height: 20 * factorVertical }} />
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              paddingLeft: 15,
              paddingRight: 15,
              fontSize: 18 * factorRatio,
              textAlign: 'center',
              color: 'grey'
            }}
          >
            Nothing is better than playing to real music! So you'll get custom
            play-alongs to help you apply specific-skills PLUS breakdowns of
            popular music so you can play your favorite tunes!
          </Text>
        </View>
        <View
          key={'content1b'}
          style={{
            position: 'absolute',
            bottom: height * 0.055,
            width: '100%',
            zIndex: 3,
            elevation: Platform.OS === 'android' ? 3 : 0
          }}
        >
          {this.renderDots()}
          <View key={'buff'} style={{ height: height * 0.02 }}></View>
          {this.renderButtons()}
        </View>
      </View>
    );
  }

  renderFourthPage() {
    return (
      <View key={'lessonSupport'} style={{ flex: 1, width }}>
        <View
          key={'pianote1'}
          style={{
            position: 'absolute',
            top:
              (Platform.OS === 'ios' && height > 811) || onTablet
                ? height * 0.03
                : height * 0.015,
            zIndex: 2,
            elevation: Platform.OS === 'android' ? 3 : 0,
            width: '100%'
          }}
        >
          <Pianote
            height={75 * factorRatio}
            width={125 * factorRatio}
            fill={'#fb1b2f'}
            style={{ alignSelf: 'center' }}
          />
        </View>
        <GradientFeature
          color={'grey'}
          opacity={1}
          height={'70%'}
          borderRadius={0}
        />
        <View
          key={'image1'}
          style={{
            flex: 0.75,
            alignSelf: 'stretch'
          }}
        >
          <FastImage
            style={{ flex: 1 }}
            source={require('Pianote2/src/assets/img/imgs/prescreenSupport.png')}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>

        <View
          key={'content1'}
          style={{
            position: 'absolute',
            bottom: height * 0.22,
            width: '100%',
            zIndex: 3,
            elevation: Platform.OS === 'android' ? 3 : 0
          }}
        >
          <View style={styles.centerContent}>
            <FastImage
              style={{
                height: 120 * factorRatio,
                width: '100%'
              }}
              source={require('Pianote2/src/assets/img/imgs/support.png')}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: 28 * factorRatio,
              paddingLeft: 15,
              paddingRight: 15,
              fontWeight: '500',
              textAlign: 'center',
              color: 'white'
            }}
          >
            Personalized {'\n'}
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 28 * factorRatio,
                paddingLeft: 15,
                paddingRight: 15,
                fontWeight: Platform.OS == 'ios' ? '800' : 'bold',
                textAlign: 'center',
                color: 'white'
              }}
            >
              {' Lessons & Support'}
            </Text>
          </Text>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              paddingLeft: 15,
              paddingRight: 15,
              fontSize: 18 * factorRatio,
              textAlign: 'center',
              color: 'grey',
              marginTop: 20 * factorVertical
            }}
          >
            Get direct acces to real teachers any time you have a question,
            access weekly live-streaming video lessons, and connect with
            teachers and students in the community forums!
          </Text>
        </View>
        <View
          key={'content1b'}
          style={{
            position: 'absolute',
            bottom: height * 0.055,
            width: '100%',
            zIndex: 3,
            elevation: Platform.OS === 'android' ? 3 : 0
          }}
        >
          {this.renderDots()}
          <View key={'buff'} style={{ height: height * 0.02 }}></View>
          {this.renderButtons()}
        </View>
      </View>
    );
  }

  renderFifthPage() {
    return (
      <View key={'done'} style={{ flex: 1, width }}>
        <View
          key={'pianote1'}
          style={{
            position: 'absolute',
            top:
              (Platform.OS === 'ios' && height > 811) || onTablet
                ? height * 0.03
                : height * 0.015,
            zIndex: 4,
            elevation: Platform.OS === 'android' ? 4 : 0,
            width: '100%'
          }}
        >
          <Pianote
            height={75 * factorRatio}
            width={125 * factorRatio}
            fill={'#fb1b2f'}
            style={{ alignSelf: 'center' }}
          />
        </View>
        <GradientFeature
          color={'grey'}
          opacity={1}
          height={'30%'}
          borderRadius={0}
        />
        <View
          style={[
            styles.centerContent,
            {
              flex: 1,
              backgroundColor: 'rgba(23, 26, 26, 1)',
              alignSelf: 'stretch',
              zIndex: 3,
              marginBottom: 60 * factorVertical
            }
          ]}
        >
          <View
            key={'content1'}
            style={[
              styles.centerContent,
              {
                width: '100%',
                zIndex: 3,
                elevation: Platform.OS === 'android' ? 3 : 0
              }
            ]}
          >
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 28 * factorRatio,
                paddingLeft: 15,
                paddingRight: 15,
                fontWeight: '500',
                textAlign: 'center',
                color: 'white'
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 28 * factorRatio,
                  paddingLeft: 15,
                  paddingRight: 15,
                  fontWeight: Platform.OS == 'ios' ? '800' : 'bold',
                  textAlign: 'center',
                  color: 'white'
                }}
              >
                Not a Member?
              </Text>
            </Text>
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                paddingLeft: 15,
                paddingRight: 15,
                fontSize: 18 * factorRatio,
                textAlign: 'center',
                color: 'grey',
                marginTop: 10 * factorVertical
              }}
            >
              Try it for free for 7-days when you click the sign up button below
              to set up your Pianote account.
            </Text>
          </View>
        </View>
        <View
          key={'content1b'}
          style={{
            position: 'absolute',
            bottom: height * 0.055,
            width: '100%',
            zIndex: 3,
            elevation: Platform.OS === 'android' ? 3 : 0
          }}
        >
          {this.renderDots()}
          <View key={'buff'} style={{ height: height * 0.02 }}></View>
          {this.renderButtons()}
        </View>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'rgba(23, 26, 26, 1)' }}
        forceInset={{ top: 'never', bottom: 'always' }}
      >
        <View style={{ flex: 1 }}>
          <StatusBar backgroundColor='black' barStyle='light-content' />

          <ScrollView
            horizontal={true}
            ref={ref => {
              this.myScroll = ref;
            }}
            pagingEnabled={true}
            onMomentumScrollEnd={e => this.changeColor(e)}
            style={{ flex: 1 }}
          >
            {this.renderFirstPage()}
            {this.renderSecondPage()}
            {this.renderThirdpage()}
            {this.renderFourthPage()}
            {this.renderFifthPage()}
          </ScrollView>
          <Loading
            ref={ref => {
              this.loadingRef = ref;
            }}
          />
          <CustomModal
            ref={r => (this.subscriptionExists = r)}
            additionalBtn={
              <TouchableOpacity
                onPress={this.restorePurchases}
                style={{
                  marginTop: 10,
                  borderRadius: 50,
                  backgroundColor: colors.pianoteRed
                }}
              >
                <Text
                  style={{
                    padding: 15,
                    fontSize: 15,
                    color: '#ffffff',
                    textAlign: 'center',
                    fontFamily: 'OpenSans-Bold'
                  }}
                >
                  {this.state.signupAlertText}
                </Text>
              </TouchableOpacity>
            }
            onClose={() => {
              if (this.loadingRef) this.loadingRef.toggleLoading(false);
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
