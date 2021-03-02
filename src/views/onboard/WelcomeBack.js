/**
 * WelcomeBack
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import SwipeLeft from 'Pianote2/src/assets/img/svgs/swipe-left.svg';
import Orientation from 'react-native-orientation-locker';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;

export default class WelcomeBack extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    Orientation.lockToPortrait();
    this.state = {
      page: 1
    };
  }

  async changeColor(number) {
    let index = Math.round(number.nativeEvent.contentOffset.x / width);
    if (index === 0) {
      this.setState({ page: 1 });
    } else if (index === 1) {
      this.setState({ page: 2 });
    } else if (index === 2) {
      this.setState({ page: 3 });
    }
  }

  renderDots() {
    return (
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        {[1, 2, 3].map(dot => (
          <View
            key={dot}
            style={{
              width: 10,
              margin: 5,
              aspectRatio: 1,
              borderWidth: 1,
              borderRadius: 100,
              borderColor: colors.pianoteRed,
              backgroundColor:
                this.state.page === dot
                  ? colors.pianoteRed
                  : 'rgba(220, 220, 220, 0)'
            }}
          />
        ))}
      </View>
    );
  }

  renderFirstPage() {
    return (
      <View style={{ width, flex: 1 }}>
        <FastImage
          style={{
            height: '100%',
            flex: 1,
            borderRadius: 15
          }}
          source={require('Pianote2/src/assets/img/imgs/onboarding-lisa.png')}
          resizeMode={FastImage.resizeMode.contain}
        />
        <ScrollView
          bounces={false}
          style={{ flex: 1 }}
          scrollEventThrottle={400}
        >
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: onTablet ? 25 : 18,
              margin: 30,
              textAlign: 'center'
            }}
          >
            {`Welcome back to Pianote!\n\nWe're so excited to make the Pianote experience more easily accessible to our community.\n\nBefore you jump in, we wanted to highlight a few new features in the app.`}
          </Text>
        </ScrollView>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 10
          }}
        >
          <SwipeLeft height={65} width={100} />
        </View>
      </View>
    );
  }

  renderSecondPage() {
    return (
      <View key={'myList'} style={{ width, flex: 1 }}>
        <FastImage
          style={{
            flex: 1,
            width: '100%',
            borderRadius: 15
          }}
          source={require('Pianote2/src/assets/img/imgs/onboarding-download.png')}
          resizeMode={FastImage.resizeMode.contain}
        />
        <ScrollView
          bounces={false}
          style={{ flex: 1 }}
          scrollEventThrottle={400}
        >
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: onTablet ? 25 : 18,
              margin: 30,
              textAlign: 'center'
            }}
          >
            {`We support offline viewing!\n\nTap the download button on any lesson and the lesson materials needed to complete that lesson will be stored on your device in the "Downloads" section.\n\nNow you can use Pianote wherever you go!`}
          </Text>
        </ScrollView>
      </View>
    );
  }

  renderThirdPage() {
    return (
      <View style={{ width, flex: 1 }}>
        <FastImage
          style={{
            flex: 1,
            width: '100%',
            borderRadius: 15
          }}
          source={require('Pianote2/src/assets/img/imgs/onboarding-sync.png')}
          resizeMode={FastImage.resizeMode.contain}
        />
        <ScrollView
          bounces={false}
          style={{ flex: 1 }}
          scrollEventThrottle={400}
        >
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: onTablet ? 25 : 18,
              margin: 30,
              textAlign: 'center'
            }}
          >
            {`Your lesson progress is synced between the Pianote App and the Pianote Website.\n\nFeel free to watch a lesson on your phone, then pick up where you left later in the day when you're at the Piano next to your computer.`}
          </Text>
        </ScrollView>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <StatusBar backgroundColor='white' barStyle='dark-content' />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ScrollView
            bounces={false}
            style={{ flex: 1 }}
            horizontal={true}
            removeClippedSubviews={false}
            ref={ref => {
              this.myScroll = ref;
            }}
            pagingEnabled={true}
            scrollEnabled={this.state.canScroll}
            onMomentumScrollEnd={e => this.changeColor(e)}
            showsHorizontalScrollIndicator={false}
          >
            {this.renderFirstPage()}
            {this.renderSecondPage()}
            {this.renderThirdPage()}
          </ScrollView>
          {this.renderDots()}
          {this.state.page < 3 ? (
            <TouchableOpacity
              testID='skipBtn'
              onPress={() => this.props.navigation.navigate('LESSONS')}
              style={{ marginBottom: '2%', padding: 15 }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'RobotoCondensed-Bold',
                  fontSize: onTablet ? 18 : 14,
                  color: colors.pianoteRed
                }}
              >
                SKIP
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                padding: 15,
                width: onTablet ? '45%' : '80%',
                marginBottom: '2%',
                borderRadius: 100,
                backgroundColor: colors.pianoteRed
              }}
              onPress={() => this.props.navigation.navigate('LESSONS')}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'RobotoCondensed-Bold',
                  fontSize: onTablet ? 24 : 16,
                  color: 'white'
                }}
              >
                GET STARTED
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
