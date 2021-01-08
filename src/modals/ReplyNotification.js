/**
 * ReplyNotification
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, } from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
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

class ReplyNotification extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.data.type == 'new content releases'
         ? this.props.data.content?.display_name
          : this.props.data.sender?.display_name,
      profileImage: this.props.data.type == 'new content releases'
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
                    <View style={[styles.centerContent, localStyles.videoContainer]}>
                      <FontAwesome size={fullWidth * 0.045} color={'white'} name={'video-camera'} />
                    </View>
                  )}
                  {messageDict[this.props.data.type][2] == 'orange' && (
                    <View style={[styles.centerContent, localStyles.chatContainer]}>
                      <Chat height={fullWidth * 0.05} width={fullWidth * 0.05} fill={'white'} />
                    </View>
                  )}
                  {messageDict[this.props.data.type][2] == 'blue' && (
                    <View style={[styles.centerContent, localStyles.likeContainer]}>
                      <AntIcon size={fullWidth * 0.045} color={'white'} name={'like1'} />
                    </View>
                  )}
                  <FastImage
                    style={localStyles.image}
                    source={{uri: this.state.profileImage}}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              </View>
            </View>
            <Text style={localStyles.replyUser}>
              <Text style={localStyles.user}>{this.state.user}</Text>{' '}{this.state.type}</Text>
            <View style={{ flex: 1 }} />
            <View style={localStyles.removeContainer}>
              <TouchableOpacity
                style={styles.container}
                onPress={() => this.props.removeNotification(this.props.data)}
              >
                <View style={{ flex: 1 }} />
                <View style={localStyles.crossContainer}>
                  <EntypoIcon name={'cross'} size={26 * factorRatio} color={colors.pianoteRed} />
                  <Text style={localStyles.removeText}>Remove this notification</Text>
                </View>
                <View style={{ flex: 1 }} />
              </TouchableOpacity>
            </View>
            <View style={localStyles.muteContainer}>
              <TouchableOpacity
                style={styles.container}
                onPress={() => this.props.turnOfffNotifications(this.state.statusChange)}
              >
                <View style={{ flex: 1 }} />
                <View style={localStyles.notificationContainer}>
                  <IonIcon
                    name={'ios-notifications-outline'}
                    size={26 * factorRatio}
                    color={colors.pianoteRed}
                  />
                  <View style={{ width: 5 * factorRatio }} />
                  <Text style={localStyles.removeText}>
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
    marginTop: Dimensions.get('window').height * 0.0175,
    flexDirection: 'row',
    height: '30%',
    marginBottom: 7.5 * Dimensions.get('window').height / 812,
  },
  container: {
    height: DeviceInfo.isTablet() ? Dimensions.get('window').height * 0.45 : Dimensions.get('window').height * 0.35,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#00101d'
  },
  profileContainer2: {
    height: Dimensions.get('window').width * 0.165,
    width: Dimensions.get('window').width * 0.165,
    borderRadius: 100 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    backgroundColor: '#445f73'
  },
  videoContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: Dimensions.get('window').width * 0.075,
    width: Dimensions.get('window').width * 0.075,
    backgroundColor: 'red',
    borderRadius: 100 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    zIndex: 5
  },
  chatContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: Dimensions.get('window').width * 0.075,
    width: Dimensions.get('window').width * 0.075,
    backgroundColor: 'orange',
    borderRadius: 100 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    zIndex: 5
  },
  likeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: Dimensions.get('window').width * 0.075,
    width: Dimensions.get('window').width * 0.075,
    backgroundColor: 'blue',
    borderRadius: 100 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    zIndex: 5
  },
  image: {
    flex: 1,
    borderRadius: 100 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2
  },
  replyUser: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    textAlign: 'center',
    color: '#445f73'
  },
  user: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 15 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    textAlign: 'center'
  },
  removeContainer: {
    height: '18.5%',
    width: '100%',
    borderTopWidth: 0.5 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    borderTopColor: '#445f73'
  },
  crossContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Dimensions.get('window').width * 0.035
  },
  removeText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 17 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    color: '#445f73',
  },
  muteContainer: {
    height: '18.5%',
    width: '100%',
    marginBottom: '10%',
    borderTopWidth: 0.5 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    borderTopColor: '#445f73'
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Dimensions.get('window').width * 0.035
  }
});

export default withNavigation(ReplyNotification);
