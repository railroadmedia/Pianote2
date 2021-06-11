import React from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from '../assets/icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NetworkContext } from '../context/NetworkProvider';

const onTablet = global.onTablet;
let localStyles;

export default class Replies extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    localStyles = setStyles(colors, sizing);
    this.state = {
      reply: '',
      isLoading: false,
      showReplies: false,
      showMakeReply: false
    };
  }

  lastPostTime(date) {
    let dif = new Date() - new Date(date);
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

  toggle = callback =>
    this.setState(
      ({ showReplies }) => ({ showReplies: !showReplies }),
      () => setTimeout(callback || (() => {}), 0)
    );

  mapReplies = () => {
    return this.props.comment.replies?.map((reply, index) => {
      return (
        <View key={index} style={localStyles.allRepliesContainer}>
          <View style={localStyles.imageContainer}>
            <FastImage
              style={localStyles.replierImage}
              source={{ uri: reply.user['fields.profile_picture_image_url'] }}
              resizeMode={FastImage.resizeMode.stretch}
            />
            <Text style={localStyles.xp}>{reply.user.xp} XP</Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={localStyles.commentText}>{reply.comment.replace(/<[^>]*>?/gm, '')}</Text>
            <Text style={localStyles.userTags}>
              {reply.user['display_name']} | {reply.user.rank} |{' '}
              {this.lastPostTime(reply.created_on)}
            </Text>
            <View
              style={{
                paddingBottom: 15,
                paddingTop: 5
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', marginRight: 15 }}>
                  <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => {
                      if (!this.context.isConnected)
                        return this.context.showNoConnectionAlert();
                      this.props.toggleReplyLike(
                        reply.id,
                        reply.is_liked ? 'dislikeComment' : 'likeComment'
                      );
                    }}
                  >
                    <Icon.AntDesign
                      name={reply.is_liked ? 'like1' : 'like2'}
                      size={sizing.infoButtonSize}
                      color={colors.pianoteRed}
                    />
                  </TouchableOpacity>
                  {reply.like_count > 0 && (
                    <View style={localStyles.likeCountContainer}>
                      <Text style={localStyles.likeNumText}>
                        {reply.like_count}{' '}
                        {reply.like_count === 1 ? 'LIKE' : 'LIKES'}
                      </Text>
                    </View>
                  )}
                </View>

                {this.props.me.userId === reply.user_id && (
                  <TouchableOpacity
                    onPress={() => {
                      if (!this.context.isConnected)
                        return this.context.showNoConnectionAlert();
                      this.props.deleteReply(reply.id);
                    }}
                  >
                    <Icon.AntDesign
                      name={'delete'}
                      size={sizing.infoButtonSize}
                      color={colors.pianoteRed}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      );
    });
  };

  changeXP = num => {
    if (num !== '') {
      num = Number(num);
      return num < 10000 ? `${num} XP` : `${(num / 1000).toFixed(1)}k XP`;
    }
  };

  sendReply = reply => {
    if (!reply) return this.setState({ showMakeReply: false });
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState({ showMakeReply: false, isLoading: true, reply: '' });
    this.props.sendReply(reply).then(() => this.setState({ isLoading: false }));
  };

  render = () => {
    let { me, comment, comment: { user } = {} } = this.props;
    return this.state.showReplies ? (
      <>
        <View style={localStyles.componentContainer}>
          {comment ? (
            <>
              <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior={'never'}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ width: '100%', zIndex: 5 }}>
                    <View style={localStyles.commentHeader}>
                      <Text style={localStyles.replyText}>REPLIES</Text>
                      <TouchableOpacity onPress={this.props.close}>
                        <Icon.Entypo
                          size={onTablet ? 27.5 : 22.5}
                          name={'cross'}
                          color={'#c2c2c2'}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={localStyles.commentContainer}>
                      <View style={localStyles.imageContainer}>
                        <FastImage
                          style={localStyles.replierImage}
                          source={{
                            uri: user['fields.profile_picture_image_url']
                          }}
                          resizeMode={FastImage.resizeMode.stretch}
                        />
                        <Text style={localStyles.xp}>
                          {this.changeXP(user.xp)}
                        </Text>
                      </View>

                      <View style={{ flex: 1, paddingLeft: 10 }}>
                        <Text style={localStyles.commentText}>
                          {comment.comment}
                        </Text>
                        <Text style={localStyles.userTags}>
                          {user.display_name} | {user.rank} |{' '}
                          {this.lastPostTime(comment.created_on)}
                        </Text>
                        <View
                          style={{
                            paddingBottom: 15,
                            paddingTop: 5
                          }}
                        >
                          <View style={{ flexDirection: 'row' }}>
                            <View
                              style={{ flexDirection: 'row', marginRight: 15 }}
                            >
                              <TouchableOpacity
                                style={{ marginRight: 10 }}
                                onPress={() => {
                                  if (!this.context.isConnected)
                                    return this.context.showNoConnectionAlert();
                                  this.props.toggleCommentLike(
                                    comment.id,
                                    comment.is_liked
                                      ? 'dislikeComment'
                                      : 'likeComment'
                                  );
                                }}
                              >
                                <Icon.AntDesign
                                  name={comment.is_liked ? 'like1' : 'like2'}
                                  size={sizing.infoButtonSize}
                                  color={colors.pianoteRed}
                                />
                              </TouchableOpacity>
                              {comment.like_count > 0 && (
                                <View style={localStyles.likeCountContainer}>
                                  <Text style={localStyles.likeNumText}>
                                    {comment.like_count}{' '}
                                    {comment.like_count === 1
                                      ? 'LIKE'
                                      : 'LIKES'}
                                  </Text>
                                </View>
                              )}
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                              <Icon.MaterialCommunityIcons
                                name={'comment-text-outline'}
                                size={sizing.infoButtonSize}
                                color={colors.pianoteRed}
                                style={{ marginRight: 10 }}
                              />
                              {comment.replies && comment.replies.length > 0 && (
                                <View style={localStyles.likeCountContainer}>
                                  <Text
                                    style={[
                                      localStyles.likeCount,
                                      { fontSize: sizing.descriptionText }
                                    ]}
                                  >
                                    {comment.replies.length}{' '}
                                    {comment.replies.length === 1
                                      ? 'REPLY'
                                      : 'REPLIES'}
                                  </Text>
                                </View>
                              )}
                            </View>
                            {me.userId === comment.user_id && (
                              <TouchableOpacity
                                style={{ marginLeft: 15 }}
                                onPress={() => {
                                  if (!this.context.isConnected)
                                    return this.context.showNoConnectionAlert();
                                  this.props.deleteComment(comment.id);
                                }}
                              >
                                <Icon.AntDesign
                                  name={'delete'}
                                  size={sizing.infoButtonSize}
                                  color={colors.pianoteRed}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                    {!this.state.showMakeReply && (
                      <View style={localStyles.addComment}>
                        <View style={{ flexDirection: 'row' }}>
                          <FastImage
                            style={localStyles.profileImage}
                            source={{
                              uri:
                                me.profileImage ||
                                'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => this.setState({ showMakeReply: true })}
                          style={localStyles.makeReplyContainer}
                        >
                          <Text style={localStyles.addReplyText}>
                            Add a reply...
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  {this.state.isLoading && (
                    <ActivityIndicator
                      size='small'
                      style={{ padding: 10 }}
                      color={colors.secondBackground}
                    />
                  )}
                  {this.mapReplies()}
                </View>
              </KeyboardAwareScrollView>
              <Modal
                visible={this.state.showMakeReply}
                transparent={true}
                onBackButtonPress={() =>
                  this.setState({ showMakeReply: false })
                }
              >
                <TouchableOpacity
                  activeOpacity={1}
                  style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.5)' }}
                  onPress={() =>
                    this.setState({ showMakeReply: false, reply: '' })
                  }
                >
                  <KeyboardAvoidingView
                    behavior={`${isiOS ? 'padding' : ''}`}
                    style={{ flex: 1, justifyContent: 'flex-end' }}
                  >
                    <View style={localStyles.replierContainer}>
                      <FastImage
                        style={[localStyles.profileImage]}
                        source={{
                          uri:
                            me.profileImage ||
                            'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                        }}
                        resizeMode={FastImage.resizeMode.stretch}
                      />
                      <TextInput
                        multiline={true}
                        autoFocus={true}
                        placeholder={'Add a comment'}
                        placeholderTextColor={colors.secondBackground}
                        onChangeText={reply => this.setState({ reply })}
                        style={localStyles.textInput}
                      />
                      <TouchableOpacity
                        onPress={() => this.sendReply(this.state.reply)}
                        style={{
                          marginBottom: !isiOS ? 10 : 0
                        }}
                      >
                        <Icon.Ionicons
                          name={'md-send'}
                          size={onTablet ? 25 : 17.5}
                          color={colors.pianoteRed}
                        />
                      </TouchableOpacity>
                    </View>
                  </KeyboardAvoidingView>
                </TouchableOpacity>
              </Modal>
            </>
          ) : (
            <ActivityIndicator size='large' color={colors.secondBackground} />
          )}
        </View>
      </>
    ) : (
      <></>
    );
  };
}

const setStyles = (appColor, size) =>
  StyleSheet.create({
    profileImage: {
      height: onTablet ? 60 : 40,
      width: onTablet ? 60 : 40,
      paddingVertical: 10,
      borderRadius: 100,
      marginRight: 10
    },
    commentContainer: {
      backgroundColor: appColor.mainBackground,
      flex: 1,
      flexDirection: 'row',
      padding: 10
    },
    comment: {
      paddingTop: 10,
      fontSize: onTablet ? 16 : 12,
      fontFamily: 'OpenSans-Regular',
      color: 'white'
    },
    likeCountContainer: {
      borderRadius: 40,
      backgroundColor: appColor.notificationColor,
      alignItems: 'center',
      justifyContent: 'center'
    },
    likeCount: {
      fontFamily: 'OpenSans-Regular',
      fontSize: onTablet ? 16 : 12,
      color: appColor.pianoteRed,
      paddingHorizontal: 10
    },
    componentContainer: {
      zIndex: 2,
      width: '100%',
      height: '100%',
      position: 'absolute',
      justifyContent: 'center',
      backgroundColor: appColor.mainBackground
    },
    commentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      marginTop: 10
    },
    replyText: {
      fontSize: onTablet ? 16 : 12,
      marginVertical: 5,
      textAlign: 'left',
      fontFamily: 'RobotoCondensed-Bold',
      color: appColor.secondBackground
    },
    replierImage: {
      height: onTablet ? 60 : 40,
      width: onTablet ? 60 : 40,
      borderRadius: 100,
      marginTop: 10
    },
    commentText: {
      fontFamily: 'OpenSans-Regular',
      fontSize: size.descriptionText,
      color: 'white',
      paddingTop: 10
    },
    addComment: {
      width: '100%',
      flexDirection: 'row',
      paddingLeft: 10,
      borderTopWidth: 0.5,
      borderBottomWidth: 0.5,
      borderBottomColor: appColor.secondBackground,
      borderTopColor: appColor.secondBackground,
      alignItems: 'center'
    },
    makeReplyContainer: {
      width: '80%',
      paddingVertical: 5,
      justifyContent: 'center'
    },
    addReplyText: {
      textAlign: 'left',
      fontFamily: 'OpenSans-Regular',
      fontSize: onTablet ? 16 : 12,
      color: 'white',
      paddingVertical: 20
    },
    replierContainer: {
      padding: 10,
      alignItems: 'center',
      flexDirection: 'row',
      borderTopWidth: 0.5,
      backgroundColor: appColor.mainBackground,
      borderTopColor: appColor.secondBackground
    },
    textInput: {
      flex: 1,
      fontSize: onTablet ? 16 : 12,
      color: appColor.secondBackground,
      fontFamily: 'OpenSans-Regular',
      paddingVertical: 10,
      backgroundColor: appColor.mainBackground
    },
    imageContainer: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingBottom: 10
    },
    xp: {
      fontFamily: 'OpenSans-Bold',
      fontSize: size.descriptionText,
      marginTop: 5,
      color: appColor.pianoteGrey
    },
    userTags: {
      fontFamily: 'OpenSans-Regular',
      fontSize: size.descriptionText,
      color: appColor.secondBackground,
      paddingTop: 5,
      paddingBottom: 10
    },
    likeNumText: {
      fontFamily: 'OpenSans-Regular',
      fontSize: size.descriptionText,
      color: appColor.pianoteRed,
      paddingHorizontal: 5
    },
    allRepliesContainer: {
      backgroundColor: appColor.mainBackground,
      borderTopColor: appColor.secondBackground,
      flex: 1,
      borderTopWidth: 0.25,
      flexDirection: 'row',
      paddingTop: 10,
      paddingHorizontal: 10
    }
  });
