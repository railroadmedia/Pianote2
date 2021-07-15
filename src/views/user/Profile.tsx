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
import FastImage from 'react-native-fast-image';
import Icon from '../../assets/icons';
import XpRank from '../../modals/XpRank';
import { getUserData } from '../../services/UserDataAuth';
// import NavigationBar from '../../components/NavigationBar';
import ReplyNotification from '../../modals/ReplyNotification';
import { NetworkContext } from '../../context/NetworkProvider';
import {
  getnotifications,
  removeNotification,
  changeNotificationSettings
} from '../../services/notification.service';
import { SafeAreaView } from 'react-navigation';
// import { navigate, reset } from '../../../AppNavigator';
import { connect } from 'react-redux';
import IUser from '../../model/IUser';
import { AppDispatch, IAppState } from '../../redux/Store';
import { setLoggedInUser } from '../../redux/UserActions';
import {
  infoButtonSize,
  mainBackground,
  notificationColor,
  secondBackground,
  pianoteRed,
  onTablet,
  verticalListTitleSmall
} from '../../../AppStyle';
import INotification, {
  INotificationDisplayData,
  NotificationTypes
} from '../../model/INotifications';
import commonService from '../../services/common.service';

interface IUserStateProps {
  user: IUser;
}

interface IUserDispatchProps {
  setLoggedInUser: (user: IUser) => void;
}

interface IProfileProps extends IUserStateProps, IUserDispatchProps {}

interface IProfileState {
  notifications: INotification[];
  showXpRank: boolean;
  showReplyNotification: boolean;
  isLoading: boolean;
  refreshing: boolean;
  animateLoadMore: boolean;
  clickedNotification: INotification;
}

let localStyles: any;
let messageDict: Record<NotificationTypes, INotificationDisplayData> = {
  'lesson comment reply': {
    message: 'replied to your comment.',
    new: true,
    color: 'orange',
    type: 'comment reply notifications',
    field: 'notify_on_lesson_comment_reply'
  },
  'lesson comment liked': {
    message: 'liked your comment.',
    new: true,
    color: 'blue',
    type: 'comment like notifications',
    field: 'notify_on_lesson_comment_like'
  },
  'forum post liked': {
    message: 'liked your forum post.',
    new: true,
    color: 'blue',
    type: 'forum post like notifications',
    field: 'notify_on_forum_post_like'
  },
  'forum post reply': {
    message: 'replied to your forum post.',
    new: true,
    color: 'orange',
    type: 'forum post like notifications',
    field: 'notify_on_forum_post_reply'
  },
  'forum post in followed thread': {
    message: 'post in followed thread.',
    new: false,
    color: 'orange',
    type: 'forum post reply notifications',
    field: 'notify_on_forum_followed_thread_reply'
  }
};

class Profile extends React.Component<IProfileProps, IProfileState> {
  static contextType = NetworkContext;
  page: number = 1;
  constructor(props: IProfileProps) {
    super(props);
    localStyles = setStyles(false, pianoteRed);
    this.state = {
      notifications: [],
      showXpRank: false,
      showReplyNotification: false,
      isLoading: true,
      refreshing: false,
      animateLoadMore: false,
      clickedNotification: {} as INotification
    };
  }

  componentDidMount = () => this.getNotifications(false);

  async getUserDetails() {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let userDetails = await getUserData();
    this.props.setLoggedInUser(userDetails);
    this.setState({ refreshing: false });
  }

