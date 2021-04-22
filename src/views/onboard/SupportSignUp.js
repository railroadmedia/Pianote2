import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  StyleSheet,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Intercom from 'react-native-intercom';
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import {SafeAreaView} from 'react-navigation';
import {goBack} from '../../../AppNavigator';

export default class SupportSignUp extends React.Component {
  componentDidMount = async () => {
    Intercom.registerUnidentifiedUser();
  };

  onIntercomPress = () => {
    Intercom.displayMessenger();
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={{flex: 0.08}}>
          <View
            style={[
              styles.centerContent,
              {
                position: 'absolute',
                left: 10,
                paddingLeft: 5,
                bottom: 10,
                height: 50,
                width: 50,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => goBack()}
              style={[
                styles.centerContent,
                {
                  height: '100%',
                  width: '100%',
                },
              ]}
            >
              <Back
                width={backButtonSize}
                height={backButtonSize}
                fill={'white'}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.66}} />
          <Text
            style={[styles.childHeaderText, {color: colors.secondBackground}]}
          >
            Support
          </Text>
          <View style={{flex: 0.33}} />
        </View>
        <ScrollView style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => this.onIntercomPress()}
            style={[
              styles.centerContent,
              localStyles.button,
              {marginTop: '30%'},
            ]}
          >
            <Text style={localStyles.buttonText}>LIVE CHAT SUPPORT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:support@musora.com')}
            style={[styles.centerContent, localStyles.button]}
          >
            <Text style={localStyles.buttonText}>EMAIL SUPPORT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${'18004398921'}`)}
            style={[styles.centerContent, localStyles.button]}
          >
            <Text style={localStyles.buttonText}>PHONE SUPPORT</Text>
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: onTablet ? 20 : 16,
              opacity: 0.8,
              color: colors.secondBackground,
              textAlign: 'center',
              padding: 10,
              paddingTop: 20,
            }}
          >
            EMAIL
          </Text>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: onTablet ? 18 : 14,
              textAlign: 'center',
              color: 'white',
              padding: 5,
            }}
          >
            support@musora.com
          </Text>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: onTablet ? 18 : 14,
              opacity: 0.8,
              color: colors.secondBackground,
              textAlign: 'center',
              padding: 10,
            }}
          >
            PHONE
          </Text>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: onTablet ? 18 : 14,
              textAlign: 'center',
              color: 'white',
              padding: 5,
            }}
          >
            1-800-439-8921
          </Text>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: onTablet ? 18 : 14,
              textAlign: 'center',
              color: 'white',
              padding: 5,
            }}
          >
            1-604-855-7605
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const localStyles = StyleSheet.create({
  button: {
    width: '80%',
    borderRadius: 200,
    backgroundColor: '#fb1b2f',
    alignSelf: 'center',
    marginVertical: 5,
  },
  buttonText: {
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: DeviceInfo.isTablet() ? 20 : 16,
    color: 'white',
    paddingVertical: 15,
  },
});
