/**
 * ReplyNotification
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import Chat from 'Pianote2/src/assets/img/svgs/chat.svg';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getUserData } from 'Pianote2/src/services/UserDataAuth.js';

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
  'new content releases': ['', false, 'red', 'new release notifications'] // notify_weekly_update: this.state.notify_weekly_update,
};

export default class ReplyNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user:
        this.props.data.type == 'new content releases'
          ? this.props.data.content?.display_name
          : this.props.data.sender?.display_name,
      profileImage:
        this.props.data.type == 'new content releases'
          ? this.props.data.content?.thumbnail_url
          : this.props.data.sender?.profile_image_url,
      type: messageDict[this.props.data.type]?.[0],
      notificationStatus: this.props.notificationStatus,
      notify_on_forum_followed_thread_reply: false,
      notify_on_forum_post_like: false,
      notify_on_forum_post_reply: false,
      notify_on_lesson_comment_like: false,
      notify_on_lesson_comment_reply: false,
      notify_weekly_update: false,
      statusChange: false
    };
  }

  componentDidMount = async () => {
    let userData = await getUserData();
    let statusChange = null;

    this.setState({
      notify_on_lesson_comment_reply: userData?.notify_on_lesson_comment_reply,
      notify_on_lesson_comment_like: userData?.notify_on_lesson_comment_like,
      notify_on_forum_post_reply: userData?.notify_on_forum_post_reply,
      notify_on_forum_post_like: userData?.notify_on_forum_post_like,
      notifications_summary_frequency_minutes:
        userData?.notifications_summary_frequency_minutes,
      notify_on_forum_followed_thread_reply:
        userData?.notify_on_forum_followed_thread_reply,
      notify_weekly_update: userData?.notify_weekly_update
    });

    if (this.state.type == 'replied to your comment.') {
      statusChange = {
        notify_on_lesson_comment_reply: !this.state
          .notify_on_lesson_comment_reply
      };
    } else if (this.state.type == 'liked your comment.') {
      statusChange = {
        notify_on_lesson_comment_like: !this.state.notify_on_lesson_comment_like
      };
    } else if (this.state.type == 'replied to your forum post.') {
      statusChange = {
        notify_on_forum_post_reply: !this.state.notify_on_forum_post_reply
      };
    } else if (this.state.type == 'liked your forum post.') {
      statusChange = {
        notify_on_forum_post_like: !this.state.notify_on_forum_post_like
      };
    } else if (this.state.type == 'post in followed thread.') {
      statusChange = {
        notify_on_forum_followed_thread_reply: !this.state
          .notify_on_forum_followed_thread_reply
      };
    } else if (this.state.type == '') {
      statusChange = {
        notify_weekly_update: !this.state.notify_weekly_update
      };
    }

    this.setState({ statusChange });
  };

  render = () => {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => this.props.hideReplyNotification()}
            style={styles.container}
          />
        </View>
        <View style={localStyles.container}>
          <View style={styles.container}>
            <View style={[styles.centerContent, localStyles.profileContainer]}>
              <View style={styles.centerContent}>
                <View style={localStyles.profileContainer2}>
                  {messageDict[this.props.data.type][2] == 'red' && (
                    <View
                      style={[styles.centerContent, localStyles.videoContainer]}
                    >
                      <FontAwesome
                        size={sizing.infoButtonSize}
                        color={'white'}
                        name={'video-camera'}
                      />
                    </View>
                  )}
                  {messageDict[this.props.data.type][2] == 'orange' && (
                    <View
                      style={[styles.centerContent, localStyles.chatContainer]}
                    >
                      <Chat
                        height={sizing.infoButtonSize}
                        width={sizing.infoButtonSize}
                        fill={'white'}
                      />
                    </View>
                  )}
                  {messageDict[this.props.data.type][2] == 'blue' && (
                    <View
                      style={[styles.centerContent, localStyles.likeContainer]}
                    >
                      <AntIcon
                        size={sizing.infoButtonSize}
                        color={'white'}
                        name={'like1'}
                      />
                    </View>
                  )}
                  <FastImage
                    style={localStyles.image}
                    source={{
                      uri:
                        this.state.profileImage !== ''
                          ? this.state.profileImage
                          : 'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              </View>
            </View>
            <Text style={localStyles.replyUser}>
              <Text style={localStyles.user}>{this.state.user}</Text>{' '}
              {this.state.type}
            </Text>
            <View style={{ flex: 1 }} />
            <View style={localStyles.removeContainer}>
              <TouchableOpacity
                style={styles.container}
                onPress={() => this.props.removeNotification(this.props.data)}
              >
                <View style={{ flex: 1 }} />
                <View style={localStyles.crossContainer}>
                  <EntypoIcon
                    name={'cross'}
                    size={sizing.myListButtonSize * 1.2}
                    color={colors.pianoteRed}
                  />
                  <Text
                    style={[
                      localStyles.removeText,
                      { fontSize: sizing.descriptionText }
                    ]}
                  >
                    Remove this notification
                  </Text>
                </View>
                <View style={{ flex: 1 }} />
              </TouchableOpacity>
            </View>
            <View style={localStyles.muteContainer}>
              <TouchableOpacity
                style={styles.container}
                onPress={() =>
                  this.props.turnOfffNotifications(this.state.statusChange)
                }
              >
                <View style={{ flex: 1 }} />
                <View style={localStyles.notificationContainer}>
                  <IonIcon
                    name={'ios-notifications-outline'}
                    size={sizing.myListButtonSize}
                    color={colors.pianoteRed}
                  />
                  <Text
                    style={[
                      localStyles.removeText,
                      { fontSize: sizing.descriptionText }
                    ]}
                  >
                    Turn {this.state.notificationStatus ? 'off' : 'on'}{' '}
                    {messageDict[this.props.data.type][3]}
                  </Text>
                </View>
                <View style={{ flex: 1 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };
}

const localStyles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    paddingVertical: 30
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#00101d'
  },
  profileContainer2: {
    height: DeviceInfo.isTablet() ? 120 : 80,
    width: DeviceInfo.isTablet() ? 120 : 80,
    borderRadius: 100,
    backgroundColor: '#445f73'
  },
  videoContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: DeviceInfo.isTablet() ? 40 : 30,
    width: DeviceInfo.isTablet() ? 40 : 30,
    backgroundColor: 'red',
    borderRadius: 100,
    zIndex: 5
  },
  chatContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: DeviceInfo.isTablet() ? 40 : 30,
    width: DeviceInfo.isTablet() ? 40 : 30,
    backgroundColor: 'orange',
    borderRadius: 100,
    zIndex: 5
  },
  likeContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: DeviceInfo.isTablet() ? 40 : 30,
    width: DeviceInfo.isTablet() ? 40 : 30,
    backgroundColor: 'blue',
    borderRadius: 100,
    zIndex: 5
  },
  image: {
    flex: 1,
    borderRadius: 100
  },
  replyUser: {
    fontFamily: 'OpenSans-Regular',
    fontSize: DeviceInfo.isTablet() ? 16 : 12,
    paddingBottom: 20,
    textAlign: 'center',
    color: '#445f73'
  },
  user: {
    fontFamily: 'OpenSans-Bold',
    fontSize: DeviceInfo.isTablet() ? 16 : 12,
    textAlign: 'center'
  },
  removeText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: DeviceInfo.isTablet() ? 16 : 12,
    color: '#445f73',
    paddingLeft: 10
  },
  crossContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  removeContainer: {
    height: DeviceInfo.isTablet() ? 70 : 50,
    width: '100%',
    borderTopWidth: 0.5,
    paddingLeft: 10,
    borderTopColor: '#445f73'
  },
  muteContainer: {
    height: DeviceInfo.isTablet() ? 70 : 50,
    width: '100%',
    marginBottom: DeviceInfo.hasNotch() ? 20 : 0,
    borderTopWidth: 0.5,
    borderTopColor: '#445f73'
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  }
});