  async getNotifications(loadMore: boolean) {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    if (loadMore) this.page++;
    else this.page = 1;
    let notifications = await getnotifications(this.page);
    for (let i in notifications.data) {
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
      refreshing: false,
      animateLoadMore: notifications.data?.length === 0 ? false : true
    }));
  }

  changeXP = (num: number | string) => {
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

  removeNotification = (notificationId: number) => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState(state => ({
      notifications: state.notifications.filter(c => c.id !== notificationId),
      clickedNotification: {} as INotification,
      showReplyNotification: false
    }));
    removeNotification(notificationId);
  };

  turnOfffNotifications = async (type: NotificationTypes) => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState({
      showReplyNotification: false,
      clickedNotification: {} as INotification
    });
    const {
      notify_on_lesson_comment_reply,
      notify_on_lesson_comment_like,
      notify_on_forum_followed_thread_reply,
      notify_on_forum_post_like,
      notify_on_forum_post_reply
    } = this.props.user;
    let attributes;

    if (type === 'lesson comment reply') {
      this.props.setLoggedInUser({
        ...this.props.user,
        notify_on_lesson_comment_reply: !notify_on_lesson_comment_reply
      });
      attributes = {
        notify_on_lesson_comment_reply: !notify_on_lesson_comment_reply
      };
    } else if (type === 'lesson comment liked') {
      this.props.setLoggedInUser({
        ...this.props.user,
        notify_on_lesson_comment_like: !notify_on_lesson_comment_like
      });
      attributes = {
        notify_on_lesson_comment_like: !notify_on_lesson_comment_like
      };
    } else if (type === 'forum post liked') {
      this.props.setLoggedInUser({
        ...this.props.user,
        notify_on_forum_post_like: !notify_on_forum_post_like
      });
      attributes = {
        notify_on_forum_post_like: !notify_on_forum_post_like
      };
    } else if (type === 'forum post in followed thread') {
      this.props.setLoggedInUser({
        ...this.props.user,
        notify_on_forum_followed_thread_reply: !notify_on_forum_followed_thread_reply
      });
      attributes = {
        notify_on_forum_followed_thread_reply: !notify_on_forum_followed_thread_reply
      };
    } else if (type === 'forum post reply') {
      this.props.setLoggedInUser({
        ...this.props.user,
        notify_on_forum_post_reply: !notify_on_forum_post_reply
      });
      attributes = {
        notify_on_forum_post_reply: !notify_on_forum_post_reply
      };
    }

    const body = {
      data: {
        type: 'user',
        attributes
      }
    };
    changeNotificationSettings(body);
  };

  openNotification = (notification: INotification) => {
    if (
      notification.type === 'lesson comment reply' ||
      notification.type === 'lesson comment liked'
    ) {
      // navigate('VIEWLESSON', {
      //   comment: notification.comment,
      //   url: notification.content.musora_api_mobile_app_url
      // });
    } else {
      // navigate('FORUM', {
      //   NetworkContext,
      //   tryCall: commonService.tryCall.bind(commonService),
      //   rootUrl: commonService.rootUrl,
      //   isDark: true,
      //   appColor: pianoteRed,
      //   user: this.props.user,
      //   threadTitle: notification?.thread?.title,
      //   postId: notification.data.postId,
      //   threadId: notification.data.threadId
      // });
    }
  };

  loadMoreNotifications = () =>
    this.setState({ animateLoadMore: true }, () => this.getNotifications(true));

  render() {
    const {
      profile_picture_url,
      display_name,
      created_at,
      totalXp,
      xpRank
    } = this.props.user;
    console.log(this.props.user);
    return (
      <SafeAreaView style={localStyles.mainContainer}>
        <StatusBar
          backgroundColor={mainBackground}
          barStyle={'light-content'}
        />
        <View style={localStyles.mainContainer}>
          <View style={localStyles.headerContainer}>
            <View style={{ flex: 1 }} />
            <Text style={[localStyles.childHeaderText, { flex: 1 }]}>
              My Profile
            </Text>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'flex-end'
              }}
              onPress={() => {
                // navigate('SETTINGS');
              }}
            >
              <Icon.Ionicons
                name='ios-settings-sharp'
                size={onTablet ? 25 : 18}
                color={pianoteRed}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            style={localStyles.mainContainer}
            data={this.state.notifications}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={this.loadMoreNotifications}
            onEndReachedThreshold={0.01}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() =>
                  this.setState({ refreshing: true }, () => {
                    this.getUserDetails();
                    this.getNotifications(false);
                  })
                }
                colors={[pianoteRed]}
                tintColor={pianoteRed}
              />
            }
            ListHeaderComponent={() => (
              <>
                <View style={localStyles.centerContent}>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        // navigate('PROFILESETTINGS', {
                        //   data: 'Profile Photo'
                        // });
                      }}
                      style={localStyles.cameraBtn}
                    >
                      <Icon.Ionicons
                        name='md-camera'
                        size={onTablet ? 24 : 18}
                        color={pianoteRed}
                      />
                    </TouchableOpacity>
                    <FastImage
                      style={localStyles.profilePicture}
                      source={{
                        uri:
                          profile_picture_url ||
                          'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                  <Text
                    style={[
                      localStyles.usernameText,
                      localStyles.childHeaderText
                    ]}
                  >
                    {display_name}
                  </Text>
                  <Text style={localStyles.memberSinceText}>
                    MEMBER SINCE {created_at?.slice(0, 4)}
                  </Text>
                </View>

                <View style={localStyles.rankContainer}>
                  <TouchableOpacity
                    style={localStyles.center}
                    onPress={() => this.setState({ showXpRank: true })}
                  >
                    <Text style={localStyles.redXpRank}>XP</Text>
                    <Text style={localStyles.whiteXpRank}>{totalXp}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({ showXpRank: true })}
                    style={localStyles.center}
                  >
                    <Text style={localStyles.redXpRank}>RANK</Text>
                    <Text style={localStyles.whiteXpRank}>{xpRank}</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={[
                    localStyles.notificationText,
                    {
                      fontSize: verticalListTitleSmall,
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
                  color={secondBackground}
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
                color={secondBackground}
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
                      index % 2 ? mainBackground : notificationColor
                  }
                ]}
                onPress={() => this.openNotification(item)}
              >
                <View style={localStyles.messageContainer}>
                  {item.type === 'lesson comment reply' ||
                  item.type === 'forum post in followed thread' ? (
                    <View
                      style={[
                        localStyles.centerContent,
                        localStyles.iconContainer,
                        { backgroundColor: 'orange' }
                      ]}
                    >
                      <Icon.Ionicons
                        size={infoButtonSize}
                        color={'white'}
                        name={'ios-chatbubble-sharp'}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        localStyles.centerContent,
                        localStyles.iconContainer,
                        { backgroundColor: 'blue' }
                      ]}
                    >
                      <Icon.AntDesign
                        size={infoButtonSize}
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
                      uri: item.sender
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
                    {item.sender?.display_name}
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
                      this.setState({
                        showReplyNotification: true,
                        clickedNotification: item
                      });
                    }}
                  >
                    <Icon.Entypo
                      size={infoButtonSize}
                      name={'dots-three-horizontal'}
                      color={secondBackground}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        {this.state.showXpRank && (
          <XpRank
            hideXpRank={() => this.setState({ showXpRank: false })}
            xp={parseInt(totalXp)}
            rank={xpRank}
          />
        )}

        {this.state.showReplyNotification && (
          <ReplyNotification
            removeNotification={notificationId =>
              this.removeNotification(notificationId)
            }
            turnOfffNotifications={() =>
              this.turnOfffNotifications(this.state.clickedNotification?.type)
            }
            hideReplyNotification={() => {
              this.setState({ showReplyNotification: false });
            }}
            data={this.state.clickedNotification}
            notificationStatus={
              this.props.user[
                messageDict[this.state.clickedNotification?.type]?.field
              ]
            }
          />
        )}

        {/* <NavigationBar currentPage={'PROFILE'} pad={true} /> */}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: IAppState): IUserStateProps => ({
  user: state.userState.user
});

