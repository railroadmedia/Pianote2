/**
 * PROPS: comment, showReplyIcon, styles
 * comment: comment to be displayed
 * showReplyIcon: variable that tells the component if it should display 'View replies' label
 * use it like:
* <Comment
    showReplyIcon={true}
    comment={{
      id: 1234,
      is_liked: false,
      like_count: 1,
      user: {
        'fields.profile_picture_image_url':
          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2000px-No_image_available.svg.png',
        xp: 1000,
        display_name: 'Harold Pierce',
        xp_level: 'Master'
      },
      created_on: '2020/02/04 09:00',
      image: 'https://d1923uyy6spedc.cloudfront.net/9-4-0.png',
      video:'https://player.vimeo.com/external/535073657.sd.mp4?s=e87212d62e9076fcab98191fe6e42838fc395a49&profile_id=164&oauth2_token_id=1284792283',
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
    }}
    appColor={appColor}
    isDark={isDark}
    NetworkContext={Discussions.contextType}
  />
 */
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';

import RNVideo from 'react-native-video';
import { more, like, likeOn, replies } from '../assets/svgs';

const fallbackProfilePicUri =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2000px-No_image_available.svg.png';
const windowWidth = Dimensions.get('window').width;
const maxFontMultiplier =
  windowWidth < 375 ? 1 : windowWidth < 1024 ? 1.35 : 1.8;

export default class Comment extends React.PureComponent {
  state = {
    isLiked: null,
    likeCount: null,
    containerWidth: windowWidth,
    showReplies: false
  };

  constructor(props) {
    super(props);
    let { NetworkContext, isDark } = props;
    Comment.contextType = NetworkContext;
    styles = setStyles(isDark);
    this.state.isLiked = props.comment.is_liked;
    this.state.likeCount = props.comment.like_count;
  }

  parseXpValue(xp) {
    if (xp >= 100000 && xp < 1000000) {
      return Math.round(xp / 1000) + 'K';
    } else if (xp >= 1000000) {
      return Math.round(xp / 1000000).toFixed(1) + 'M';
    }

    return xp;
  }

  likeOrDislikeComment = id => {};

  goToReplies = () => {};

  deleteComment = id => {};

  render() {
    let { isLiked, likeCount, containerWidth } = this.state;
    let { showReplyIcon, comment, appColor, isDark } = this.props;
    let profilePicUri = fallbackProfilePicUri;
    if (comment.user)
      profilePicUri = comment.user['fields.profile_picture_image_url'];

    return (
      <View style={styles.commentContainer}>
        <View>
          <Image source={{ uri: profilePicUri }} style={styles.userImage} />
          <Text
            maxFontSizeMultiplier={maxFontMultiplier}
            style={styles.xpStyle}
          >
            {comment.user ? comment.user.xp_level : ''}
          </Text>
          <Text
            maxFontSizeMultiplier={maxFontMultiplier}
            style={styles.xpStyle}
          >
            {comment.user ? this.parseXpValue(comment.user.xp) : ''} XP
          </Text>
        </View>
        <View>
          <View style={{ width: containerWidth - 85 }}>
            <Text
              maxFontSizeMultiplier={maxFontMultiplier}
              style={styles.nameText}
            >
              {comment.user ? comment.user['display_name'] : ''}
            </Text>
            <Text
              maxFontSizeMultiplier={maxFontMultiplier}
              style={styles.commentText}
            >
              {comment.comment}
            </Text>
            {comment.image && (
              <Image
                source={{ uri: comment.image }}
                style={styles.commentImage}
              />
            )}
            {comment.video && (
              <RNVideo
                resizeMode='cover'
                paused={true}
                controls={true}
                style={styles.commentImage}
                source={{
                  uri: comment.video
                }}
              />
            )}
          </View>
          <View style={styles.container}>
            <Text maxFontSizeMultiplier={maxFontMultiplier} style={styles.tag}>
              {moment.utc(comment.created_on).local().fromNow()}
            </Text>
          </View>
          <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.centerContainer}>
                <TouchableOpacity
                  testID='likeBtn'
                  onPress={() => this.likeOrDislikeComment(comment.id)}
                  style={{ marginRight: 10 }}
                >
                  {isLiked
                    ? likeOn({ height: 20, width: 20, fill: appColor })
                    : like({ height: 20, width: 20, fill: appColor })}
                </TouchableOpacity>

                {likeCount > 0 && (
                  <TouchableOpacity testID='showLikesBtn' style={styles.bubble}>
                    <Text
                      maxFontSizeMultiplier={maxFontMultiplier}
                      style={[styles.bubbleText, { color: appColor }]}
                    >
                      {likeCount === 1
                        ? likeCount + ' LIKE'
                        : likeCount + ' LIKES'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {showReplyIcon && (
                <TouchableOpacity
                  testID='replyBtn'
                  onPress={() => this.setState({ showReplies: true })}
                  style={styles.replyIconBtn}
                >
                  {replies({ height: 20, width: 20, fill: appColor })}
                </TouchableOpacity>
              )}
            </View>
            {/* {more({ width: 15, height: 5, fill: appColor })} */}
          </View>
        </View>
      </View>
    );
  }
}

let setStyles = isDark =>
  StyleSheet.create({
    commentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: isDark ? '#00101D' : '#F7F9FC'
    },
    xpStyle: {
      fontSize: 10,
      fontFamily: 'RobotoCondensed-Bold',
      alignSelf: 'center',
      color: isDark ? '#97AABE' : '#445F74'
    },
    nameText: {
      fontSize: 16,
      fontFamily: 'OpenSans-Bold',
      color: isDark ? '#FFFFFF' : '#00101D'
    },
    commentText: {
      fontSize: 14,
      fontFamily: 'OpenSans',
      color: isDark ? '#FFFFFF' : '#00101D'
    },
    bubble: {
      width: 60,
      height: 16,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#001f38' : '#97AABE'
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5
    },
    centerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },
    bubbleText: {
      padding: 2,
      fontSize: 10,
      fontFamily: 'OpenSans'
    },
    tag: {
      fontSize: 11,
      fontFamily: 'OpenSans',
      color: isDark ? '#97AABE' : '#445F74'
    },
    userImage: {
      backgroundColor: 'transparent',
      height: 38,
      aspectRatio: 1,
      borderRadius: 18,
      alignSelf: 'center'
    },
    replyIconBtn: {
      marginLeft: 10,
      flexDirection: 'row',
      alignItems: 'center'
    },
    commentImage: {
      width: '100%',
      aspectRatio: 16 / 9,
      marginTop: 10
    }
  });
