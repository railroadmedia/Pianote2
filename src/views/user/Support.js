import React from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import Back from '../../assets/img/svgs/back.svg';
import Intercom from 'react-native-intercom';
import NavigationBar from 'Pianote2/src/components/NavigationBar';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-navigation';
import { goBack } from '../../../AppNavigator';
import { connect } from 'react-redux';

const onTablet = global.onTablet;

class Support extends React.Component {
  componentDidMount = async () => {
    const { id, email, phone_number, display_name } = this.props.user;
    await Intercom.registerIdentifiedUser({
      userId: 'musora_' + id.toString()
    });
    await Intercom.updateUser({
      email: email,
      phone: phone_number ? phone_number.toString() : '',
      user_id: 'musora_' + id.toString(),
      name: display_name,
      custom_attributes: {
        app_build_number: '0.0.' + DeviceInfo.getBuildNumber()
      }
    });
    Intercom.addEventListener(
      Intercom.Notifications.UNREAD_COUNT,
      this.onUnreadChange
    );
    Intercom.addEventListener(
      Intercom.Notifications.WINDOW_DID_HIDE,
      this.onUnreadChange
    );
    Intercom.handlePushMessage();
  };

  componentWillUnmount() {
    Intercom.removeEventListener(
      Intercom.Notifications.UNREAD_COUNT,
      this.onUnreadChange
    );
    Intercom.removeEventListener(
      Intercom.Notifications.WINDOW_DID_HIDE,
      this.onUnreadChange
    );
  }

  onUnreadChange = event => console.log(event);

  onIntercomPress = () => Intercom.displayMessenger();

  render() {
    return (
      <SafeAreaView style={localStyles.mainContainer}>
        <View style={[localStyles.centerContent, { flex: 0.07 }]}>
          <View
            style={[
              localStyles.centerContent,
              {
                position: 'absolute',
                left: 0,
                paddingLeft: 10,
                bottom: 0,
                height: 50,
                width: 50
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => goBack()}
              style={[
                localStyles.centerContent,
                { height: '100%', width: '100%' }
              ]}
            >
              <Back
                width={backButtonSize}
                height={backButtonSize}
                fill={colors.secondBackground}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              localStyles.childHeaderText,
              { color: colors.secondBackground }
            ]}
          >
            Support
          </Text>
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
            style={[
              localStyles.phoneEmailText,
              {
                padding: 10,
                paddingTop: 20
              }
            ]}
          >
            EMAIL
          </Text>
          <Text style={localStyles.phoneNumberEmailAddress}>
            support@musora.com
          </Text>
          <Text style={localStyles.phoneEmailText}>PHONE</Text>
          <Text style={localStyles.phoneNumberEmailAddress}>
            1-800-439-8921
          </Text>
          <Text style={localStyles.phoneNumberEmailAddress}>
            1-604-855-7605
          </Text>
        </ScrollView>
        <NavigationBar currentPage={'PROFILE'} pad={true} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.userState.user
});

export default connect(mapStateToProps, null)(Support);

const localStyles = StyleSheet.create({
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
  phoneEmailText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 18 : 14,
    color: '#445f73',
    textAlign: 'center',
    padding: 10
  },
  phoneNumberEmailAddress: {
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 18 : 14,
    textAlign: 'center',
    color: 'white',
    padding: 5
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  mainContainer: {
    backgroundColor: '#00101d',
    flex: 1
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
