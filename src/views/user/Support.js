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
  StatusBar
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
      <View style={styles.container}>
        <SafeAreaView
          forceInset={{ top: onTablet ? 'never' : 'always' }}
          style={[
            styles.mainContainer,
            { backgroundColor: colors.thirdBackground }
          ]}
        >
          <StatusBar
            backgroundColor={colors.thirdBackground}
            barStyle={'light-content'}
          />
          <View
            key={'header'}
            style={{
              backgroundColor: colors.thirdBackground,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 15
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ flex: 1 }}
            >
              <Back
                width={(onTablet ? 17.5 : 25) * factorRatio}
                height={(onTablet ? 17.5 : 25) * factorRatio}
                fill={colors.secondBackground}
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.childHeaderText,
                {
                  color: colors.secondBackground,
                  textAlign: 'center'
                }
              ]}
            >
              Support
            </Text>
            <View style={{ flex: 1 }} />
          </View>
          <ScrollView
            key={'contentContainer'}
            style={styles.mainContainer}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center'
              }}
            >
              <TouchableOpacity
                onPress={() => this.onIntercomPress()}
                style={[
                  styles.centerContent,
                  {
                    borderRadius: 200,
                    backgroundColor: '#fb1b2f',
                    marginHorizontal: '7%',
                    marginBottom: 10 * factorVertical
                  }
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'RobotoCondensed-Bold',
                    fontSize: 18 * factorRatio,
                    color: 'white',
                    paddingVertical: 15
                  }}
                >
                  LIVE CHAT SUPPORT
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL('mailto:support@musora.com')}
                style={[
                  styles.centerContent,
                  {
                    borderRadius: 200,
                    backgroundColor: '#fb1b2f',
                    marginHorizontal: '7%',
                    marginBottom: 10 * factorVertical
                  }
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'RobotoCondensed-Bold',
                    fontSize: 18 * factorRatio,
                    color: 'white',
                    paddingVertical: 15
                  }}
                >
                  EMAIL SUPPORT
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${'18004398921'}`)}
                style={[
                  styles.centerContent,
                  {
                    borderRadius: 200,
                    backgroundColor: '#fb1b2f',
                    marginHorizontal: '7%',
                    marginBottom: 10 * factorVertical
                  }
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'RobotoCondensed-Bold',
                    fontSize: 18 * factorRatio,
                    color: 'white',
                    paddingVertical: 15
                  }}
                >
                  PHONE SUPPORT
                </Text>
              </TouchableOpacity>

              <Text
                key={'email'}
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 14 * factorRatio,
                  opacity: 0.8,
                  color: colors.secondBackground,
                  textAlign: 'center',
                  marginBottom: 5 * factorRatio
                }}
              >
                EMAIL
              </Text>

              <Text
                key={'emailaddress'}
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 13.5 * factorRatio,
                  textAlign: 'center',
                  color: 'white',
                  marginBottom: 20 * factorRatio
                }}
              >
                support@musora.com
              </Text>
              <Text
                key={'phone'}
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 14 * factorRatio,
                  opacity: 0.8,
                  color: colors.secondBackground,
                  textAlign: 'center',
                  marginBottom: 5 * factorRatio
                }}
              >
                PHONE
              </Text>
              <Text
                key={'phoneNumber'}
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 13.5 * factorRatio,
                  textAlign: 'center',
                  color: 'white',
                  marginBottom: 5 * factorRatio
                }}
              >
                1-800-439-8921
              </Text>
              <Text
                key={'phoneNumber2'}
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 13.5 * factorRatio,
                  textAlign: 'center',
                  color: 'white'
                }}
              >
                1-604-921-6721
              </Text>
            </View>
          </ScrollView>
          <NavigationBar currentPage={'PROFILE'} pad={true} />
        </SafeAreaView>
      </View>
    );
  }
}
