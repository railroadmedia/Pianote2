/**
 * Replies
 */
import React from 'react';
import {
  View,
  Text,
  Modal,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';

import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { NetworkContext } from '../context/NetworkProvider';

class Replies extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      reply: '',
      isLoading: false,
      showReplies: false,
      showMakeReply: false
    };
  }

  toggle = callback =>
    this.setState(
      ({ showReplies }) => ({ showReplies: !showReplies }),
      () => setTimeout(callback || (() => {}), 0)
    );

  mapReplies = () =>
    this.props.comment.replies.map((reply, index) => {
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={{ padding: 10, paddingLeft: 0 }}
                    onPress={() => {
                      if (!this.context.isConnected)
                        return this.context.showNoConnectionAlert();
                      this.props.toggleReplyLike(
                        reply.id,
                        reply.is_liked ? 'dislikeComment' : 'likeComment'
                      );
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
                {this.props.me.userId === reply.user_id && (
                  <TouchableOpacity
                    onPress={() => {
                      if (!this.context.isConnected)
                        return this.context.showNoConnectionAlert();
                      this.props.deleteReply(reply.id);
                    }}
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
      );
    });

  changeXP = num => {
    if (num !== '') {
      num = Number(num);
      return num < 10000 ? `${num} XP` : `${(num / 1000).toFixed(1)}k XP`;
    }
  };

  sendReply = reply => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState({ showMakeReply: false, isLoading: true });
    this.props.sendReply(reply).then(() => this.setState({ isLoading: false }));
  };

  render = () => {
    let { me, comment, comment: { user } = {} } = this.props;
    return this.state.showReplies ? (
      <>
        <View
          key={'componentContainer'}
          style={{
            zIndex: 2,
            width: '100%',
            height: '100%',
            position: 'absolute',
            justifyContent: 'center',
            backgroundColor: colors.mainBackground
          }}
        >
          {comment ? (
            <>
              <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior={'never'}
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
                      <TouchableOpacity onPress={this.props.close}>
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
                              uri: user['fields.profile_picture_image_url']
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
                            {this.changeXP(user.xp)}
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
                          {comment.comment}
                        </Text>
                        <View style={{ height: 7.5 * factorVertical }} />
                        <Text
                          style={{
                            fontFamily: 'OpenSans-Regular',
                            fontSize: 11 * factorRatio,
                            color: colors.secondBackground
                          }}
                        >
                          {user.display_name} | {user.rank} |{' '}
                          {moment.utc(comment.created_on).local().fromNow()}
                        </Text>
                        <View style={{ height: 50 * factorVertical }}>
                          <View style={{ flex: 1 }} />
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row' }}>
                              <TouchableOpacity
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
                                <AntIcon
                                  name={comment.is_liked ? 'like1' : 'like2'}
                                  size={20 * factorRatio}
                                  color={colors.pianoteRed}
                                />
                              </TouchableOpacity>
                              <View
                                style={{
                                  width: 10 * factorHorizontal
                                }}
                              />
                              {comment.like_count > 0 && (
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
                                        backgroundColor:
                                          colors.notificationColor
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
                                      {comment.like_count}{' '}
                                      {comment.like_count === 1
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
                              {comment.replies.length > 0 && (
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
                                        backgroundColor:
                                          colors.notificationColor
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
                                      {comment.replies.length}{' '}
                                      {comment.replies.length == 1
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
                            {me.userId === comment.user_id && (
                              <TouchableOpacity
                                onPress={() => {
                                  if (!this.context.isConnected)
                                    return this.context.showNoConnectionAlert();
                                  this.props.deleteComment(comment.id);
                                }}
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
                    {!this.state.showMakeReply && (
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
                                me.profileImage ||
                                'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                          />
                          <View style={{ flex: 1 }} />
                        </View>
                        <View style={{ width: 12.5 * factorHorizontal }} />
                        <TouchableOpacity
                          key={'makeReply'}
                          onPress={() => this.setState({ showMakeReply: true })}
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
                    )}
                    <View style={{ flex: 1 }} />
                  </View>
                  {this.state.isLoading && (
                    <View style={{ padding: 10 }}>
                      <ActivityIndicator
                        size='small'
                        color={colors.secondBackground}
                      />
                    </View>
                  )}
                  <View>{this.mapReplies()}</View>
                </View>
                <View
                  style={{
                    height: isNotch ? 90 * factorVertical : 60 * factorVertical
                  }}
                />
              </KeyboardAwareScrollView>
              <Modal visible={this.state.showMakeReply} transparent={true}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.5)' }}
                  onPress={() => this.setState({ showMakeReply: false })}
                >
                  <KeyboardAvoidingView
                    key={'makeComment'}
                    behavior={`${isiOS ? 'padding' : ''}`}
                    style={{ flex: 1, justifyContent: 'flex-end' }}
                  >
                    <View
                      style={{
                        padding: 10,
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderTopWidth: 0.5 * factorRatio,
                        backgroundColor: colors.mainBackground,
                        borderTopColor: colors.secondBackground
                      }}
                    >
                      <FastImage
                        style={{
                          height: 40 * factorHorizontal,
                          width: 40 * factorHorizontal,
                          borderRadius: 100,
                          marginRight: 15
                        }}
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
                        style={{
                          width: '75%',
                          fontSize: 14 * factorRatio,
                          color: colors.secondBackground,
                          fontFamily: 'OpenSans-Regular',
                          paddingVertical: 10 * factorVertical,
                          backgroundColor: colors.mainBackground
                        }}
                      />

                      <View style={styles.centerContent}>
                        <TouchableOpacity
                          onPress={() => this.sendReply(this.state.reply)}
                          style={{
                            marginBottom:
                              Platform.OS == 'android' ? 10 * factorVertical : 0
                          }}
                        >
                          <IonIcon
                            name={'md-send'}
                            size={25 * factorRatio}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                      </View>
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

export default withNavigation(Replies);
