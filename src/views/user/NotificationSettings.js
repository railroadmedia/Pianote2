/**
 * NotificationSettings
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import { getUserData } from 'Pianote2/src/services/UserDataAuth.js';
import CustomSwitch from 'Pianote2/src/components/CustomSwitch.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import commonService from '../../services/common.service';
import { NetworkContext } from '../../context/NetworkProvider';

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
      console.log(response);
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignSelf: 'stretch',
          backgroundColor: colors.mainBackground
        }}
      >
        <View key={'contentContainer'} style={{ flex: 1 }}>
          <View
            key={'buffer'}
            style={{
              height: 15 * factorVertical
            }}
          ></View>
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
              key={'goback'}
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
                  this.state.currentlyView == 'Profile Settings'
                    ? this.props.navigation.goBack()
                    : this.setState({
                        currentlyView: 'Profile Settings'
                      });
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
            <Text
              style={{
                fontSize: 22 * factorRatio,
                fontWeight: 'bold',
                fontFamily: 'OpenSans-Regular',
                color: colors.secondBackground
              }}
            >
              Notification Settings
            </Text>
          </View>
          {this.state.isLoading && (
            <View style={[styles.centerContent, { flex: 1 }]}>
              <ActivityIndicator
                size={onTablet ? 'large' : 'small'}
                animating={true}
                color={colors.secondBackground}
              />
            </View>
          )}
          {!this.state.isLoading && (
            <ScrollView style={{ flex: 1 }}>
              <View
                key={'notifcationTypes'}
                style={{
                  paddingLeft: 15,
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: 18 * factorRatio
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16 * factorRatio,
                    color: colors.secondBackground,
                    paddingVertical: 5
                  }}
                >
                  Notification Types
                </Text>
              </View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16 * factorRatio,
                    color: colors.secondBackground
                  }}
                >
                  Weekly community updates
                </Text>

                <CustomSwitch
                  isClicked={this.state.notify_weekly_update}
                  clicked={bool => {
                    this.changeNotificationStatus(),
                      this.setState({
                        weeklyCommunityUpdatesClicked: bool
                      });
                  }}
                />
              </View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16 * factorRatio,
                    color: colors.secondBackground
                  }}
                >
                  Comment replies
                </Text>

                <CustomSwitch
                  isClicked={this.state.notify_on_lesson_comment_reply}
                  clicked={bool => {
                    this.changeNotificationStatus(),
                      this.setState({
                        notify_on_lesson_comment_reply: bool
                      });
                  }}
                />
              </View>
              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16 * factorRatio,
                    color: colors.secondBackground
                  }}
                >
                  Comment likes
                </Text>

                <CustomSwitch
                  isClicked={this.state.commentLikesClicked}
                  clicked={bool => {
                    this.changeNotificationStatus(),
                      this.setState({
                        notify_on_lesson_comment_like: bool
                      });
                  }}
                />
              </View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16 * factorRatio,
                    color: colors.secondBackground
                  }}
                >
                  Forum post replies
                </Text>
                <CustomSwitch
                  isClicked={this.state.notify_on_forum_post_reply}
                  clicked={() => {
                    this.changeNotificationStatus(),
                      this.setState({
                        notify_on_forum_post_reply: bool
                      });
                  }}
                />
              </View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16 * factorRatio,
                    color: colors.secondBackground
                  }}
                >
                  Forum post likes
                </Text>

                <CustomSwitch
                  isClicked={this.state.notify_on_forum_post_like}
                  clicked={bool => {
                    this.changeNotificationStatus(),
                      this.setState({
                        notify_on_forum_post_like: bool
                      });
                  }}
                />
              </View>

              <View
                key={'border'}
                style={{
                  height: 25 * factorVertical,
                  borderBottomColor: colors.secondBackground,
                  borderBottomWidth: 1 * factorRatio
                }}
              />
              <View
                key={'emailNotificationFrequency'}
                style={{
                  paddingLeft: 15,
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: 18 * factorRatio
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16 * factorRatio,
                    color: colors.secondBackground,
                    paddingVertical: 5
                  }}
                >
                  Email Notification Frequency
                </Text>
              </View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16 * factorRatio,
                    color: colors.secondBackground
                  }}
                >
                  Immediate
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    this.changeNotificationStatus(),
                      this.setState({
                        notifications_summary_frequency_minutes: 1
                      });
                  }}
                  style={[
                    styles.centerContent,
                    {
                      backgroundColor:
                        this.state.notifications_summary_frequency_minutes == 1
                          ? '#fb1b2f'
                          : colors.secondBackground,
                      borderRadius: 100
                    }
                  ]}
                >
                  {this.state.notifications_summary_frequency_minutes == 1 && (
                    <FontIcon
                      name={'check'}
                      size={20 * factorRatio}
                      color={'white'}
                    />
                  )}
                  {this.state.notifications_summary_frequency_minutes !== 1 && (
                    <EntypoIcon
                      name={'cross'}
                      size={22.5 * factorRatio}
                      color={'white'}
                    />
                  )}
                </TouchableOpacity>
              </View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16 * factorRatio,
                    color: colors.secondBackground
                  }}
                >
                  Once per day
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    this.changeNotificationStatus(),
                      this.setState({
                        notifications_summary_frequency_minutes: 1440
                      });
                  }}
                  style={[
                    styles.centerContent,
                    {
                      backgroundColor:
                        this.state.notifications_summary_frequency_minutes == 1
                          ? '#fb1b2f'
                          : colors.secondBackground,
                      borderRadius: 100
                    }
                  ]}
                >
                  {this.state.notifications_summary_frequency_minutes ==
                    1440 && (
                    <FontIcon
                      name={'check'}
                      size={20 * factorRatio}
                      color={'white'}
                    />
                  )}
                  {this.state.notifications_summary_frequency_minutes !==
                    1440 && (
                    <EntypoIcon
                      name={'cross'}
                      size={22.5 * factorRatio}
                      color={'white'}
                    />
                  )}
                </TouchableOpacity>
              </View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16 * factorRatio,
                    color: colors.secondBackground
                  }}
                >
                  Never
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    this.changeNotificationStatus(),
                      this.setState({
                        notifications_summary_frequency_minutes: 0
                      });
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
                      borderRadius: 100
                    }
                  ]}
                >
                  {(this.state.notifications_summary_frequency_minutes == 0 ||
                    this.state.notifications_summary_frequency_minutes ==
                      null) && (
                    <FontIcon
                      name={'check'}
                      size={20 * factorRatio}
                      color={'white'}
                    />
                  )}
                  {this.state.notifications_summary_frequency_minutes !== 0 &&
                    this.state.notifications_summary_frequency_minutes !==
                      null && (
                      <EntypoIcon
                        name={'cross'}
                        size={22.5 * factorRatio}
                        color={'white'}
                      />
                    )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
        <NavigationBar currentPage={'PROFILE'} />
      </View>
    );
  }
}
