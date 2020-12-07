/**
 * ReplyNotification
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
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

class ReplyNotification extends React.Component {
  static navigationOptions = { header: null };
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
    console.log(this.state.profileImage);
    let userData = await getUserData();
    let statusChange = null;

    this.setState({
      notify_on_lesson_comment_reply: userData.notify_on_lesson_comment_reply,
      notify_on_lesson_comment_like: userData.notify_on_lesson_comment_like,
      notify_on_forum_post_reply: userData.notify_on_forum_post_reply,
      notify_on_forum_post_like: userData.notify_on_forum_post_like,
      notifications_summary_frequency_minutes:
        userData.notifications_summary_frequency_minutes,
      notify_on_forum_followed_thread_reply:
        userData.notify_on_forum_followed_thread_reply,
      notify_weekly_update: userData.notify_weekly_update
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
      <View
        key={'container'}
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'transparent'
        }}
      >
        <View key={'buffTop'} style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => this.props.hideReplyNotification()}
            style={{
              height: '100%',
              width: '100%'
            }}
          ></TouchableOpacity>
        </View>
        <View
          key={'content'}
          style={{
            height: onTablet ? fullHeight * 0.45 : fullHeight * 0.35,
            width: '100%',
            flexDirection: 'row'
          }}
        >
          <View
            key={'content'}
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: colors.mainBackground
            }}
          >
            <View style={{ height: '2%' }} />
            <View
              key={'profile'}
              style={{
                flexDirection: 'row',
                height: '30%'
              }}
            >
              <View style={{ flex: 1 }} />
              <View>
                <View style={{ flex: 1 }} />
                <View
                  style={{
                    height: fullWidth * 0.165,
                    width: fullWidth * 0.165,
                    borderRadius: 100 * factorRatio,
                    backgroundColor: colors.secondBackground
                  }}
                >
                  {messageDict[this.props.data.type][2] == 'red' && (
                    <View
                      style={[
                        styles.centerContent,
                        {
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          height: fullWidth * 0.075,
                          width: fullWidth * 0.075,
                          backgroundColor: 'red',
                          borderRadius: 100 * factorRatio,
                          zIndex: 5
                        }
                      ]}
                    >
                      <FontAwesome
                        size={fullWidth * 0.045}
                        color={'white'}
                        name={'video-camera'}
                      />
                    </View>
                  )}
                  {messageDict[this.props.data.type][2] == 'orange' && (
                    <View
                      style={[
                        styles.centerContent,
                        {
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          height: fullWidth * 0.075,
                          width: fullWidth * 0.075,
                          backgroundColor: 'orange',
                          borderRadius: 100 * factorRatio,
                          zIndex: 5
                        }
                      ]}
                    >
                      <Chat
                        height={fullWidth * 0.05}
                        width={fullWidth * 0.05}
                        fill={'white'}
                      />
                    </View>
                  )}
                  {messageDict[this.props.data.type][2] == 'blue' && (
                    <View
                      style={[
                        styles.centerContent,
                        {
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          height: fullWidth * 0.075,
                          width: fullWidth * 0.075,
                          backgroundColor: 'blue',
                          borderRadius: 100 * factorRatio,
                          zIndex: 5
                        }
                      ]}
                    >
                      <AntIcon
                        size={fullWidth * 0.045}
                        color={'white'}
                        name={'like1'}
                      />
                    </View>
                  )}
                  <FastImage
                    style={{
                      flex: 1,
                      borderRadius: 100 * factorRatio
                    }}
                    source={{
                      uri: this.state.profileImage
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ flex: 1 }} />
            </View>
            <View style={{ height: 7.5 * factorVertical }} />
            <Text
              key={'replyUser'}
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 14 * factorRatio,
                textAlign: 'center',
                color: colors.secondBackground
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 15 * factorRatio,
                  fontWeight: '600',
                  textAlign: 'center'
                }}
              >
                {this.state.user}
              </Text>{' '}
              {this.state.type}
            </Text>
            <View style={{ flex: 1 }} />
            <View
              key={'remove'}
              style={{
                height: '18.5%',
                width: '100%',
                borderTopWidth: 0.5 * factorRatio,
                borderTopColor: colors.secondBackground
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.removeNotification(this.props.data)}
                style={{
                  height: '100%',
                  width: '100%'
                }}
              >
                <View style={{ flex: 1 }} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: fullWidth * 0.035
                  }}
                >
                  <EntypoIcon
                    name={'cross'}
                    size={26 * factorRatio}
                    color={colors.pianoteRed}
                  />
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 17 * factorRatio,
                      color: colors.secondBackground
                    }}
                  >
                    Remove this notification
                  </Text>
                </View>
                <View style={{ flex: 1 }} />
              </TouchableOpacity>
            </View>
            <View
              key={'mute'}
              style={{
                height: '18.5%',
                width: '100%',
                borderTopWidth: 0.5 * factorRatio,
                borderTopColor: colors.secondBackground
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.turnOfffNotifications(this.state.statusChange);
                }}
                style={{
                  height: '100%',
                  width: '100%'
                }}
              >
                <View style={{ flex: 1 }} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: fullWidth * 0.035
                  }}
                >
                  <IonIcon
                    name={'ios-notifications-outline'}
                    size={26 * factorRatio}
                    color={colors.pianoteRed}
                  />
                  <View style={{ width: 5 * factorRatio }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 17 * factorRatio,
                      color: colors.secondBackground
                    }}
                  >
                    Turn {this.state.notificationStatus ? 'off' : 'on'}{' '}
                    {messageDict[this.props.data.type][3]}
                  </Text>
                </View>
                <View style={{ flex: 1 }} />
              </TouchableOpacity>
            </View>
            <View style={{ height: '12.5%' }} />
          </View>
        </View>
      </View>
    );
  };
}

export default withNavigation(ReplyNotification);
