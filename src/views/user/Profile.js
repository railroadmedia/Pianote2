/**
 * Profile
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Linking,
  StatusBar,
  StyleSheet
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import Chat from 'Pianote2/src/assets/img/svgs/chat.svg';
import Settings from 'Pianote2/src/assets/img/svgs/settings.svg';

import XpRank from '../../modals/XpRank.js';
import { getUserData } from '../../services/UserDataAuth.js';
import NavigationBar from '../../components/NavigationBar.js';
import ReplyNotification from '../../modals/ReplyNotification.js';
import commonService from '../../services/common.service';
import { NetworkContext } from '../../context/NetworkProvider';
import {
  getnotifications,
  removeNotification
} from '../../services/notification.service';
import { SafeAreaView } from 'react-navigation';

const messageDict = {
  'lesson comment reply': [
    'replied to your comment.',
    true,
    'orange',
    'comment reply notifications'
  ], // notify_on_lesson_comment_reply: this.state.notify_on_lesson_comment_reply,
  'lesson comment liked': [
    'liked your comment.',
    true,
    'blue',
    'comment like notifications'
  ], // notify_on_forum_post_like: this.state.notify_on_forum_post_like,
  'forum post reply': [
    'replied to your forum post.',
    true,
    'orange',
    'forum post reply notifications'
  ], // notify_on_forum_post_reply: this.state.notify_on_forum_post_reply,
  'forum post liked': [
    'liked your forum post.',
    true,
    'blue',
    'forum post like notifications'
  ], // notify_on_lesson_comment_like: this.state.notify_on_lesson_comment_like,
  'forum post in followed thread': [
    'post in followed thread.',
    false,
    'orange',
    'forum post reply notifications'
  ],
  'new content releases': [
    '',
    false,
    'red',
    'new content release notifications'
  ] // notify_weekly_update: this.state.notify_weekly_update,
};

export default class Profile extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  page = 1;
  constructor(props) {
    super(props);
    this.state = {
      profileImage: '',
      xp: '',
      notifications: [],
      showXpRank: false,
      showReplyNotification: false,
      memberSince: '',
      isLoading: true,
      animateLoadMore: false,
      clickedNotificationStatus: false,
      notify_on_forum_followed_thread_reply: false,
      notify_on_forum_post_like: false,
      notify_on_forum_post_reply: false,
      notify_on_lesson_comment_like: false,
      notify_on_lesson_comment_reply: false,
      notify_weekly_update: false
    };
  }

  componentDidMount() {
    AsyncStorage.multiGet([
      'totalXP',
      'rank',
      'profileURI',
      'displayName',
      'joined'
    ]).then(data =>
      this.setState({
        xp: this.changeXP(data[0][1]),
        rank: data[1][1],
        profileImage: data[2][1],
        username: data[3][1],
        memberSince: data[4][1]
      })
    );

    getUserData().then(userData => {
      this.setState({
        notifications_summary_frequency_minutes:
          userData.notifications_summary_frequency_minutes,
        notify_on_forum_followed_thread_reply:
          userData.notify_on_forum_followed_thread_reply,
        notify_on_forum_post_like: userData.notify_on_forum_post_like,
        notify_on_forum_post_reply: userData.notify_on_forum_post_reply,
        notify_on_lesson_comment_like: userData.notify_on_lesson_comment_like,
        notify_on_lesson_comment_reply: userData.notify_on_lesson_comment_reply,
        notify_weekly_update: userData.notify_weekly_update
      });
      this.getNotifications(false);
    });
  }

  async getNotifications(loadMore) {
    console.log('Load more: ', loadMore);

    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    if (loadMore) this.page++;
    else this.page = 1;
    let notifications = await getnotifications(this.page);
    console.log('Notes: ', notifications);

    for (i in notifications.data) {
      let timeCreated =
        notifications.data[i].created_at?.slice(0, 10) +
        'T' +
        notifications.data[i].created_at?.slice(11) +
        '.000Z';
      let dateNote = new Date(timeCreated).getTime() / 1000;
      let dateNow = new Date().getTime() / 1000;
      let timeDelta = dateNow - dateNote; // in seconds

      if (timeDelta < 3600) {
        notifications.data[i].created_at = `${(timeDelta / 60).toFixed(
          0
        )} minute${timeDelta < 60 * 2 && timeDelta >= 60 ? '' : 's'} ago`;
      } else if (timeDelta < 86400) {
        notifications.data[i].created_at = `${(timeDelta / 3600).toFixed(
          0
        )} hour${timeDelta < 3600 * 2 ? '' : 's'} ago`;
      } else if (timeDelta < 604800) {
        notifications.data[i].created_at = `${(timeDelta / 86400).toFixed(
          0
        )} day${timeDelta < 86400 * 2 ? '' : 's'} ago`;
      } else {
        notifications.data[i].created_at = `${(timeDelta / 604800).toFixed(
          0
        )} week${timeDelta < 604800 * 2 ? '' : 's'} ago`;
      }
    }

    this.setState(state => ({
      notifications: loadMore
        ? state.notifications.concat(notifications.data)
        : notifications.data,
      isLoading: false,
      animateLoadMore: notifications.data?.length == 0 ? false : true
    }));
  }

  changeXP = num => {
    if (num !== '') {
      num = Number(num);
      if (num < 10000) {
        num = num.toString();
        return num;
      } else {
        num = (num / 1000).toFixed(1).toString();
        num = num + 'k';
        return num;
      }
    }
  };

  removeNotification = async notificationId => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    this.setState(state => ({
      notifications: state.notifications.filter(c => c.id !== notificationId)
    }));
    removeNotification(notificationId);
  };

  checkNotificationTypeStatus = async item => {
    let type = messageDict[item.type][0];
    if (type == 'replied to your comment.') {
      this.setState({
        clickedNotificationStatus: this.state.notify_on_lesson_comment_reply
      });
    } else if (type == 'liked your comment.') {
      this.setState({
        clickedNotificationStatus: this.state.notify_on_lesson_comment_like
      });
    } else if (type == 'replied to your forum post.') {
      this.setState({
        clickedNotificationStatus: this.state.notify_on_forum_post_reply
      });
    } else if (type == 'liked your forum post.') {
      this.setState({
        clickedNotificationStatus: this.state.notify_on_forum_post_like
      });
    } else if (type == 'post in followed thread.') {
      this.setState({
        clickedNotificationStatus: this.state
          .notify_on_forum_followed_thread_reply
      });
    } else if (type == '') {
      this.setState({
        clickedNotificationStatus: this.state.notify_weekly_update
      });
    }
  };

  turnOfffNotifications = async data => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    this.setState(data);
    try {
      let response = await commonService.tryCall(
        `${commonService.rootUrl}/usora/api/profile/update`,
        'PATCH',
        {
          data: {
            type: 'user',
            attributes: data
          }
        }
      );
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  openNotification = notification => {
    if (notification.type === 'new content releases') {
      this.props.navigation.navigate('VIDEOPLAYER', {
        url: notification.content.mobile_app_url
      });
    } else if (
      notification.type === 'lesson comment reply' ||
      notification.type === 'lesson comment liked'
    ) {
      this.props.navigation.navigate('VIDEOPLAYER', {
        comment: notification.comment,
        url: notification.content.mobile_app_url
      });
    } else {
      console.log('LINKING URL: ', notification.url);
      Linking.openURL(notification.url);
    }
  };

  loadMoreNotifications = () => {
    this.setState({ animateLoadMore: true }, () => {
      this.getNotifications(true);
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar
          backgroundColor={colors.mainBackground}
          barStyle={'light-content'}
        />
        <View style={styles.mainContainer}>
          <View style={localStyles.headerContainer}>
            <View style={{ flex: 1 }} />
            <Text style={styles.childHeaderText}>My Profile</Text>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.props.navigation.navigate('SETTINGS')}
            >
              <Settings
                height={onTablet ? 25 : 17.5}
                width={onTablet ? 25 : 17.5}
                fill={colors.pianoteRed}
                style={{ alignSelf: 'flex-end' }}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            style={styles.mainContainer}
            data={this.state.notifications}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={this.loadMoreNotifications}
            onEndReachedThreshold={0.01}
            ListHeaderComponent={() => (
              <>
                <View
                  style={[
                    styles.centerContent,
                    { marginTop: onTablet ? 40 : 20 }
                  ]}
                >
                  <View style={localStyles.imageContainer}>
                    <View
                      style={[styles.centerContent, localStyles.profilePic]}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('PROFILESETTINGS', {
                            data: 'Profile Photo'
                          })
                        }
                        style={[styles.centerContent, styles.container]}
                      >
                        <IonIcon
                          size={onTablet ? 24 : 18}
                          name={'ios-camera'}
                          color={colors.pianoteRed}
                        />
                      </TouchableOpacity>
                    </View>
                    <FastImage
                      style={localStyles.profileImageBackground}
                      source={{
                        uri:
                          this.state.profileImage !== ''
                            ? this.state.profileImage
                            : 'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                  <View style={styles.centerContent}>
                    <Text
                      style={[localStyles.usernameText, styles.childHeaderText]}
                    >
                      {this.state.username}
                    </Text>
                    <Text style={localStyles.memberSinceText}>
                      MEMBER SINCE {this.state.memberSince?.slice(0, 4)}
                    </Text>
                  </View>
                </View>
                <View style={localStyles.rankText}>
                  <TouchableOpacity
                    onPress={() => this.setState({ showXpRank: true })}
                  >
                    <Text style={localStyles.redXpRank}>XP</Text>
                    <Text style={localStyles.whiteXpRank}>{this.state.xp}</Text>
                  </TouchableOpacity>
                  <View style={{ width: 60 }} />
                  <TouchableOpacity
                    onPress={() => this.setState({ showXpRank: true })}
                  >
                    <Text style={localStyles.redXpRank}>RANK</Text>
                    <Text style={localStyles.whiteXpRank}>
                      {this.state.rank}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={localStyles.notificationContainer}>
                  <Text
                    style={[
                      localStyles.notificationText,
                      {
                        fontSize: sizing.verticalListTitleSmall,
                        paddingVertical: 15,
                        paddingLeft: 10,
                        fontFamily: 'OpenSans-ExtraBold',
                        color: 'white'
                      }
                    ]}
                  >
                    NOTIFICATIONS
                  </Text>
                </View>
              </>
            )}
            ListEmptyComponent={() =>
              this.state.isLoading ? (
                <View
                  style={[styles.centerContent, localStyles.activityContainer]}
                >
                  <ActivityIndicator
                    size={onTablet ? 'large' : 'small'}
                    animating={true}
                    color={colors.secondBackground}
                  />
                </View>
              ) : (
                <Text style={localStyles.noNotificationText}>
                  No New Notifications...
                </Text>
              )
            }
            ListFooterComponent={() => (
              <ActivityIndicator
                style={{ marginVertical: 20 }}
                size='small'
                color={colors.secondBackground}
                animating={this.state.animateLoadMore}
                hidesWhenStopped={true}
              />
            )}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  localStyles.notification,
                  {
                    backgroundColor:
                      index % 2
                        ? colors.mainBackground
                        : colors.notificationColor
                  }
                ]}
                onPress={() => this.openNotification(item)}
              >
                <View style={localStyles.innerNotificationContainer}>
                  <View style={localStyles.messageContainer}>
                    {messageDict[item.type][2] == 'red' && (
                      <View
                        style={[
                          styles.centerContent,
                          localStyles.iconContainer,
                          { backgroundColor: 'red' }
                        ]}
                      >
                        <FontAwesome
                          size={sizing.infoButtonSize}
                          color={'white'}
                          name={'video-camera'}
                        />
                      </View>
                    )}
                    {messageDict[item.type][2] == 'orange' && (
                      <View
                        style={[
                          styles.centerContent,
                          localStyles.iconContainer,
                          { backgroundColor: 'orange' }
                        ]}
                      >
                        <Chat
                          height={sizing.infoButtonSize}
                          width={sizing.infoButtonSize}
                          fill={'white'}
                        />
                      </View>
                    )}
                    {messageDict[item.type][2] == 'blue' && (
                      <View
                        style={[
                          styles.centerContent,
                          localStyles.iconContainer,
                          { backgroundColor: 'blue' }
                        ]}
                      >
                        <AntIcon
                          size={sizing.infoButtonSize}
                          color={'white'}
                          name={'like1'}
                        />
                      </View>
                    )}
                    <FastImage
                      style={{
                        height: onTablet ? 60 : 40,
                        width: onTablet ? 60 : 40,
                        paddingVertical: 10,
                        borderRadius: 100,
                        marginRight: 10
                      }}
                      source={{
                        uri:
                          item.type == 'new content releases'
                            ? item.content.thumbnail_url
                            : item.sender
                            ? item.sender.profile_image_url
                            : 'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                      }}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                  </View>
                </View>
                <View style={{ flex: 0.975, paddingLeft: 20 }}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text
                      style={{
                        fontFamily: 'OpenSans-ExtraBold',
                        color: 'white'
                      }}
                    >
                      <Text style={localStyles.boldNotificationText}>
                        {messageDict[item.type][1] ? '' : 'NEW - '}
                      </Text>
                      {item.type == 'new content releases'
                        ? item.content.display_name
                        : item.sender?.display_name}
                      <Text style={localStyles.messageTypeText}>
                        {' '}
                        {messageDict[item.type][0]}
                      </Text>
                    </Text>
                    <Text style={localStyles.createdAtText}>
                      {item.created_at}
                    </Text>
                  </View>
                </View>
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={localStyles.threeDotsContainer}
                      onPress={() => {
                        this.checkNotificationTypeStatus(item);
                        this.setState({
                          showReplyNotification: true,
                          clickedNotification: item
                        });
                      }}
                    >
                      <EntypoIcon
                        size={sizing.infoButtonSize}
                        name={'dots-three-horizontal'}
                        color={colors.secondBackground}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <Modal
          isVisible={this.state.showXpRank}
          style={styles.modalContainer}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
        >
          <XpRank
            hideXpRank={() => this.setState({ showXpRank: false })}
            xp={this.state.xp}
            rank={this.state.rank}
          />
        </Modal>
        <Modal
          isVisible={this.state.showReplyNotification}
          style={styles.modalContainer}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
        >
          <ReplyNotification
            removeNotification={data => {
              this.setState({ showReplyNotification: false }),
                this.removeNotification(data.id);
            }}
            turnOfffNotifications={data => {
              this.setState({ showReplyNotification: false }),
                this.turnOfffNotifications(data);
            }}
            hideReplyNotification={() => {
              this.setState({ showReplyNotification: false });
            }}
            data={this.state.clickedNotification}
            notificationStatus={this.state.clickedNotificationStatus}
          />
        </Modal>
        <NavigationBar currentPage={'PROFILE'} pad={true} />
      </SafeAreaView>
    );
  }
}

const localStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 20,
    height: 200,
    width: '80%'
  },
  imageContainer: {
    borderRadius: 250,
    borderWidth: 2,
    borderColor: '#fb1b2f',
    height: DeviceInfo.isTablet() ? 200 : 150,
    width: DeviceInfo.isTablet() ? 200 : 150,
    aspectRatio: 1,
    marginBottom: 20,
    marginTop: 10
  },
  profilePic: {
    position: 'absolute',
    zIndex: 10,
    elevation: 10,
    top: DeviceInfo.isTablet() ? -20 : -15,
    right: DeviceInfo.isTablet() ? -20 : -15,
    height: DeviceInfo.isTablet() ? 40 : 30,
    width: DeviceInfo.isTablet() ? 40 : 30,
    borderRadius: 100,
    borderColor: '#fb1b2f',
    borderWidth: 1
  },
  profileImageBackground: {
    height: '100%',
    width: '100%',
    borderRadius: 250,
    backgroundColor: '#445f73'
  },
  usernameText: {
    fontFamily: 'OpenSans-ExtraBold',
    textAlign: 'center',
    color: 'white',
    paddingBottom: 5
  },
  memberSinceText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: DeviceInfo.isTablet() ? 16 : 12,
    textAlign: 'center',
    color: '#445f73'
  },
  rankText: {
    marginTop: 20,
    borderTopColor: '#445f73',
    borderTopWidth: 0.5,
    borderBottomColor: '#445f73',
    borderBottomWidth: 0.5,
    paddingVertical: 20,
    backgroundColor: '#00101d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  redXpRank: {
    color: '#fb1b2f',
    fontSize: DeviceInfo.isTablet() ? 16 : 12,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center'
  },
  whiteXpRank: {
    color: 'white',
    fontSize: DeviceInfo.isTablet() ? 26 : 20,
    fontFamily: 'OpenSans-ExtraBold',
    textAlign: 'center'
  },
  notificationContainer: {
    elevation: 1
  },
  activityContainer: {
    flex: 1,
    marginTop: 20
  },
  noNotificationText: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: DeviceInfo.isTablet() ? 16 : 12,
    textAlign: 'left',
    paddingLeft: 10,
    color: 'white'
  },
  notification: {
    flexDirection: 'row',
    paddingVertical: 20
  },
  innerNotificationContainer: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: DeviceInfo.isTablet() ? 35 : 25,
    width: DeviceInfo.isTablet() ? 35 : 25,
    borderRadius: 100,
    zIndex: 5
  },
  boldNotificationText: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: DeviceInfo.isTablet() ? 16 : 14,
    color: 'white'
  },
  messageTypeText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: DeviceInfo.isTablet() ? 16 : 12,
    color: 'white'
  },
  createdAtText: {
    marginTop: 1,
    fontFamily: 'OpenSans-Regular',
    fontSize: DeviceInfo.isTablet() ? 16 : 12,
    color: '#445f73'
  },
  threeDotsContainer: {
    justifyContent: 'center'
  }
});
