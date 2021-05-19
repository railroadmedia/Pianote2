/**
 * PROPS: comment, onEdit, onReplies, onDelete, appColor, isDark
 * comment: comment to be displayed
 * onEdit(): simple navigation to 'Edit' page
 * onDelete(): callback after delete called (for refreshing comments)
 * onReplies(): simple navigation to 'Replies' page
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Moderate from './Moderate';
import AccessLevelAvatar from './AccessLevelAvatar';

import { like, likeOn, replies } from '../assets/svgs';
import {
  likeComment,
  disLikeComment,
  connection
} from '../services/forum.service';

let styles;
export default class Post extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLiked: props.comment.is_liked,
      likeCount: props.comment.like_count
    };
    styles = setStyles(props.isDark);
  }

  get parseXpValue() {
    try {
      let { xp } = this.props.comment.user;
      if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)} M XP`;
      if (xp >= 10000) return `${(xp / 10000).toFixed(1)} K XP`;
      return `${xp} XP`;
    } catch (e) {
      return '';
    }
  }

  get lastPostTime() {
    let dif = new Date() - new Date(this.props.comment.created_on);
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
  }

  toggleLike = () => {
    if (!connection(true)) return;
    let { id } = this.props.comment;
    this.setState(({ isLiked, likeCount }) => {
      if (isLiked) {
        likeCount--;
        disLikeComment(id);
      } else {
        likeCount++;
        likeComment(id);
      }
      return { likeCount, isLiked: !isLiked };
    });
  };

  render() {
    let { isLiked, likeCount } = this.state;
    let { comment, appColor, onReplies } = this.props;
    return (
      <View style={{ flexDirection: 'row', marginTop: 15 }}>
        <View style={{ marginHorizontal: 15 }}>
          <AccessLevelAvatar
            uri={comment.user['fields.profile_picture_image_url']}
            height={38}
            appColor={appColor}
            tagHeight={4}
            accessLevelName={comment.user.accessLevelName}
          />
          <Text maxFontSizeMultiplier={1} style={styles.xp}>
            {comment.user ? comment.user.xp_level : ''}
          </Text>
          <Text maxFontSizeMultiplier={1} style={styles.xp}>
            {this.parseXpValue}
          </Text>
        </View>
        <View style={{ flex: 1, paddingRight: 15 }}>
          <View style={styles.commentHeaderContainer}>
            <Text maxFontSizeMultiplier={1} style={styles.name}>
              {comment.user['display_name']}
            </Text>
            <View style={{ marginRight: -10 }}>
              <Moderate
                id={comment.id}
                appColor={appColor}
                onEdit={this.props.onEdit}
                onDelete={this.props.onDelete}
              />
            </View>
          </View>
          <Text maxFontSizeMultiplier={1} style={styles.comment}>
            {comment.comment}
          </Text>
          <Text maxFontSizeMultiplier={1} style={styles.timeStamp}>
            {this.lastPostTime}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={this.toggleLike}
              style={{ padding: 5, marginLeft: -5 }}
            >
              {(isLiked ? likeOn : like)({
                height: 20,
                width: 20,
                fill: appColor
              })}
            </TouchableOpacity>
            {likeCount > 0 && (
              <TouchableOpacity
                testID='showLikesBtn'
                style={styles.likesNoContainer}
              >
                <Text
                  maxFontSizeMultiplier={1}
                  style={{ ...styles.likesNoText, color: appColor }}
                >
                  {`${likeCount} LIKE${likeCount === 1 ? '' : 'S'}`}
                </Text>
              </TouchableOpacity>
            )}
            {!!onReplies && (
              <TouchableOpacity
                testID='replyBtn'
                onPress={onReplies}
                style={{ padding: 5 }}
              >
                {replies({ height: 20, width: 20, fill: appColor })}
              </TouchableOpacity>
            )}
          </View>
          {!!onReplies && !!comment.replies?.length && (
            <Text style={styles.viewReplies} onPress={onReplies}>
              VIEW {comment.replies.length} REPL
              {comment.replies.length === 1 ? 'Y' : 'IES'}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

let setStyles = isDark =>
  StyleSheet.create({
    commentHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    xp: {
      fontSize: 10,
      fontFamily: 'RobotoCondensed-Bold',
      alignSelf: 'center',
      color: '#445F74'
    },
    name: {
      fontSize: 16,
      fontFamily: 'OpenSans-Bold',
      color: isDark ? '#FFFFFF' : '#00101D'
    },
    comment: {
      fontSize: 14,
      fontFamily: 'OpenSans',
      color: isDark ? '#FFFFFF' : '#00101D'
    },
    timeStamp: {
      fontSize: 11,
      paddingVertical: 5,
      fontFamily: 'OpenSans',
      color: '#445F74'
    },
    likesNoContainer: {
      padding: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      backgroundColor: isDark ? '#001f38' : '#97AABE'
    },
    likesNoText: {
      fontSize: 10,
      fontFamily: 'OpenSans'
    },
    viewReplies: {
      fontSize: 11,
      paddingVertical: 5,
      fontFamily: 'OpenSans',
      color: '#445F74',
      fontWeight: '600'
    }
  });
