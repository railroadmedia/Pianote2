import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Linking,
  StatusBar,
  StyleSheet,
  RefreshControl
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import Icon from '../../assets/icons.js';
import Chat from '../../assets/img/svgs/chat.svg';
import Settings from '../../assets/img/svgs/settings.svg';
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
import { navigate } from '../../../AppNavigator.js';
import { setLoggedInUser } from '../../redux/UserActions.js';
import { connect } from 'react-redux';

const isTablet = DeviceInfo.isTablet();
const messageDict = {
  'lesson comment reply': {
    message: 'replied to your comment.',
    new: true,
    color: 'orange',
    type: 'comment reply notifications'
  },
  'lesson comment liked': {
    message: 'liked your comment.',
    new: true,
    color: 'blue',
    type: 'comment like notifications'
  },
  'forum post liked': {
    message: 'liked your forum post.',
    new: true,
    color: 'blue',
    type: 'forum post like notifications'
  },
  'forum post in followed thread': {
    message: 'post in followed thread.',
    new: false,
    color: 'orange',
    type: 'forum post reply notifications'
  },
  'new content releases': {
    message: '',
    new: false,
    color: 'red',
    type: 'new content release notifications'
  }
};

class Profile extends React.Component {
  static contextType = NetworkContext;
  page = 1;
  constructor(props) {
    super(props);
    this.state = {
      profileImage: '',
      xp: null,
      notifications: [],
      showXpRank: false,
      showReplyNotification: false,
      memberSince: '',
      isLoading: true,
      animateLoadMore: false,
      clickedNotificationStatus: false,
      notify_on_post_in_followed_forum_thread,
      notify_on_forum_followed_thread_reply, //
      notify_on_lesson_comment_like, //
      notify_on_lesson_comment_reply, //
      notify_on_forum_post_like, //
      refreshing: false
    };
  }

  componentDidMount() {
    const {
      display_name,
      created_at,
      profile_picture_url,
      totalXp,
      xpRank
    } = this.props.user;
    this.setState({
      memberSince: created_at,
      username: display_name,
      profileImage: profile_picture_url,
      xp: totalXp,
      rank: xpRank
    });
    this.getNotifications(false);
  }

  async getUserDetails() {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let userDetails = await getUserData();
    this.props.setLoggedInUser(userDetails);
    this.setState({ refreshing: false });
  }

