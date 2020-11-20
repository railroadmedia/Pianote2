/**
 * Replies
 */
import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import Loading from 'Pianote2/src/components/Loading';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import commentsService from '../services/comments.service';
import { NetworkContext } from '../context/NetworkProvider';

class Replies extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      replies: props.parentComment.replies, // video's comments
      isLoading: false,
      profileImage: '',
      parentComment: props.parentComment,
      showMakeComment: false,
      reply: '',
      userId: null
    };
  }

  UNSAFE_componentWillReceiveProps = async props => {
    if (props.reply !== this.state.reply) {
      this.setState({ comment: props.reply });
    }
    if (props.makeReply && !this.state.isLoading) {
      this.makeReply();
    }
  };

  componentDidMount = async () => {
    // get profile image
    let profileImage = await AsyncStorage.getItem('profileURI');
    let userId = JSON.parse(await AsyncStorage.getItem('userId'));
    this.setState({ profileImage, userId });
  };

  makeReply = async () => {
    this.setState({ isLoading: true }); // ensure same comment cant be sent twice
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    if (this.state.comment.length > 0) {
      let encodedReply = encodeURIComponent(this.state.comment);

      let res = await commentsService.addReplyToComment(
        encodedReply,
        this.state.parentComment.id
      );

      let replies = [...this.state.replies];
      let parentComment = { ...this.state.parentComment };
      replies.push(res.data[0]);
      parentComment.replies.push(res.data[0]);
      this.props.onAddReply(this.state.parentComment.id);
      this.setState({
        replies,
        comment: '',
        parentComment
      });
    }
    this.props.replySubmitted(); // tell parent reply has been made
    this.props.hideMakeReply(); // dismiss keyboard, clear text input, hide make modal
    this.setState({ isLoading: false });
  };

  deleteReply = id => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let replies = [...this.state.replies];
    let parentComment = { ...this.state.parentComment };
    parentComment.replies = parentComment.replies.filter(c => c.id !== id);
    this.setState({
      replies: replies.filter(c => c.id !== id),
      parentComment
    });
    commentsService.deleteComment(id);
  };

  mapReplies() {
    return this.state.replies.map((reply, index) => {
      return (
        <View
          key={index}
          style={{
            paddingTop: fullHeight * 0.01,
            paddingBottom: fullHeight * 0.01,
            paddingLeft: fullWidth * 0.05,
            paddingRight: fullWidth * 0.03,
            minHeight: 30 * factorVertical,
            flexDirection: 'row'
          }}
        >
          <View>
            <View style={{ alignItems: 'center' }}>
              <FastImage
                style={{
                  height: 40 * factorHorizontal,
                  width: 40 * factorHorizontal,
                  borderRadius: 100
                }}
                source={{
                  uri: reply.user['fields.profile_picture_image_url']
                }}
                resizeMode={FastImage.resizeMode.stretch}
              />
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 10 * factorRatio,
                  marginTop: 2 * factorRatio,
                  fontWeight: Platform.OS == 'ios' ? '700' : 'bold',
                  color: 'grey'
                }}
              >
                {reply.user.display_name}
              </Text>
            </View>
            <View style={{ flex: 1 }} />
          </View>
          <View
            style={{
              flex: 1,
              paddingLeft: 12.5 * factorHorizontal
            }}
          >
            <View style={{ height: 3 * factorVertical }} />
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 13 * factorRatio,
                color: 'white'
              }}
            >
              {reply.comment}
            </Text>
            <View style={{ height: 7.5 * factorVertical }} />
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 11 * factorRatio,
                color: 'grey'
              }}
            >
              {reply.user['display_name']} | {reply.user.rank} |{' '}
              {moment.utc(reply.created_on).local().fromNow()}
            </Text>
            <View
              style={{
                height: 50 * factorVertical
              }}
            >
              <View style={{ flex: 1 }} />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.likeOrDislikeReply(reply.id);
                    }}
                  >
                    <AntIcon
                      name={reply.is_liked ? 'like1' : 'like2'}
                      size={20 * factorRatio}
                      color={colors.pianoteRed}
                    />
                  </TouchableOpacity>
                  <View style={{ width: 10 * factorHorizontal }} />
                  {reply.like_count > 0 && (
                    <View>
                      <View style={{ flex: 1 }} />
                      <View
                        style={[
                          styles.centerContent,
                          {
                            borderRadius: 40,
                            paddingLeft: 8 * factorHorizontal,
                            paddingRight: 8 * factorHorizontal,
                            paddingTop: 4 * factorVertical,
                            paddingBottom: 4 * factorVertical,
                            backgroundColor: colors.notificationColor
                          }
                        ]}
                      >
                        <Text
                          style={{
                            fontFamily: 'OpenSans-Regular',
                            fontSize: 9.5 * factorRatio,
                            color: colors.pianoteRed
                          }}
                        >
                          {reply.like_count}{' '}
                          {reply.like_count === 1 ? 'LIKE' : 'LIKES'}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }} />
                    </View>
                  )}
                </View>
                <View style={{ width: 20 * factorHorizontal }} />
                {this.state.userId === reply.user_id && (
                  <TouchableOpacity onPress={() => this.deleteReply(reply.id)}>
                    <AntIcon
                      name={'delete'}
                      size={20 * factorRatio}
                      color={colors.pianoteRed}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      );
    });
  }

  changeXP = num => {
    if (num !== '') {
      num = Number(num);
      if (num < 10000) {
        num = num.toString();
        return num + ' XP';
      } else {
        num = (num / 1000).toFixed(1).toString();
        num = num + 'k';
        return num + ' XP';
      }
    }
  };

  likeOrDislikeParentComment = () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let parentComment = { ...this.state.parentComment };
    if (parentComment.is_liked) {
      parentComment.like_count--;
      parentComment.is_liked = false;
      commentsService.dislikeComment(parentComment.id);
    } else {
      parentComment.like_count++;
      parentComment.is_liked = true;
      commentsService.likeComment(parentComment.id);
    }
    this.props.onLikeOrDisikeParentComment(this.state.parentComment.id);
    this.setState({ parentComment });
  };

  likeOrDislikeReply = id => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let replies = [...this.state.replies];
    let reply = replies.find(f => f.id === id);
    if (reply) {
      if (reply.is_liked) {
        reply.like_count--;
        reply.is_liked = false;
        commentsService.dislikeComment(id);
      } else {
        reply.like_count++;
        reply.is_liked = true;
        commentsService.likeComment(id);
      }
      this.setState({ replies });
    }
  };

  showMakeReply = async () => {
    this.setState({ showMakeComment: true });
  };

  render = () => {
    return (
      <View
        key={'componentContainer'}
        style={[
          styles.centerContent,
          {
            flex: 1,
            zIndex: 10
          }
        ]}
      >
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
          style={{
            flex: 1,
            backgroundColor: colors.mainBackground
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              key={'commentCount'}
              style={{
                width: fullWidth,
                zIndex: 5
              }}
            >
              <View style={{ height: fullHeight * 0.025 }} />
              <View
                key={'commentHeader'}
                style={{
                  width: fullWidth,
                  flexDirection: 'row',
                  paddingLeft: fullWidth * 0.05,
                  paddingRight: fullWidth * 0.02
                }}
              >
                <View>
                  <View style={{ flex: 1 }} />
                  <Text
                    style={{
                      fontSize: 18 * factorRatio,
                      marginBottom: 5 * factorVertical,
                      textAlign: 'left',
                      fontFamily: 'RobotoCondensed-Bold',
                      color: colors.secondBackground
                    }}
                  >
                    REPLIES
                  </Text>
                  <View style={{ flex: 1 }} />
                </View>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  onPress={() => {
                    this.props.hideReplies();
                  }}
                >
                  <EntypoIcon
                    size={27.5 * factorRatio}
                    name={'cross'}
                    color={'#c2c2c2'}
                  />
                </TouchableOpacity>
                <View style={{ flex: 0.07 }} />
              </View>
              <View style={{ flex: 1.25 }} />
              <View
                key={'originalReply'}
                style={{
                  paddingTop: fullHeight * 0.02,
                  paddingLeft: fullWidth * 0.05,
                  paddingRight: fullWidth * 0.03,
                  minHeight: 30 * factorVertical,
                  flexDirection: 'row'
                }}
              >
                <View>
                  <View style={{ alignItems: 'center' }}>
                    <FastImage
                      style={{
                        height: 40 * factorHorizontal,
                        width: 40 * factorHorizontal,
                        borderRadius: 100
                      }}
                      source={{
                        uri: this.state.parentComment.user[
                          'fields.profile_picture_image_url'
                        ]
                      }}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: 10 * factorRatio,
                        marginTop: 2 * factorRatio,
                        fontWeight: Platform.OS == 'ios' ? '700' : 'bold',
                        color: 'grey'
                      }}
                    >
                      {this.changeXP(this.state.parentComment.user.xp)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingLeft: 12.5 * factorHorizontal
                  }}
                >
                  <View style={{ height: 3 * factorVertical }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 13 * factorRatio,
                      color: 'white'
                    }}
                  >
                    {this.state.parentComment.comment}
                  </Text>
                  <View style={{ height: 7.5 * factorVertical }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 11 * factorRatio,
                      color: colors.secondBackground
                    }}
                  >
                    {this.state.parentComment.user.display_name} |{' '}
                    {this.state.parentComment.user.rank} |{' '}
                    {moment
                      .utc(this.state.parentComment.created_on)
                      .local()
                      .fromNow()}
                  </Text>
                  <View style={{ height: 50 * factorVertical }}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.likeOrDislikeParentComment();
                          }}
                        >
                          <AntIcon
                            name={
                              this.state.parentComment.is_liked
                                ? 'like1'
                                : 'like2'
                            }
                            size={20 * factorRatio}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                        <View
                          style={{
                            width: 10 * factorHorizontal
                          }}
                        />
                        {this.state.parentComment.like_count > 0 && (
                          <View>
                            <View style={{ flex: 1 }} />
                            <View
                              style={[
                                styles.centerContent,
                                {
                                  borderRadius: 40,
                                  paddingLeft: 8 * factorHorizontal,
                                  paddingRight: 8 * factorHorizontal,
                                  paddingTop: 4 * factorVertical,
                                  paddingBottom: 4 * factorVertical,
                                  backgroundColor: colors.notificationColor
                                }
                              ]}
                            >
                              <Text
                                style={{
                                  fontFamily: 'OpenSans-Regular',
                                  fontSize: 9.5 * factorRatio,
                                  color: colors.pianoteRed
                                }}
                              >
                                {this.state.parentComment.like_count}{' '}
                                {this.state.parentComment.like_count === 1
                                  ? 'LIKE'
                                  : 'LIKES'}
                              </Text>
                            </View>
                            <View style={{ flex: 1 }} />
                          </View>
                        )}
                      </View>
                      <View
                        style={{
                          width: 20 * factorHorizontal
                        }}
                      />
                      <View style={{ flexDirection: 'row' }}>
                        <MaterialIcon
                          name={'comment-text-outline'}
                          size={20 * factorRatio}
                          color={colors.pianoteRed}
                        />
                        <View
                          style={{
                            width: 10 * factorHorizontal
                          }}
                        />
                        {this.state.parentComment.replies.length > 0 && (
                          <View>
                            <View style={{ flex: 1 }} />
                            <View
                              style={[
                                styles.centerContent,
                                {
                                  borderRadius: 40,
                                  paddingLeft: 8 * factorHorizontal,
                                  paddingRight: 8 * factorHorizontal,
                                  paddingTop: 4 * factorVertical,
                                  paddingBottom: 4 * factorVertical,
                                  backgroundColor: colors.notificationColor
                                }
                              ]}
                            >
                              <Text
                                style={{
                                  fontFamily: 'OpenSans-Regular',
                                  fontSize: 9.5 * factorRatio,
                                  color: colors.pianoteRed
                                }}
                              >
                                {this.state.parentComment.replies.length}{' '}
                                {this.state.parentComment.replies.length == 1
                                  ? 'REPLY'
                                  : 'REPLIES'}
                              </Text>
                            </View>
                            <View style={{ flex: 1 }} />
                          </View>
                        )}
                      </View>
                      <View
                        style={{
                          width: 20 * factorHorizontal
                        }}
                      />
                      {this.state.userId ===
                        this.state.parentComment.user_id && (
                        <TouchableOpacity
                          onPress={() =>
                            this.props.onDeleteComment(
                              this.state.parentComment.id
                            )
                          }
                        >
                          <AntIcon
                            name={'delete'}
                            size={20 * factorRatio}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                </View>
              </View>
              <View style={{ height: 10 * factorRatio }} />
              <View
                key={'addComment'}
                style={{
                  width: fullWidth,
                  height: 85 * factorHorizontal,
                  flexDirection: 'row',
                  paddingLeft: fullWidth * 0.05,
                  borderTopWidth: 0.5 * factorRatio,
                  borderBottomWidth: 0.5 * factorRatio,
                  borderBottomColor: colors.secondBackground,
                  borderTopColor: colors.secondBackground
                }}
              >
                <View
                  key={'profileImage'}
                  style={{
                    height: '100%',
                    width: 40 * factorHorizontal
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <FastImage
                    style={{
                      height: 40 * factorHorizontal,
                      width: 40 * factorHorizontal,
                      borderRadius: 100
                    }}
                    source={{
                      uri:
                        this.state.profileImage ||
                        'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                  <View style={{ flex: 1 }} />
                </View>
                <View style={{ width: 12.5 * factorHorizontal }} />
                <TouchableOpacity
                  key={'makeReply'}
                  onPress={() => this.props.showMakeReply()}
                  style={{
                    height: 85 * factorHorizontal,
                    width: fullWidth
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <Text
                    style={{
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 13 * factorRatio,
                      color: 'white',
                      paddingLeft: 10 * factorHorizontal
                    }}
                  >
                    Add a reply...
                  </Text>
                  <View style={{ flex: 1 }} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }} />
            </View>
            <View>{this.mapReplies()}</View>
          </View>
          <View
            style={{
              height: isNotch ? 90 * factorVertical : 60 * factorVertical
            }}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  };
}

export default withNavigation(Replies);
