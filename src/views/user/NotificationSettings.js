import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet
} from 'react-native';
import Back from '../../assets/img/svgs/back.svg';
import DeviceInfo from 'react-native-device-info';
import Icon from '../../assets/icons.js';
import CustomSwitch from '../../components/CustomSwitch.js';
import NavigationBar from '../../components/NavigationBar.js';
import {
  changeNotificationSettings,
  getNotificationSettings
} from '../../services/notification.service';
import { NetworkContext } from '../../context/NetworkProvider';
import { SafeAreaView } from 'react-navigation';
import { goBack } from '../../../AppNavigator';
import { connect } from 'react-redux';

const isTablet = DeviceInfo.isTablet();

class NotificationSettings extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      notify_on_post_in_followed_forum_thread: false,
      notify_on_forum_followed_thread_reply: false,
      notify_on_lesson_comment_like: false,
      notify_on_lesson_comment_reply: false,
      notifications_summary_frequency_minutes: 0, //?
      isLoading: true
    };
  }

  componentDidMount() {
    this.getNotificationSettings();
  }

  async getNotificationSettings() {
    const settings = (await getNotificationSettings()).data;
    const {
      notify_on_forum_followed_thread_reply,
      notify_on_forum_post_like,
      notify_on_lesson_comment_like,
      notify_on_lesson_comment_reply,
      notify_on_post_in_followed_forum_thread
    } = settings;
    this.setState({
      notify_on_post_in_followed_forum_thread,
      notify_on_forum_followed_thread_reply,
      notify_on_lesson_comment_like,
      notify_on_lesson_comment_reply,
      isLoading: false
    });
    console.log(settings);
  }

  changeNotificationStatus = datum => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    const setting_name = Object.keys(datum)[0];
    const setting_value = Object.values(datum)[0];
    const body = {
      user_id: this.props.user.id,
      setting_name,
      setting_value
    };
    changeNotificationSettings(body);
  };

  render() {
    return (
      <>
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
                  ? goBack()
                  : this.setState({
                      currentlyView: 'Profile Settings'
                    });
              }}
            >
              <Back
                width={backButtonSize}
                height={backButtonSize}
                fill={colors.secondBackground}
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
              <Text style={localStyles.noteTypeText}>Notification Types</Text>
              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Followed forum posts</Text>
                <CustomSwitch
                  isClicked={this.state.notify_on_post_in_followed_forum_thread}
                  onClick={bool =>
                    this.changeNotificationStatus({
                      notify_on_post_in_followed_forum_thread: bool
                    })
                  }
                />
              </View>
              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Followed forum replies</Text>
                <CustomSwitch
                  isClicked={this.state.notify_on_forum_followed_thread_reply}
                  onClick={bool =>
                    this.changeNotificationStatus({
                      notify_on_forum_followed_thread_reply: bool
                    })
                  }
                />
              </View>

              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Comment replies</Text>
                <CustomSwitch
                  isClicked={this.state.notify_on_lesson_comment_reply}
                  onClick={bool =>
                    this.changeNotificationStatus({
                      notify_on_lesson_comment_reply: bool
                    })
                  }
                />
              </View>
              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Comment likes</Text>
                <CustomSwitch
                  isClicked={this.state.notify_on_lesson_comment_like}
                  onClick={bool =>
                    this.changeNotificationStatus({
                      notify_on_lesson_comment_like: bool
                    })
                  }
                />
              </View>
              <View style={localStyles.border} />
              <Text style={[localStyles.text, { padding: 10 }]}>
                Email Notification Frequency
              </Text>
              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Immediate</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.changeNotificationStatus({
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
                      borderRadius: 100,
                      width: onTablet ? 35 : 27.5,
                      height: onTablet ? 35 : 27.5
                    }
                  ]}
                >
                  {this.state.notifications_summary_frequency_minutes == 1 && (
                    <Icon.FontAwesome
                      name={'check'}
                      size={onTablet ? 25 : 20}
                      color={'white'}
                    />
                  )}
                  {this.state.notifications_summary_frequency_minutes !== 1 && (
                    <Icon.Entypo
                      name={'cross'}
                      size={onTablet ? 35 : 25}
                      color={'white'}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Once per day</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.changeNotificationStatus({
                      notifications_summary_frequency_minutes: 1440
                    });
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
                      width: onTablet ? 35 : 27.5,
                      height: onTablet ? 35 : 27.5
                    }
                  ]}
                >
                  {this.state.notifications_summary_frequency_minutes ==
                    1440 && (
                    <Icon.FontAwesome
                      name={'check'}
                      size={onTablet ? 25 : 20}
                      color={'white'}
                    />
                  )}
                  {this.state.notifications_summary_frequency_minutes !==
                    1440 && (
                    <Icon.Entypo
                      name={'cross'}
                      size={onTablet ? 35 : 25}
                      color={'white'}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={localStyles.textContainer}>
                <Text style={localStyles.text}>Never</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.changeNotificationStatus({
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
                      borderRadius: 100,
                      width: onTablet ? 35 : 27.5,
                      height: onTablet ? 35 : 27.5
                    }
                  ]}
                >
                  {(this.state.notifications_summary_frequency_minutes == 0 ||
                    this.state.notifications_summary_frequency_minutes ==
                      null) && (
                    <Icon.FontAwesome
                      name={'check'}
                      size={onTablet ? 25 : 20}
                      color={'white'}
                    />
                  )}
                  {this.state.notifications_summary_frequency_minutes !== 0 &&
                    this.state.notifications_summary_frequency_minutes !==
                      null && (
                      <Icon.Entypo
                        name={'cross'}
                        size={onTablet ? 35 : 25}
                        color={'white'}
                      />
                    )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
          <NavigationBar currentPage={'PROFILE'} pad={true} />
        </SafeAreaView>
        <SafeAreaView
          forceInset={'never'}
          style={[{ backgroundColor: colors.mainBackground }]}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.userState.user
});

export default connect(mapStateToProps, null)(NotificationSettings);

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 20,
    height: 200,
    width: '80%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#081826',
    padding: isTablet ? 22.5 : 15
  },
  title: {
    textAlign: 'center',
    color: '#445f73'
  },
  noteTypeContainer: {
    paddingLeft: 10,
    width: '100%',
    justifyContent: 'center',
    fontSize: isTablet ? 18 : 14
  },
  noteTypeText: {
    marginTop: 10,
    marginLeft: 10,
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 22 : 16,
    color: '#445f73',
    paddingVertical: 5
  },
  textContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 18 : 14,
    color: '#445f73'
  },
  emailNotificationFrequency: {
    paddingLeft: 10,
    paddingTop: 10,
    width: '100%',
    justifyContent: 'center'
  },
  border: {
    height: 20,
    borderBottomColor: '#445f73',
    borderBottomWidth: 1
  }
});
