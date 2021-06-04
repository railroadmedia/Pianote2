/**
 * PROPS: post, onDelete, appColor, isDark
 * post: post to be displayed
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  Pressable
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { connect } from 'react-redux';

import AccessLevelAvatar from './AccessLevelAvatar';
import HTMLRenderer from './HTMLRenderer';

import { like, likeOn } from '../assets/svgs';

import {
  likePost,
  disLikePost,
  connection,
  reportPost
} from '../services/forum.service';

let styles;
let multiQuotes = [];
let openedMenus = [];
export const closeMenus = menu => {
  openedMenus.map(om => om.setState({ selected: false }));
  openedMenus = [];
  if (menu?.state?.selected) openedMenus.push(menu);
};
class Post extends React.Component {
  constructor(props) {
    super(props);
    const { post, isDark, appColor } = props;
    this.state = {
      isLiked: post.is_liked_by_viewer,
      likeCount: post.like_count,
      selected: false,
      menuTop: 0,
      reportModalVisible: false
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

  toggleMenu = () =>
    this.setState(
      ({ selected }) => ({ selected: !selected }),
      () => closeMenus(this)
    );

  report = () => this.setState({ reportModalVisible: true }, closeMenus);

  edit = () => {
    closeMenus();
    this.props.navigation.navigate('CRUD', {
      type: 'post',
      action: 'edit',
      postId: this.props.post.id
    });
  };

  multiQuote = () => {
    if (openedMenus.length) closeMenus();
    this.setState(({ selected }) => {
      if (selected)
        multiQuotes.splice(
          multiQuotes.findIndex(mq => mq.id === this.props.post.id),
          1
        );
      else multiQuotes.push(this.props.post);
      return { selected: !selected };
    }, this.props.onMultiQuote);
  };

  reply = () => {
    closeMenus();
    this.props.navigation.navigate('CRUD', {
      type: 'post',
      action: 'create',
      threadId: this.props.post.thread_id,
      posts: [this.props.post]
    });
  };

  render() {
    let {
      isLiked,
      likeCount,
      selected,
      menuTop,
      reportModalVisible
    } = this.state;
    let { post, appColor, index, isDark, signShown } = this.props;

    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            ...styles.container,
            backgroundColor: selected ? '#002039' : '#081825'
          }}
          onPress={multiQuotes.length ? this.multiQuote : this.toggleMenu}
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
              {post.published_on_formatted} #{index}
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
            <TouchableOpacity onPress={this.reply}>
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
        {selected && !multiQuotes.length && (
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              alignItems: 'center',
              top: menuTop,
              opacity: menuTop ? 1 : 0
            }}
            onLayout={({
              nativeEvent: {
                layout: { height }
              }
            }) => !menuTop && this.setState({ menuTop: -height })}
          >
            <View style={styles.selectedMenuContainer}>
              {['report', 'edit', 'multiQuote'].map((action, i) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={i}
                  onPress={this[action]}
                  style={{
                    padding: 10,
                    paddingHorizontal: 15,
                    backgroundColor: appColor,
                    borderLeftWidth: i ? 0.5 : 0
                  }}
                >
                  <Text style={styles.selectedMenuActionText}>{action}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.triangle} />
          </View>
        )}
        <Modal
          animationType={'slide'}
          onRequestClose={() => this.setState({ reportModalVisible: false })}
          supportedOrientations={['portrait', 'landscape']}
          transparent={true}
          visible={reportModalVisible /*|| post.id === 282358*/}
        >
          <Pressable
            style={styles.reportModalBackground}
            onPress={() => this.setState({ reportModalVisible: false })}
          >
            <View style={styles.reportModalContainer}>
              <Text style={styles.reportTitle}>Report Post</Text>
              <Text style={styles.reportMessage}>
                What's the reason you're reporting this post?
              </Text>
              <TextInput
                style={styles.reportInput}
                placeholderTextColor={isDark ? '#445F74' : '#00101D'}
                placeholder='Report'
                onChangeText={text => (this.text = text)}
              />
              <View style={styles.reportBtnsContainer}>
                <Pressable
                  style={{
                    flex: 1,
                    borderRightColor: '#545458A6',
                    borderRightWidth: 1
                  }}
                  onPress={() => this.setState({ reportModalVisible: false })}
                >
                  <Text style={styles.reportBtnText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() =>
                    this.setState({ reportModalVisible: false }, () =>
                      reportPost(post.id)
                    )
                  }
                >
                  <Text style={styles.reportBtnText}>Ok</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      </>
    );
  }
}

let setStyles = (isDark, appColor) =>
  StyleSheet.create({
    container: {
      padding: 15,
      marginBottom: 20
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10
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
    selectedMenuContainer: {
      flexDirection: 'row',
      borderRadius: 5,
      overflow: 'hidden'
    },
    selectedMenuActionText: {
      textTransform: 'capitalize',
      color: 'white',
      fontFamily: 'OpenSans-Bold'
    },
    triangle: {
      width: 0,
      height: 0,
      borderTopWidth: 5,
      borderLeftWidth: 5,
      borderRightWidth: 5,
      borderColor: 'transparent',
      borderTopColor: appColor
    },
    reportModalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,.5)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    reportModalContainer: {
      backgroundColor: isDark ? '#002039' : '#E1E6EB',
      borderRadius: 10,
      width: '80%',
      maxWidth: 300
    },
    reportTitle: {
      padding: 15,
      paddingBottom: 0,
      fontFamily: 'OpenSans-Bold',
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#000000',
      textAlign: 'center'
    },
    reportMessage: {
      padding: 15,
      fontFamily: 'OpenSans',
      fontSize: 12,
      color: isDark ? '#FFFFFF' : '#000000',
      textAlign: 'center'
    },
    reportInput: {
      padding: 5,
      margin: 15,
      marginTop: 0,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
      borderRadius: 5,
      color: isDark ? '#FFFFFF' : '#000000'
    },
    reportBtnsContainer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#545458A6'
    },
    reportBtnText: {
      fontFamily: 'OpenSans-Bold',
      fontSize: 12,
      color: isDark ? '#FFFFFF' : '#000000',
      textAlign: 'center',
      paddingVertical: 10
    }
  });
const mapStateToProps = ({ threads: { signShown, posts } }, { id }) => ({
  signShown,
  post: posts[id]
});
let NavigationWrapper = props => (
  <Post {...props} navigation={useNavigation()} />
);
NavigationWrapper.multiQuotes = multiQuotes;
export default connect(mapStateToProps)(NavigationWrapper);
