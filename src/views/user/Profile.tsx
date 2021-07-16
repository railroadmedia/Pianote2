import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
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
import { NetworkContext, NetworkState } from '../../context/NetworkProvider';
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
  INotificationUser,
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

const Profile: FunctionComponent<IProfileProps> = ({
  user,
  setLoggedInUser
}) => {
  localStyles = setStyles(false, pianoteRed);
  // let page: number = 1;
  const networkContext: NetworkState = useContext(NetworkContext);
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [showXpRank, setShowXpRank] = useState(false);
  const [showReplyNotification, setShowReplyNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setIsRefreshing] = useState(false);
  const [animateLoadMore, setAnimateLoadMore] = useState(false);
  const [clickedNotification, setClickedNotification] = useState(
    {} as INotification
  );

  const getNotifications = useCallback(
    async (loadMore: boolean) => {
      if (!networkContext.isConnected)
        return networkContext.showNoConnectionAlert();
      console.log('getNotifications', loadMore, page);
      if (loadMore) setPage(page + 1);
      else setPage(1);
      const notificationsArray = await getnotifications(page);

      setNotifications(
        loadMore
          ? notifications.concat(notificationsArray.data)
          : notificationsArray.data
      );
      setIsLoading(false);
      setIsRefreshing(false);
      setAnimateLoadMore(notificationsArray.data?.length === 0 ? false : true);
    },
    [notifications]
  );

  const lastPostTime = useCallback((date: string) => {
    const formatedDate = date?.replace(/-/g, '/');
    const dif: number = new Date().valueOf() - new Date(formatedDate).valueOf();
    if (dif < 120 * 1000) return `1 Minute Ago`;
    if (dif < 60 * 1000 * 60)
      return `${(dif / 1000 / 60).toFixed()} Minutes Ago`;
    if (dif < 60 * 1000 * 60 * 2) return `1 Hour Ago`;
    if (dif < 60 * 1000 * 60 * 24)
      return `${(dif / 1000 / 60 / 60).toFixed()} Hours Ago`;
    if (dif < 60 * 1000 * 60 * 48) return `1 Day Ago`;
    if (dif < 60 * 1000 * 60 * 24 * 30)
      return `${(dif / 1000 / 60 / 60 / 24).toFixed()} Days Ago`;
    if (dif < 60 * 1000 * 60 * 24 * 60) return `1 Month Ago`;
    if (dif < 60 * 1000 * 60 * 24 * 30 * 12)
      return `${(dif / 1000 / 60 / 60 / 24 / 30).toFixed()} Months Ago`;
    if (dif < 60 * 1000 * 60 * 24 * 365 * 2) return `1 Year Ago`;
    return `${(dif / 1000 / 60 / 60 / 24 / 365).toFixed()} Years Ago`;
  }, []);

  useEffect(() => {
    getNotifications(false);
  }, [getNotifications]);

  const getUserDetails = useCallback(async () => {
    if (!networkContext.isConnected) {
      return networkContext.showNoConnectionAlert();
    }

    const userDetails = await getUserData();
    setLoggedInUser(userDetails);
    setIsRefreshing(false);
  }, [networkContext, setLoggedInUser, setIsRefreshing]);

  const removeNotificationFromList = useCallback(
    (notificationId: number) => {
      if (!networkContext.isConnected) {
        return networkContext.showNoConnectionAlert();
      }

      setNotifications(
        notifications.filter((c: INotification) => c.id !== notificationId)
      );
      setClickedNotification({} as INotification);
      setShowReplyNotification(false);

      removeNotification(notificationId);
    },
    [
      networkContext,
      notifications,
      setNotifications,
      setClickedNotification,
      setShowReplyNotification
    ]
  );

  const turnOfffNotifications = useCallback(
    async (type: NotificationTypes) => {
      if (!networkContext.isConnected) {
        return networkContext.showNoConnectionAlert();
      }

      setShowReplyNotification(false);
      setClickedNotification({} as INotification);

      const {
        notify_on_lesson_comment_reply,
        notify_on_lesson_comment_like,
        notify_on_forum_followed_thread_reply,
        notify_on_forum_post_like,
        notify_on_forum_post_reply
      } = user;
      let attributes;

      if (type === 'lesson comment reply') {
        setLoggedInUser({
          ...user,
          notify_on_lesson_comment_reply: !notify_on_lesson_comment_reply
        });
        attributes = {
          notify_on_lesson_comment_reply: !notify_on_lesson_comment_reply
        };
      } else if (type === 'lesson comment liked') {
        setLoggedInUser({
          ...user,
          notify_on_lesson_comment_like: !notify_on_lesson_comment_like
        });
        attributes = {
          notify_on_lesson_comment_like: !notify_on_lesson_comment_like
        };
      } else if (type === 'forum post liked') {
        setLoggedInUser({
          ...user,
          notify_on_forum_post_like: !notify_on_forum_post_like
        });
        attributes = {
          notify_on_forum_post_like: !notify_on_forum_post_like
        };
      } else if (type === 'forum post in followed thread') {
        setLoggedInUser({
          ...user,
          notify_on_forum_followed_thread_reply: !notify_on_forum_followed_thread_reply
        });
        attributes = {
          notify_on_forum_followed_thread_reply: !notify_on_forum_followed_thread_reply
        };
      } else if (type === 'forum post reply') {
        setLoggedInUser({
          ...user,
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
    },
    [networkContext, setLoggedInUser, user]
  );

  const openNotification = useCallback((notification: INotification) => {
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
  }, []);

  const loadMoreNotifications = () => {
    // TODO wait for state change
    setAnimateLoadMore(true);
    getNotifications(true);
  };

  const onRefresh = useCallback(() => {
    // TODO wait for state change

    setIsRefreshing(true);
    getUserDetails();
    getNotifications(false);
  }, [getNotifications, getUserDetails]);

  return (
    <SafeAreaView style={localStyles.mainContainer}>
      <StatusBar backgroundColor={mainBackground} barStyle={'light-content'} />
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
          data={notifications}
          keyExtractor={(_, index) => index.toString()}
          onEndReached={loadMoreNotifications}
          onEndReachedThreshold={0.01}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
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
                        user.profile_picture_url ||
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
                  {user.display_name}
                </Text>
                <Text style={localStyles.memberSinceText}>
                  MEMBER SINCE {user.created_at?.slice(0, 4)}
                </Text>
              </View>

              <View style={localStyles.rankContainer}>
                <TouchableOpacity
                  style={localStyles.center}
                  onPress={() => setShowXpRank(true)}
                >
                  <Text style={localStyles.redXpRank}>XP</Text>
                  <Text style={localStyles.whiteXpRank}>{user.totalXp}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowXpRank(true)}
                  style={localStyles.center}
                >
                  <Text style={localStyles.redXpRank}>RANK</Text>
                  <Text style={localStyles.whiteXpRank}>{user.xpRank}</Text>
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
            isLoading ? (
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
              animating={animateLoadMore}
              hidesWhenStopped={true}
            />
          )}
          renderItem={({
            item,
            index
          }: {
            item: INotification;
            index: number;
          }) => (
            <TouchableOpacity
              style={[
                localStyles.notification,
                {
                  paddingLeft: 10,
                  backgroundColor:
                    index % 2 ? mainBackground : notificationColor
                }
              ]}
              onPress={() => openNotification(item)}
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
                  {lastPostTime(item.created_at)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={localStyles.threeDotsContainer}
                  onPress={() => {
                    setShowReplyNotification(true);
                    setClickedNotification(item);
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
      {showXpRank && (
        <XpRank
          hideXpRank={() => setShowXpRank(false)}
          xp={parseInt(user.totalXp)}
          rank={user.xpRank}
        />
      )}

      {showReplyNotification && (
        <ReplyNotification
          removeNotification={notificationId =>
            removeNotificationFromList(notificationId)
          }
          turnOfffNotifications={() =>
            turnOfffNotifications(clickedNotification?.type)
          }
          hideReplyNotification={() => setShowReplyNotification(false)}
          data={clickedNotification}
          notificationStatus={
            user[messageDict[clickedNotification.type]?.field]
          }
        />
      )}

      {/* <NavigationBar currentPage={'PROFILE'} pad={true} /> */}
    </SafeAreaView>
  );
};

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
