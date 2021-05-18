import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet
} from 'react-native';
import Back from '../../assets/img/svgs/back.svg';
import Icon from '../../assets/icons.js';
import CustomSwitch from '../../components/CustomSwitch.js';
import NavigationBar from '../../components/NavigationBar.js';
import { changeNotificationSettings } from '../../services/notification.service';
import { NetworkContext } from '../../context/NetworkProvider';
import { SafeAreaView } from 'react-navigation';
import { goBack } from '../../../AppNavigator';
import { connect } from 'react-redux';
import { setLoggedInUser } from '../../redux/UserActions';

const isTablet = global.onTablet;

class NotificationSettings extends React.Component {
  static contextType = NetworkContext;

  changeNotificationStatus = datum => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    const {
      notify_weekly_update,
      notify_on_lesson_comment_reply,
      notify_on_lesson_comment_like,
      notify_on_forum_followed_thread_reply,
      notify_on_forum_post_like,
      notifications_summary_frequency_minutes
    } = datum;

    this.props.setLoggedInUser({
      ...this.props.user,
      notify_weekly_update,
      notify_on_lesson_comment_reply,
      notify_on_lesson_comment_like,
      notify_on_forum_followed_thread_reply,
      notify_on_forum_post_like,
      notifications_summary_frequency_minutes
    });
    const body = {
      data: {
        type: 'user',
        attributes: datum
      }
    };
    changeNotificationSettings(body);
  };

  render() {
    const {
      notify_weekly_update,
      notify_on_lesson_comment_reply,
      notify_on_lesson_comment_like,
      notify_on_forum_followed_thread_reply,
      notify_on_forum_post_like,
      notifications_summary_frequency_minutes
    } = this.props.user;
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
            <TouchableOpacity style={{ flex: 1 }} onPress={() => goBack()}>
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

          <ScrollView style={styles.mainContainer}>
            <Text style={localStyles.noteTypeText}>Notification Types</Text>
            <View style={localStyles.textContainer}>
              <Text style={localStyles.text}>Weekly community updates</Text>
              <CustomSwitch
                isClicked={notify_weekly_update}
                onClick={bool =>
                  this.changeNotificationStatus({
                    notify_weekly_update: bool,
                    notify_on_lesson_comment_reply,
                    notify_on_lesson_comment_like,
                    notify_on_forum_followed_thread_reply,
                    notify_on_forum_post_like,
                    notifications_summary_frequency_minutes
                  })
                }
              />
            </View>
            <View style={localStyles.textContainer}>
              <Text style={localStyles.text}>Comment replies</Text>
              <CustomSwitch
                isClicked={notify_on_lesson_comment_reply}
                onClick={bool =>
                  this.changeNotificationStatus({
                    notify_on_lesson_comment_reply: bool,
                    notify_weekly_update,
                    notify_on_lesson_comment_like,
                    notify_on_forum_followed_thread_reply,
                    notify_on_forum_post_like,
                    notifications_summary_frequency_minutes
                  })
                }
              />
            </View>
            <View style={localStyles.textContainer}>
              <Text style={localStyles.text}>Comment likes</Text>
              <CustomSwitch
                isClicked={notify_on_lesson_comment_like}
                onClick={bool =>
                  this.changeNotificationStatus({
                    notify_on_lesson_comment_like: bool,
                    notify_on_lesson_comment_reply,
                    notify_weekly_update,
                    notify_on_forum_followed_thread_reply,
                    notify_on_forum_post_like,
                    notifications_summary_frequency_minutes
                  })
                }
              />
            </View>
            <View style={localStyles.textContainer}>
              <Text style={localStyles.text}>Forum post replies</Text>
              <CustomSwitch
                isClicked={notify_on_forum_followed_thread_reply}
                onClick={bool =>
                  this.changeNotificationStatus({
                    notify_on_forum_followed_thread_reply: bool,
                    notify_on_lesson_comment_like,
                    notify_on_lesson_comment_reply,
                    notify_weekly_update,
                    notify_on_forum_post_like,
                    notifications_summary_frequency_minutes
                  })
                }
              />
            </View>
            <View style={localStyles.textContainer}>
              <Text style={localStyles.text}>Forum post likes</Text>
              <CustomSwitch
                isClicked={notify_on_forum_post_like}
                onClick={bool =>
                  this.changeNotificationStatus({
                    notify_on_forum_post_like: bool,
                    notify_on_forum_followed_thread_reply,
                    notify_on_lesson_comment_like,
                    notify_on_lesson_comment_reply,
                    notify_weekly_update,
                    notifications_summary_frequency_minutes
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
                      notifications_summary_frequency_minutes == 1
                        ? colors.pianoteRed
                        : colors.secondBackground,
                    borderRadius: 100,
                    width: onTablet ? 35 : 27.5,
                    height: onTablet ? 35 : 27.5
                  }
                ]}
              >
                {notifications_summary_frequency_minutes == 1 && (
                  <Icon.FontAwesome
                    name={'check'}
                    size={onTablet ? 25 : 20}
                    color={'white'}
                  />
                )}
                {notifications_summary_frequency_minutes !== 1 && (
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
                      notifications_summary_frequency_minutes == 1440
                        ? colors.pianoteRed
                        : colors.secondBackground,
                    borderRadius: 100,
                    width: onTablet ? 35 : 27.5,
                    height: onTablet ? 35 : 27.5
                  }
                ]}
              >
                {notifications_summary_frequency_minutes == 1440 && (
                  <Icon.FontAwesome
                    name={'check'}
                    size={onTablet ? 25 : 20}
                    color={'white'}
                  />
                )}
                {notifications_summary_frequency_minutes !== 1440 && (
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
                      notifications_summary_frequency_minutes == 0 ||
                      notifications_summary_frequency_minutes == null
                        ? colors.pianoteRed
                        : colors.secondBackground,
                    borderRadius: 100,
                    width: onTablet ? 35 : 27.5,
                    height: onTablet ? 35 : 27.5
                  }
                ]}
              >
                {(notifications_summary_frequency_minutes == 0 ||
                  notifications_summary_frequency_minutes == null) && (
                  <Icon.FontAwesome
                    name={'check'}
                    size={onTablet ? 25 : 20}
                    color={'white'}
                  />
                )}
                {notifications_summary_frequency_minutes !== 0 &&
                  notifications_summary_frequency_minutes !== null && (
                    <Icon.Entypo
                      name={'cross'}
                      size={onTablet ? 35 : 25}
                      color={'white'}
                    />
                  )}
              </TouchableOpacity>
            </View>
          </ScrollView>

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

const mapDispatchToProps = dispatch => ({
  setLoggedInUser: user => dispatch(setLoggedInUser(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationSettings);

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
