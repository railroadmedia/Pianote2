/**
 * Settings
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import LogOut from '../../modals/LogOut.js';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';

export default class Settings extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      showLogOut: false
    };
  }

  render() {
    return (
      <View styles={{ flex: 1, alignSelf: 'stretch' }}>
        <View
          style={{
            height: fullHeight - navHeight,
            alignSelf: 'stretch',
            backgroundColor: colors.mainBackground
          }}
        >
          <View key={'contentContainer'} style={{ flex: 1 }}>
            <View
              key={'buffer'}
              style={{
                height: isNotch ? 15 * factorVertical : 0
              }}
            ></View>
            <View
              key={'mySettings'}
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
                    bottom: 0 * factorRatio,
                    height: 50 * factorRatio,
                    width: 50 * factorRatio
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                  style={[
                    styles.centerContent,
                    {
                      height: '100%',
                      width: '100%'
                    }
                  ]}
                >
                  <EntypoIcon
                    name={'chevron-thin-left'}
                    size={22.5 * factorRatio}
                    color={colors.secondBackground}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.66 }} />
              <Text
                style={{
                  fontSize: 22 * factorRatio,
                  fontWeight: 'bold',
                  fontFamily: 'OpenSans',
                  color: colors.secondBackground
                }}
              >
                Settings
              </Text>
              <View style={{ flex: 0.33 }} />
            </View>
            <View
              key={'scrollview'}
              style={{
                flex: 0.95
              }}
            >
              <ScrollView>
                <TouchableOpacity
                  key={'profileSettings'}
                  onPress={() => {
                    this.props.navigation.navigate('PROFILESETTINGS');
                  }}
                  style={[
                    styles.centerContent,
                    {
                      height: 50 * factorRatio,
                      width: fullWidth,
                      borderBottomColor: colors.secondBackground,
                      borderBottomWidth: 1 * factorRatio,
                      borderTopWidth: 0.5 * factorRatio,
                      borderTopColor: colors.secondBackground,
                      flexDirection: 'row',
                      paddingRight: fullWidth * 0.025
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.centerContent,
                      { width: 60 * factorHorizontal }
                    ]}
                  >
                    <FeatherIcon
                      name={'user'}
                      size={25 * factorRatio}
                      color={colors.pianoteRed}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18 * factorRatio,
                      color: colors.secondBackground
                    }}
                  >
                    Profile Settings
                  </Text>
                  <View style={{ flex: 1 }} />
                  <AntIcon
                    name={'right'}
                    size={22.5 * factorRatio}
                    color={colors.secondBackground}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  key={'notificationSettings'}
                  onPress={() => {
                    this.props.navigation.navigate('NOTIFICATIONSETTINGS');
                  }}
                  style={[
                    styles.centerContent,
                    {
                      height: 50 * factorRatio,
                      width: fullWidth,
                      borderBottomColor: colors.secondBackground,
                      borderBottomWidth: 1 * factorRatio,
                      flexDirection: 'row',
                      paddingRight: fullWidth * 0.025
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.centerContent,
                      { width: 60 * factorHorizontal }
                    ]}
                  >
                    <IonIcon
                      name={'ios-notifications-outline'}
                      color={colors.pianoteRed}
                      size={35 * factorRatio}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18 * factorRatio,
                      color: colors.secondBackground
                    }}
                  >
                    Notification Settings
                  </Text>
                  <View style={{ flex: 1 }} />
                  <AntIcon
                    name={'right'}
                    size={22.5 * factorRatio}
                    color={colors.secondBackground}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  key={'paymentHistory'}
                  onPress={() => {
                    this.props.navigation.navigate('PAYMENTHISTORY');
                  }}
                  style={[
                    styles.centerContent,
                    {
                      height: 50 * factorRatio,
                      width: fullWidth,
                      borderBottomColor: colors.secondBackground,
                      borderBottomWidth: 1 * factorRatio,
                      flexDirection: 'row',
                      paddingRight: fullWidth * 0.025
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.centerContent,
                      { width: 60 * factorHorizontal }
                    ]}
                  >
                    <FontIcon
                      name={'credit-card'}
                      size={24 * factorRatio}
                      color={colors.pianoteRed}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18 * factorRatio,
                      color: colors.secondBackground
                    }}
                  >
                    Payment History
                  </Text>
                  <View style={{ flex: 1 }} />
                  <AntIcon
                    name={'right'}
                    size={22.5 * factorRatio}
                    color={colors.secondBackground}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  key={'manageSubscriptions'}
                  style={[
                    styles.centerContent,
                    {
                      height: 50 * factorRatio,
                      width: fullWidth,
                      borderBottomColor: colors.secondBackground,
                      borderBottomWidth: 1 * factorRatio,
                      flexDirection: 'row',
                      paddingRight: fullWidth * 0.025
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.centerContent,
                      { width: 60 * factorHorizontal }
                    ]}
                  >
                    <AntIcon
                      name={'folder1'}
                      size={25 * factorRatio}
                      color={colors.pianoteRed}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18 * factorRatio,
                      color: colors.secondBackground
                    }}
                  >
                    Manage Subscriptions
                  </Text>
                  <View style={{ flex: 1 }} />
                  <AntIcon
                    name={'right'}
                    size={22.5 * factorRatio}
                    color={colors.secondBackground}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  key={'support'}
                  onPress={() => {
                    this.props.navigation.navigate('SUPPORT');
                  }}
                  style={[
                    styles.centerContent,
                    {
                      height: 50 * factorRatio,
                      width: fullWidth,
                      borderBottomColor: colors.secondBackground,
                      borderBottomWidth: 1 * factorRatio,
                      flexDirection: 'row',
                      paddingRight: fullWidth * 0.025
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.centerContent,
                      { width: 60 * factorHorizontal }
                    ]}
                  >
                    <FontIcon
                      name={'support'}
                      size={25 * factorRatio}
                      color={colors.pianoteRed}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18 * factorRatio,
                      color: colors.secondBackground
                    }}
                  >
                    Support
                  </Text>
                  <View style={{ flex: 1 }} />
                  <AntIcon
                    name={'right'}
                    size={22.5 * factorRatio}
                    color={colors.secondBackground}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  key={'termsOfUse'}
                  onPress={() => {
                    this.props.navigation.navigate('TERMS');
                  }}
                  style={[
                    styles.centerContent,
                    {
                      height: 50 * factorRatio,
                      width: fullWidth,
                      borderBottomColor: colors.secondBackground,
                      borderBottomWidth: 1 * factorRatio,
                      flexDirection: 'row',
                      paddingRight: fullWidth * 0.025
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.centerContent,
                      { width: 60 * factorHorizontal }
                    ]}
                  >
                    <AntIcon
                      name={'form'}
                      size={25 * factorRatio}
                      color={colors.pianoteRed}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18 * factorRatio,
                      color: colors.secondBackground
                    }}
                  >
                    Terms of Use
                  </Text>
                  <View style={{ flex: 1 }} />
                  <AntIcon
                    name={'right'}
                    size={22.5 * factorRatio}
                    color={colors.secondBackground}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  key={'privacyPolicy'}
                  onPress={() => {
                    this.props.navigation.navigate('PRIVACYPOLICY');
                  }}
                  style={[
                    styles.centerContent,
                    {
                      height: 50 * factorRatio,
                      width: fullWidth,
                      borderBottomColor: colors.secondBackground,
                      borderBottomWidth: 1 * factorRatio,
                      flexDirection: 'row',
                      paddingRight: fullWidth * 0.025
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.centerContent,
                      { width: 60 * factorHorizontal }
                    ]}
                  >
                    <FontIcon
                      name={'shield'}
                      color={colors.pianoteRed}
                      size={27.5 * factorRatio}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18 * factorRatio,
                      color: colors.secondBackground
                    }}
                  >
                    Privacy Policy
                  </Text>
                  <View style={{ flex: 1 }} />
                  <AntIcon
                    name={'right'}
                    size={22.5 * factorRatio}
                    color={colors.secondBackground}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  key={'logOut'}
                  onPress={() => {
                    this.setState({ showLogOut: true });
                  }}
                  style={[
                    styles.centerContent,
                    {
                      height: 50 * factorRatio,
                      width: fullWidth,
                      borderBottomColor: colors.secondBackground,
                      borderBottomWidth: 1 * factorRatio,
                      flexDirection: 'row',
                      paddingRight: fullWidth * 0.025
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.centerContent,
                      { width: 60 * factorHorizontal }
                    ]}
                  >
                    <AntIcon
                      name={'poweroff'}
                      color={colors.pianoteRed}
                      size={23.5 * factorRatio}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18 * factorRatio,
                      color: colors.secondBackground
                    }}
                  >
                    Log Out
                  </Text>
                  <View style={{ flex: 1 }} />
                  <AntIcon
                    name={'right'}
                    size={22.5 * factorRatio}
                    color={colors.secondBackground}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    textAlign: 'center',
                    color: colors.secondBackground,
                    marginTop: 15 * factorRatio,
                    fontSize: 12 * factorRatio
                  }}
                >
                  APP VERSION 1.0.7
                </Text>
              </ScrollView>
            </View>
          </View>
          <Modal
            key={'logout'}
            isVisible={this.state.showLogOut}
            style={[
              styles.centerContent,
              {
                margin: 0,
                height: fullHeight,
                width: fullWidth
              }
            ]}
            animation={'slideInUp'}
            animationInTiming={250}
            animationOutTiming={250}
            coverScreen={true}
            hasBackdrop={true}
          >
            <LogOut
              hideLogOut={() => {
                this.setState({ showLogOut: false });
              }}
            />
          </Modal>

          <NavigationBar currentPage={'PROFILE'} />
        </View>
      </View>
    );
  }
}
