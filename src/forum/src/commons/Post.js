/**
 * PROPS: post, onEdit, onReplies, onDelete, appColor, isDark
 * post: post to be displayed
 * onEdit(): simple navigation to 'Edit' page
 * onDelete(): callback after delete called (for refreshing posts)
 * onReplies(): simple navigation to 'Replies' page
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';

import AccessLevelAvatar from './AccessLevelAvatar';
import HTMLRenderer from './HTMLRenderer';
import { like, likeOn } from '../assets/svgs';
import { likePost, disLikePost, connection } from '../services/forum.service';

let styles;

class Post extends React.Component {
  constructor(props) {
    super(props);
    const { post, isDark, appColor } = props;
    this.state = {
      isLiked: post.is_liked_by_viewer,
      likeCount: post.like_count
    };
    styles = setStyles(isDark, appColor);
  }

  toggleLike = () => {
    if (!connection(true)) return;
    let { id } = this.props.post;
    this.setState(({ isLiked, likeCount }) => {
      if (isLiked) {
        likeCount--;
        disLikePost(id);
      } else {
        likeCount++;
        likePost(id);
      }
      return { likeCount, isLiked: !isLiked };
    });
  };

  render() {
    let { isLiked, likeCount } = this.state;
    let {
      post,
      appColor,
      index,
      isDark,
      signShown,
      onReply,
      onShowMenu
    } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={onShowMenu}
      >
        <View style={styles.header}>
          <View style={styles.userDetails}>
            <AccessLevelAvatar
              uri={post.author.avatar_url}
              height={45}
              appColor={appColor}
              tagHeight={4}
              accessLevelName={post.author.access_level}
            />
            <View style={{ marginLeft: 5 }}>
              <Text style={styles.name}>{post.author.display_name}</Text>
              <Text style={styles.xp}>
                {post.author.total_posts} Posts - {post.author.xp_rank} - Level{' '}
                {post.author.level_rank}
              </Text>
            </View>
          </View>
          <Text style={styles.xp}>
            {new Date(post.published_on).toDateString().substring(4)} #{index}
          </Text>
        </View>
        <HTMLRenderer
          html={post.content}
          customStyle={{ color: isDark ? '#FFFFFF' : '#00101D' }}
        />
        <View style={styles.likeContainer}>
          <TouchableOpacity
            onPress={this.toggleLike}
            style={{ padding: 5, marginLeft: -5 }}
          >
            {(isLiked ? likeOn : like)({
              height: 15,
              width: 15,
              fill: appColor
            })}
          </TouchableOpacity>
          {likeCount > 0 && <Text style={styles.likesNoText}>{likeCount}</Text>}
          <TouchableOpacity onPress={onReply}>
            <Text style={styles.replyText}>REPLY</Text>
          </TouchableOpacity>
        </View>
        {signShown && post.author.signature && (
          <View style={styles.signatureContainer}>
            <HTMLRenderer
              html={post.author.signature}
              customStyle={styles.signature}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

let setStyles = (isDark, appColor) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 15
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    userDetails: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    xp: {
      fontSize: 12,
      fontFamily: 'OpenSans',
      alignSelf: 'center',
      color: isDark ? '#445F74' : '#00101D'
    },
    name: {
      fontSize: 14,
      fontFamily: 'OpenSans-Bold',
      color: isDark ? '#FFFFFF' : '#00101D'
    },
    post: {
      fontSize: 14,
      fontFamily: 'OpenSans',
      color: isDark ? '#FFFFFF' : '#00101D'
    },
    likeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10
    },
    likesNoContainer: {
      padding: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      backgroundColor: isDark ? '#001f38' : '#97AABE'
    },
    likesNoText: {
      fontSize: 11,
      fontFamily: 'OpenSans',
      color: appColor,
      marginRight: 5
    },
    replyText: {
      color: isDark ? '#445F74' : '#00101D',
      fontSize: 10,
      fontFamily: 'RobotoCondensed-Bold'
    },
    signatureContainer: {
      borderTopColor: isDark ? '#445F74' : '#00101D',
      borderTopWidth: 1,
      paddingVertical: 5
    },
    signature: {
      color: isDark ? '#445F74' : '#00101D',
      fontFamily: 'OpenSans',
      fontSize: 10
    }
  });
const mapStateToProps = ({ threads: { signShown } }) => ({ signShown });
export default connect(mapStateToProps)(Post);
