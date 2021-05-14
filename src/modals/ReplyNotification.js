import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Chat from '../../src/assets/img/svgs/chat.svg';
import Icon from '../assets/icons';
import { getUserData } from '../../src/services/UserDataAuth.js';

const onTablet = global.onTablet;
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
  'forum post reply': {
    message: 'replied to your forum post.',
    new: true,
    color: 'orange',
    type: 'forum post reply notifications'
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

export default class ReplyNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    console.log(this.props);

    if (
      messageDict[this.props.data.type]?.message === 'replied to your comment.'
    ) {
      statusChange = {
        notify_on_lesson_comment_reply: !this.state
          .notify_on_lesson_comment_reply
      };
    } else if (
      messageDict[this.props.data.type]?.message === 'liked your comment.'
    ) {
      statusChange = {
        notify_on_lesson_comment_like: !this.state.notify_on_lesson_comment_like
      };
    } else if (
      messageDict[this.props.data.type]?.message ==
      'replied to your forum post.'
    ) {
      statusChange = {
        notify_on_forum_post_reply: !this.state.notify_on_forum_post_reply
      };
    } else if (
      messageDict[this.props.data.type]?.message === 'liked your forum post.'
    ) {
      statusChange = {
        notify_on_forum_post_like: !this.state.notify_on_forum_post_like
      };
    } else if (
      messageDict[this.props.data.type]?.message === 'post in followed thread.'
    ) {
      statusChange = {
        notify_on_forum_followed_thread_reply: !this.state
          .notify_on_forum_followed_thread_reply
      };
    } else if (messageDict[this.props.data.type]?.message === '') {
      statusChange = {
        notify_weekly_update: !this.state.notify_weekly_update
      };
    }

    this.setState({
      statusChange,
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
  };

  render = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => this.props.hideReplyNotification()}
          style={styles.container}
        />
        <SafeAreaView style={localStyles.container}>
          <View style={{ width: '100%', justifyContent: 'space-between' }}>
            <>
              <View
                style={[styles.centerContent, localStyles.profileContainer]}
              >
                <View style={localStyles.profileContainer2}>
                  {messageDict[this.props.data.type].color === 'red' && (
                    <View
                      style={[styles.centerContent, localStyles.videoContainer]}
                    >
                      <Icon.FontAwesome
                        size={sizing.infoButtonSize}
                        color={'white'}
                        name={'video-camera'}
                      />
                    </View>
                  )}
                  {messageDict[this.props.data.type].color === 'orange' && (
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
                  {messageDict[this.props.data.type].color === 'blue' && (
                    <View
                      style={[styles.centerContent, localStyles.likeContainer]}
                    >
                      <Icon.AntDesign
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
                        this.props.data.type === 'new content releases'
                          ? this.props.data.content?.thumbnail_url
                          : this.props.data.sender?.profile_image_url
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              </View>
              <Text style={localStyles.replyUser}>
                <Text style={localStyles.user}>
                  {this.props.data.type === 'new content releases'
                    ? this.props.data.content?.display_name
                    : this.props.data.sender?.display_name}
                </Text>{' '}
                {messageDict[this.props.data.type]?.message}
              </Text>
            </>
            <>
              <View style={localStyles.removeContainer}>
                <TouchableOpacity
                  style={[styles.container, { justifyContent: 'center' }]}
                  onPress={() => this.props.removeNotification(this.props.data)}
                >
                  <View style={localStyles.crossContainer}>
                    <Icon.Entypo
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
                </TouchableOpacity>
              </View>
              <View style={localStyles.muteContainer}>
                <TouchableOpacity
                  style={[styles.container, { justifyContent: 'center' }]}
                  onPress={() =>
                    this.props.turnOfffNotifications(this.state.statusChange)
                  }
                >
                  <View style={localStyles.notificationContainer}>
                    <Icon.Ionicons
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
                      Turn {this.props.notificationStatus ? 'off' : 'on'}{' '}
                      {messageDict[this.props.data.type].type}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          </View>
        </SafeAreaView>
      </>
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
    height: onTablet ? 120 : 80,
    width: onTablet ? 120 : 80,
    borderRadius: 100,
    backgroundColor: '#445f73'
  },
  videoContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: onTablet ? 40 : 30,
    width: onTablet ? 40 : 30,
    backgroundColor: 'red',
    borderRadius: 100,
    zIndex: 5
  },
  chatContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: onTablet ? 40 : 30,
    width: onTablet ? 40 : 30,
    backgroundColor: 'orange',
    borderRadius: 100,
    zIndex: 5
  },
  likeContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: onTablet ? 40 : 30,
    width: onTablet ? 40 : 30,
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
    fontSize: onTablet ? 16 : 12,
    paddingBottom: 20,
    textAlign: 'center',
    color: '#445f73'
  },
  user: {
    fontFamily: 'OpenSans-Bold',
    fontSize: onTablet ? 16 : 12,
    textAlign: 'center'
  },
  removeText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 16 : 12,
    color: '#445f73',
    paddingLeft: 10
  },
  crossContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  removeContainer: {
    height: onTablet ? 70 : 50,
    width: '100%',
    borderTopWidth: 0.5,
    paddingLeft: 10,
    borderTopColor: '#445f73'
  },
  muteContainer: {
    height: onTablet ? 70 : 50,
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: '#445f73'
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  }
});
