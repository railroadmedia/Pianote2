import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  StyleSheet
} from 'react-native';
import Intercom from 'react-native-intercom';
import Back from '../../assets/img/svgs/back.svg';
import { SafeAreaView } from 'react-navigation';
import { goBack } from '../../../AppNavigator';

const onTablet = global.onTablet;

export default class SupportSignUp extends React.Component {
  componentDidMount = () => Intercom.registerUnidentifiedUser();

  onIntercomPress = () => Intercom.displayMessenger();

  render() {
    return (
      <SafeAreaView style={localStyles.mainContainer}>
        <View style={{ flex: 0.08 }}>
          <View
            style={[
              localStyles.centerContent,
              {
                position: 'absolute',
                left: 10,
                paddingLeft: 5,
                bottom: 10,
                height: 50,
                width: 50
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => goBack()}
              style={[
                localStyles.centerContent,
                {
                  height: '100%',
                  width: '100%'
                }
              ]}
            >
              <Back
                width={backButtonSize}
                height={backButtonSize}
                fill={'white'}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.66 }} />
          <Text
            style={[
              localStyles.childHeaderText,
              { color: colors.secondBackground }
            ]}
          >
            Support
          </Text>
          <View style={{ flex: 0.33 }} />
        </View>
        <ScrollView style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => this.onIntercomPress()}
            style={[
              localStyles.centerContent,
              localStyles.button,
              { marginTop: '30%' }
            ]}
          >
            <Text style={localStyles.buttonText}>LIVE CHAT SUPPORT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:support@musora.com')}
            style={[localStyles.centerContent, localStyles.button]}
          >
            <Text style={localStyles.buttonText}>EMAIL SUPPORT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${'18004398921'}`)}
            style={[localStyles.centerContent, localStyles.button]}
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
              paddingTop: 20
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
              padding: 5
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
              padding: 10
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
              padding: 5
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
              padding: 5
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
  mainContainer: {
    backgroundColor: '#00101d',
    flex: 1
  },
  button: {
    width: '80%',
    borderRadius: 200,
    backgroundColor: '#fb1b2f',
    alignSelf: 'center',
    marginVertical: 5
  },
  buttonText: {
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: onTablet ? 20 : 16,
    color: 'white',
    paddingVertical: 15
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  childHeaderText: {
    // used on search, see all, downloads,
    fontSize: onTablet ? 28 : 20,
    color: 'white',
    fontFamily: 'OpenSans-ExtraBold',
    alignSelf: 'center',
    textAlign: 'center'
  }
});