const mapDispatchToProps = (dispatch: AppDispatch): IUserDispatchProps => ({
  setLoggedInUser: (user: IUser) => dispatch(setLoggedInUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const setStyles = (isLight: boolean, appColor: string) =>
  StyleSheet.create({
    centerContent: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10
    },
    profilePicture: {
      height: 125,
      aspectRatio: 1,
      borderRadius: 65,
      marginTop: 30,
      marginBottom: 15
    },
    usernameText: {
      paddingBottom: 5
    },
    memberSinceText: {
      fontFamily: 'OpenSans-Regular',
      fontSize: onTablet ? 16 : 12,
      textAlign: 'center',
      color: isLight ? '#97AABE' : '#445f73'
    },
    rankContainer: {
      borderTopColor: isLight ? '#97AABE' : '#445f73',
      borderTopWidth: 1,
      borderBottomColor: isLight ? '#97AABE' : '#445f73',
      borderBottomWidth: 1,
      paddingVertical: 20,
      backgroundColor: isLight ? '#F7F9FC' : '#00101d',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginTop: 20
    },
    redXpRank: {
      color: appColor,
      fontSize: onTablet ? 16 : 12,
      fontFamily: 'OpenSans-Bold',
      textAlign: 'center'
    },
    whiteXpRank: {
      color: 'white',
      fontSize: onTablet ? 26 : 20,
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
      fontSize: onTablet ? 16 : 12,
      textAlign: 'left',
      paddingLeft: 10,
      color: isLight ? '#00101D' : '#EDEEEF'
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
      height: onTablet ? 35 : 25,
      width: onTablet ? 35 : 25,
      borderRadius: 100,
      zIndex: 5
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    boldNotificationText: {
      fontFamily: 'OpenSans-ExtraBold',
      fontSize: onTablet ? 16 : 14,
      color: isLight ? '#00101D' : '#EDEEEF'
    },
    messageTypeText: {
      fontFamily: 'OpenSans-Regular',
      fontSize: onTablet ? 16 : 12,
      color: isLight ? '#00101D' : '#EDEEEF'
    },
    createdAtText: {
      marginTop: 1,
      fontFamily: 'OpenSans-Regular',
      fontSize: onTablet ? 16 : 12,
      color: isLight ? '#97AABE' : '#445f73'
    },
    threeDotsContainer: {
      justifyContent: 'center'
    },
    cameraBtn: {
      flex: 0,
      backgroundColor: isLight ? '#F7F9FC' : '#00101d',
      borderColor: appColor,
      borderWidth: 1,
      height: 35,
      width: 35,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: 90,
      top: 30,
      zIndex: 2
    },
    mainContainer: { backgroundColor: '#00101d', flex: 1 },
    childHeaderText: {
      // used on search, see all, downloads,
      fontSize: onTablet ? 28 : 20,
      color: 'white',
      fontFamily: 'OpenSans-ExtraBold',
      alignSelf: 'center',
      textAlign: 'center'
    }
  });
