/**
 * NotificationSettings
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Dimensions
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import { getUserData } from 'Pianote2/src/services/UserDataAuth.js';
import CustomSwitch from 'Pianote2/src/components/CustomSwitch.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import commonService from '../../services/common.service';
import { NetworkContext } from '../../context/NetworkProvider';
import { SafeAreaView } from 'react-navigation';

export default class NotificationSettings extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      notifications_summary_frequency_minutes: 0,
      notify_on_forum_followed_thread_reply: false,
      notify_on_forum_post_like: false,
      notify_on_forum_post_reply: false,
      notify_on_lesson_comment_like: false,
      notify_on_lesson_comment_reply: false,
      notify_weekly_update: false,
      isLoading: true
    };
  }

  UNSAFE_componentWillMount = async () => {
    let userData = await getUserData();

    console.log(
      'original user data : ',
      userData.notifications_summary_frequency_minutes
    );

    this.setState({
      notifications_summary_frequency_minutes:
        userData.notifications_summary_frequency_minutes,
      notify_on_forum_followed_thread_reply:
        userData.notify_on_forum_followed_thread_reply,
      notify_on_forum_post_like: userData.notify_on_forum_post_like,
      notify_on_forum_post_reply: userData.notify_on_forum_post_reply,
      notify_on_lesson_comment_like: userData.notify_on_lesson_comment_like,
      notify_on_lesson_comment_reply: userData.notify_on_lesson_comment_reply,
      notify_weekly_update: userData.notify_weekly_update,
      isLoading: false
    });
  };

  changeNotificationStatus = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    try {
      const body = {
        data: {
          type: 'user',
          attributes: {
            notifications_summary_frequency_minutes: this.state
              .notifications_summary_frequency_minutes,
            notify_on_forum_post_like: this.state.notify_on_forum_post_like,
            notify_on_forum_post_reply: this.state.notify_on_forum_post_reply,
            notify_on_lesson_comment_like: this.state
              .notify_on_lesson_comment_like,
            notify_on_lesson_comment_reply: this.state
              .notify_on_lesson_comment_reply,
            notify_weekly_update: this.state.notify_weekly_update
          }
        }
      };

      let response = await commonService.tryCall(
        `${commonService.rootUrl}/usora/api/profile/update`,
        'POST',
        body
      );

      console.log('response to change notification: ', response);
    } catch (error) {
      console.log('ERROR: ', error);
    }
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
          <View style={localStyles.header}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                this.state.currentlyView == 'Profile Settings'
                  ? this.props.navigation.goBack()
                  : this.setState({
                      currentlyView: 'Profile Settings'
                    });
              }}
            >
              <EntypoIcon
                name={'chevron-thin-left'}
                size={22.5 * factorRatio}
                color={colors.secondBackground}
              />
            </TouchableOpacity>
            <Text style={[styles.childHeaderText, localStyles.title]}>
              Notification Settings
            </Text>
            <View style={{ flex: 1 }} />
          </View>
          {this.state.isLoading && (
            <View style={[styles.centerContent, styles.mainContainer]}>
              <ActivityIndicator
                size={onTablet ? 'large' : 'small'}
                animating={true}
                color={colors.secondBackground}
              />
            </View>
          )}
          {!this.state.isLoading && (
            <ScrollView style={styles.mainContainer}>
              <View style={localStyles.noteTypeContainer}>
                <Text style={localStyles.noteTypeText}>Notification Types</Text>
              </View>
              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Weekly community updates</Text>
                <CustomSwitch
                  isClicked={this.state.notify_weekly_update}
                  clicked={bool => {
                    console.log('bool: ', bool),
                      this.setState(
                        {
                          notify_weekly_update: bool
                        },
                        () => this.changeNotificationStatus()
                      );
                  }}
                />
              </View>

              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Comment replies</Text>
                <CustomSwitch
                  isClicked={this.state.notify_on_lesson_comment_reply}
                  clicked={bool => {
                    this.setState(
                      {
                        notify_on_lesson_comment_reply: bool
                      },
                      () => this.changeNotificationStatus()
                    );
                  }}
                />
              </View>
              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Comment likes</Text>
                <CustomSwitch
                  isClicked={this.state.notify_on_lesson_comment_like}
                  clicked={bool => {
                    this.setState(
                      {
                        notify_on_lesson_comment_like: bool
                      },
                      () => this.changeNotificationStatus()
                    );
                  }}
                />
              </View>

              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Forum post replies</Text>
                <CustomSwitch
                  isClicked={this.state.notify_on_forum_post_reply}
                  clicked={bool => {
                    this.setState(
                      {
                        notify_on_forum_post_reply: bool
                      },
                      () => this.changeNotificationStatus()
                    );
                  }}
                />
              </View>
              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Forum post likes</Text>
                <CustomSwitch
                  isClicked={this.state.notify_on_forum_post_like}
                  clicked={bool => {
                    this.setState(
                      {
                        notify_on_forum_post_like: bool
                      },
                      () => this.changeNotificationStatus()
                    );
                  }}
                />
              </View>
              <View style={localStyles.border} />
              <View style={localStyles.emailNotificationFrequency}>
                <Text style={[localStyles.text, { paddingVertical: 10 }]}>
                  Email Notification Frequency
                </Text>
              </View>

              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Immediate</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState(
                      {
                        notifications_summary_frequency_minutes: 1
                      },
                      () => this.changeNotificationStatus()
                    );
                  }}
                  style={[
                    styles.centerContent,
                    {
                      backgroundColor:
                        this.state.notifications_summary_frequency_minutes == 1
                          ? '#fb1b2f'
                          : colors.secondBackground,
                      borderRadius: 100,
                      width: (onTablet ? 22.5 : 27.5) * factorRatio,
                      height: (onTablet ? 22.5 : 27.5) * factorRatio
                    }
                  ]}
                >
                  {this.state.notifications_summary_frequency_minutes == 1 && (
                    <FontIcon
                      name={'check'}
                      size={(onTablet ? 17.5 : 20) * factorRatio}
                      color={'white'}
                    />
                  )}
                  {this.state.notifications_summary_frequency_minutes !== 1 && (
                    <EntypoIcon
                      name={'cross'}
                      size={(onTablet ? 18.5 : 22.5) * factorRatio}
                      color={'white'}
                    />
                  )}
                </TouchableOpacity>
              </View>

              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Once per day</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState(
                      {
                        notifications_summary_frequency_minutes: 1440
                      },
                      () => this.changeNotificationStatus()
                    );
                  }}
                  style={[
                    styles.centerContent,
                    {
                      backgroundColor:
                        this.state.notifications_summary_frequency_minutes ==
                        1440
                          ? '#fb1b2f'
                          : colors.secondBackground,
                      borderRadius: 100,
                      width: (onTablet ? 22.5 : 27.5) * factorRatio,
                      height: (onTablet ? 22.5 : 27.5) * factorRatio
                    }
                  ]}
                >
                  {this.state.notifications_summary_frequency_minutes ==
                    1440 && (
                    <FontIcon
                      name={'check'}
                      size={(onTablet ? 17.5 : 20) * factorRatio}
                      color={'white'}
                    />
                  )}
                  {this.state.notifications_summary_frequency_minutes !==
                    1440 && (
                    <EntypoIcon
                      name={'cross'}
                      size={(onTablet ? 18.5 : 22.5) * factorRatio}
                      color={'white'}
                    />
                  )}
                </TouchableOpacity>
              </View>

              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Never</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState(
                      {
                        notifications_summary_frequency_minutes: 0
                      },
                      () => this.changeNotificationStatus()
                    );
                  }}
                  style={[
                    styles.centerContent,
                    {
                      backgroundColor:
                        this.state.notifications_summary_frequency_minutes ==
                          0 ||
                        this.state.notifications_summary_frequency_minutes ==
                          null
                          ? '#fb1b2f'
                          : colors.secondBackground,
                      borderRadius: 100,
                      width: (onTablet ? 22.5 : 27.5) * factorRatio,
                      height: (onTablet ? 22.5 : 27.5) * factorRatio
                    }
                  ]}
                >
                  {(this.state.notifications_summary_frequency_minutes == 0 ||
                    this.state.notifications_summary_frequency_minutes ==
                      null) && (
                    <FontIcon
                      name={'check'}
                      size={(onTablet ? 17.5 : 20) * factorRatio}
                      color={'white'}
                    />
                  )}
                  {this.state.notifications_summary_frequency_minutes !== 0 &&
                    this.state.notifications_summary_frequency_minutes !==
                      null && (
                      <EntypoIcon
                        name={'cross'}
                        size={(onTablet ? 18.5 : 22.5) * factorRatio}
                        color={'white'}
                      />
                    )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

          <NavigationBar currentPage={'PROFILE'} pad={true} />
        </SafeAreaView>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius:
      (15 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    margin:
      (20 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    height: 200,
    width: '80%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#081826'
  },
  title: {
    textAlign: 'center',
    color: '#445f73'
  },
  noteTypeContainer: {
    paddingLeft: 15,
    width: '100%',
    justifyContent: 'center',
    fontSize:
      (18 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  noteTypeText: {
    marginTop:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    fontFamily: 'OpenSans-Regular',
    fontSize:
      ((DeviceInfo.isTablet() ? 14 : 16) *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    color: '#445f73',
    paddingVertical: 5
  },
  textContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize:
      ((DeviceInfo.isTablet() ? 14 : 16) *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    color: '#445f73'
  },
  emailNotificationFrequency: {
    paddingLeft: 15,
    width: '100%',
    justifyContent: 'center',
    fontSize:
      (18 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  border: {
    height:
      ((DeviceInfo.isTablet() ? 15 : 25) * Dimensions.get('window').height) /
      812,
    borderBottomColor: '#445f73',
    borderBottomWidth: 1
  }
});
