/**
 * PROPS: comment, showReplyIcon, onEdit, onDelete, appColor, isDark
 * comment: comment to be displayed
 * showReplyIcon: variable that tells the component if it should display 'View replies' label
 * onEdit(): simple navigation to 'Edit' page
 * onDelete(): callback after delete called (for refreshing comments)
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

import Moderate from './Moderate';

import { like, likeOn, replies } from '../assets/svgs';
import forumService from '../services/forum.service';

const fallbackProfilePicUri =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2000px-No_image_available.svg.png';
const windowWidth = Dimensions.get('window').width;
const maxFontMultiplier =
  windowWidth < 375 ? 1 : windowWidth < 1024 ? 1.35 : 1.8;
let styles;
export default class Comment extends React.PureComponent {
  state = {
    isLiked: null,
    likeCount: null,
    containerWidth: windowWidth,
    showReplies: false
  };

  constructor(props) {
    super(props);
    let { isDark } = props;
    Comment.contextType = forumService.NetworkContext;

    styles = setStyles(isDark);
    this.state.isLiked = props.comment.is_liked;
    this.state.likeCount = props.comment.like_count;
  }

  get connection() {
    if (this.context.isConnected) return true;
    this.context.showNoConnectionAlert();
  }

  parseXpValue(xp) {
    if (xp >= 100000 && xp < 1000000) {
      return Math.round(xp / 1000) + 'K';
    } else if (xp >= 1000000) {
      return Math.round(xp / 1000000).toFixed(1) + 'M';
    }

    return xp;
  }

  likeOrDislikeComment = id => {
    if (!this.connection) return;

    if (id === this.props.comment.id) {
      let { likeCount, isLiked } = this.state;
      if (isLiked) {
        likeCount--;
        isLiked = false;
        forumService.likeComment(id);
      } else {
        likeCount++;
        isLiked = true;
        forumService.disLikeComment(id);
      }
      this.setState({ likeCount, isLiked });
    }
  };

  render() {
    let { isLiked, likeCount, containerWidth } = this.state;
    let { showReplyIcon, comment, appColor, isDark } = this.props;
    let profilePicUri = fallbackProfilePicUri;
    if (comment.user)
      profilePicUri = comment.user['fields.profile_picture_image_url'];

    return (
      <View style={styles.commentContainer}>
        <View style={{ paddingHorizontal: 10 }}>
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
                  onPress={() =>
                    this.props.goToReplies(comment, isDark, appColor)
                  }
                  style={styles.replyIconBtn}
                >
                  {replies({ height: 20, width: 20, fill: appColor })}
                </TouchableOpacity>
              )}
            </View>
            <Moderate
              id={comment.id}
              appColor={appColor}
              onEdit={this.props.onEdit}
              onDelete={this.props.onDelete}
            />
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
      padding: 10,
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