  refresh = () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    this.setState({ refreshing: true });
    this.getUserDetails();
  };

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
      notify_on_forum_post_like,
      isLoading: false
    });
  }

  async getNotifications(loadMore) {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
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

  removeNotification = notificationId => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState(state => ({
      notifications: state.notifications.filter(c => c.id !== notificationId)
    }));
    removeNotification(notificationId);
  };

  checkNotificationTypeStatus = item => {
    let type = messageDict[item.type].message;
    if (type == 'replied to your comment.') {
      this.setState({
        clickedNotificationStatus: this.state.notify_on_lesson_comment_reply
      });
    } else if (type == 'liked your comment.') {
      this.setState({
        clickedNotificationStatus: this.state.notify_on_lesson_comment_like
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
    }
  };

  turnOfffNotifications = data => {
    console.log(data);
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState(data);
    commonService.tryCall(
      `${commonService.rootUrl}/usora/api/profile/update`,
      'PATCH',
      {
        data: {
          type: 'user',
          attributes: data
        }
      }
    );
  };

  openNotification = notification => {
    if (notification.type === 'new content releases') {
      navigate('VIEWLESSON', {
        url: notification.content.mobile_app_url
      });
    } else if (
      notification.type === 'lesson comment reply' ||
      notification.type === 'lesson comment liked'
    ) {
      navigate('VIEWLESSON', {
        comment: notification.comment,
        url: notification.content.mobile_app_url
      });
    } else {
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
              onPress={() => navigate('SETTINGS')}
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
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.refresh()}
                colors={[colors.pianoteRed]}
                tintColor={colors.pianoteRed}
              />
            }
            ListHeaderComponent={() => (
              <>
                <View
                  style={[
                    styles.centerContent,
                    { marginTop: onTablet ? 40 : 20 }
                  ]}
                >
                  <View style={localStyles.imageContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        navigate('PROFILESETTINGS', {
                          data: 'Profile Photo'
                        })
                      }
                      style={[styles.centerContent, styles.container]}
                    >
                      <Icon.Ionicons
                        size={onTablet ? 24 : 18}
                        name={'ios-camera'}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>
                    <FastImage
                      style={localStyles.profileImageBackground}
                      source={{
                        uri: this.state.profileImage
                          ? this.state.profileImage
                          : 'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                  <Text
                    style={[localStyles.usernameText, styles.childHeaderText]}
                  >
                    {this.state.username}
                  </Text>
                  <Text style={localStyles.memberSinceText}>
                    MEMBER SINCE {this.state.memberSince?.slice(0, 4)}
                  </Text>
                </View>
                <View style={localStyles.rankText}>
                  <TouchableOpacity
                    onPress={() => this.setState({ showXpRank: true })}
                  >
                    <Text style={localStyles.redXpRank}>XP</Text>
                    <Text style={localStyles.whiteXpRank}>{this.state.xp}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({ showXpRank: true })}
                    style={{ marginLeft: 60 }}
                  >
                    <Text style={localStyles.redXpRank}>RANK</Text>
                    <Text style={localStyles.whiteXpRank}>
                      {this.state.rank}
                    </Text>
                  </TouchableOpacity>
                </View>
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
              </>
            )}
            ListEmptyComponent={() =>
              this.state.isLoading ? (
                <ActivityIndicator
                  size={onTablet ? 'large' : 'small'}
                  animating={true}
                  color={colors.secondBackground}
                  style={{ margin: 20 }}
                />
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
                    paddingLeft: 10,
                    backgroundColor:
                      index % 2
                        ? colors.mainBackground
                        : colors.notificationColor
                  }
                ]}
                onPress={() => this.openNotification(item)}
              >
                <View style={localStyles.messageContainer}>
                  {messageDict[item.type].color == 'red' && (
                    <View
                      style={[
                        styles.centerContent,
                        localStyles.iconContainer,
                        { backgroundColor: 'red' }
                      ]}
                    >
                      <Icon.FontAwesome
                        size={sizing.infoButtonSize}
                        color={'white'}
                        name={'video-camera'}
                      />
                    </View>
                  )}
                  {messageDict[item.type].color == 'orange' && (
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
                  {messageDict[item.type].color == 'blue' && (
                    <View
                      style={[
                        styles.centerContent,
                        localStyles.iconContainer,
                        { backgroundColor: 'blue' }
                      ]}
                    >
                      <Icon.AntDesign
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
                <View style={{ flex: 0.975, paddingLeft: 20 }}>
                  <Text
                    style={{
                      fontFamily: 'OpenSans-ExtraBold',
                      color: 'white'
                    }}
                  >
                    <Text style={localStyles.boldNotificationText}>
                      {messageDict[item.type].new ? '' : 'NEW - '}
                    </Text>
                    {item.type == 'new content releases'
                      ? item.content.display_name
                      : item.sender?.display_name}
                    <Text style={localStyles.messageTypeText}>
                      {' '}
                      {messageDict[item.type].message}
                    </Text>
                  </Text>
                  <Text style={localStyles.createdAtText}>
                    {item.created_at}
                  </Text>
                </View>
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
                    <Icon.Entypo
                      size={sizing.infoButtonSize}
                      name={'dots-three-horizontal'}
                      color={colors.secondBackground}
                    />
                  </TouchableOpacity>
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
          onBackButtonPress={() => this.setState({ showXpRank: false })}
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
          onBackButtonPress={() =>
            this.setState({ showReplyNotification: false })
          }
        >
          <ReplyNotification
            removeNotification={data => {
              this.setState({ showReplyNotification: false });
              this.removeNotification(data.id);
            }}
            turnOfffNotifications={data => {
              this.setState({ showReplyNotification: false });
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

const mapStateToProps = state => ({
  user: state.userState.user
});

const mapDispatchToProps = dispatch => ({
  setLoggedInUser: user => dispatch(setLoggedInUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

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
    height: isTablet ? 200 : 150,
    width: isTablet ? 200 : 150,
    aspectRatio: 1,
    marginBottom: 20,
    marginTop: 10
  },
  profilePic: {
    position: 'absolute',
    zIndex: 10,
    elevation: 10,
    top: isTablet ? -20 : -15,
    right: isTablet ? -20 : -15,
    height: isTablet ? 40 : 30,
    width: isTablet ? 40 : 30,
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
    fontSize: isTablet ? 16 : 12,
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
    fontSize: isTablet ? 16 : 12,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center'
  },
  whiteXpRank: {
    color: 'white',
    fontSize: isTablet ? 26 : 20,
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
    fontSize: isTablet ? 16 : 12,
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
    height: isTablet ? 35 : 25,
    width: isTablet ? 35 : 25,
    borderRadius: 100,
    zIndex: 5
  },
  boldNotificationText: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: isTablet ? 16 : 14,
    color: 'white'
  },
  messageTypeText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 16 : 12,
    color: 'white'
  },
  createdAtText: {
    marginTop: 1,
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 16 : 12,
    color: '#445f73'
  },
  threeDotsContainer: {
    justifyContent: 'center'
  }
});
