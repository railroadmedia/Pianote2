/**
 * PROPS: post, onEdit, onReplies, onDelete, appColor, isDark
 * post: post to be displayed
 * onEdit(): simple navigation to 'Edit' page
 * onDelete(): callback after delete called (for refreshing posts)
 * onReplies(): simple navigation to 'Replies' page
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import AccessLevelAvatar from './AccessLevelAvatar';
import HTMLRenderer from './HTMLRenderer';
import { like, likeOn } from '../assets/svgs';
import { likePost, disLikePost, connection } from '../services/forum.service';

let styles;
let menusToBeClosed = [];

export function closeMenu() {
  menusToBeClosed.map(mtbc => mtbc());
  menusToBeClosed = [];
}

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    const { post, isDark, appColor, loggesInUserId } = props;
    this.state = {
      isLiked: post.is_liked_by_viewer,
      likeCount: post.like_count,
      showMenu: false,
      showReportModal: false
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

  renderMenu = () => (
    <View style={styles.menuContainer}>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItemBtn}
          onPress={() => this.setState({ showReportModal: true })}
        >
          <Text style={[styles.menuItem, styles.borderRight]}>Report</Text>
        </TouchableOpacity>
        {this.props.loggesInUserId === this.props.post.author_id && (
          <TouchableOpacity
            style={styles.menuItemBtn}
            onPress={this.props.onEdit}
          >
            <Text style={[styles.menuItem, styles.borderRight]}>Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.menuItemBtn}
          onPress={this.props.onMultiQuote}
        >
          <Text style={styles.menuItem}>MultiQuote</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.triangle} />
    </View>
  );

  render() {
    let { isLiked, likeCount, showMenu } = this.state;
    let { post, appColor, index, isDark, signShown } = this.props;

    return (
      <>
        {showMenu && this.renderMenu()}
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.container,
            showMenu
              ? { backgroundColor: '#002039' }
              : { backgroundColor: '#081825' }
          ]}
          onPress={() => {
            closeMenu();
            menusToBeClosed.push(() => this.setState({ showMenu: false }));
            this.setState({ showMenu: true });
          }}
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
                  {post.author.total_posts} Posts - {post.author.xp_rank} -
                  Level {post.author.level_rank}
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
            {likeCount > 0 && (
              <Text style={styles.likesNoText}>{likeCount}</Text>
            )}
            <TouchableOpacity>
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
      </>
    );
  }
}

let setStyles = (isDark, appColor) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 15,
      marginBottom: 10,
      position: 'relative'
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
    },
    menuContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#00101D' : '#F7F9FC',
      position: 'absolute',
      top: -35,
      alignSelf: 'center'
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopWidth: 10,
      borderRightWidth: 5,
      borderBottomWidth: 0,
      borderLeftWidth: 5,
      borderTopColor: appColor,
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent'
    },
    menu: {
      backgroundColor: appColor,
      flexDirection: 'row'
    },
    menuItemBtn: {
      width: 70
    },
    menuItem: {
      color: '#FFFFFF',
      fontFamily: 'OpenSans',
      fontSize: 10,
      flex: 1,
      paddingVertical: 5,
      textAlign: 'center'
    },
    modalContainer: {
      flex: 1,
      height: '100%',
      width: '100%',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'red',
      alignItems: 'center'
    },
    borderRight: {
      borderRightColor: '#00101D',
      borderRightWidth: 1
    }
  });
