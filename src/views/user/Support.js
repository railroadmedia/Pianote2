/**
 * Support
 */
import React from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import Intercom from 'react-native-intercom';
import { getUserData } from 'Pianote2/src/services/UserDataAuth.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-navigation';

export default class Support extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    const userData = await getUserData();
    console.log(userData);
    await Intercom.registerIdentifiedUser({
      userId: 'musora_' + userData.id.toString()
    });
    await Intercom.updateUser({
      email: userData.email,
      phone: userData.phone_number ? userData.phone_number.toString() : '',
      user_id: 'musora_' + userData.id.toString(),
      name: userData.display_name,
      custom_attributes: {
        // unique_id: auth.unique_id.toString(),
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

  onUnreadChange(event) {
    console.log(event);
  }

  onIntercomPress = () => {
    Intercom.displayMessenger();
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View
          style={{
            flex: 1,
            alignSelf: 'stretch',
            backgroundColor: colors.mainBackground
          }}
        >
          <View
            key={'header'}
            style={[
              styles.centerContent,
              {
                flex: 0.1
              }
            ]}
          >
            <View
              style={[
                styles.centerContent,
                {
                  position: 'absolute',
                  left: 0,
                  paddingLeft: 10,
                  bottom: 0,
                  height: 50,
                  width: 50,
                }
              ]}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={[
                  styles.centerContent,
                  {
                    height: '100%',
                    width: '100%'
                  }
                ]}
              >
                <Back
                  width={backButtonSize}
                  height={backButtonSize}
                  fill={colors.secondBackground}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.66 }} />
            <Text
              style={[
                styles.childHeaderText,
                { color: colors.secondBackground }
              ]}
            >
              Support
            </Text>
            <View style={{ flex: 0.33 }} />
          </View>

          <ScrollView
            key={'contentContainer'}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ height: '15%' }} />
            <TouchableOpacity
              onPress={() => this.onIntercomPress()}
              style={[styles.centerContent, localStyles.button]}
            >
              <Text
                style={{
                  fontFamily: 'RobotoCondensed-Bold',
                  fontSize: onTablet ? 20 : 16,
                  color: 'white',
                  paddingVertical: 15
                }}
              >
                LIVE CHAT SUPPORT
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:support@musora.com')}
              style={[styles.centerContent, localStyles.button]}
            >
              <Text
                style={{
                  fontFamily: 'RobotoCondensed-Bold',
                  fontSize: onTablet ? 20 : 16,
                  color: 'white',
                  paddingVertical: 15
                }}
              >
                EMAIL SUPPORT
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${'18004398921'}`)}
              style={[styles.centerContent, localStyles.button]}
            >
              <Text
                style={{
                  fontFamily: 'RobotoCondensed-Bold',
                  fontSize: onTablet ? 20 : 16,
                  color: 'white',
                  paddingVertical: 15
                }}
              >
                PHONE SUPPORT
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: onTablet ? 18 : 14,
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
              key={'emailaddress'}
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
              1-604-921-6721
            </Text>
          </ScrollView>
        </View>
        <NavigationBar currentPage={'PROFILE'} pad={true} />
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
    marginVertical: 5
  }
});
