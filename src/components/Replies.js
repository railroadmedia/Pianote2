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
            paddingVertical: 10,
            paddingHorizontal: 15,
            minHeight: 30 * factorVertical,
            flexDirection: 'row'
          }}
        >
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

          <View
            style={{
              flex: 1,
              paddingLeft: 15
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
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10
              }}
            >
              <View style={{ flexDirection: 'row' }}>
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
                  <AntIcon
                    name={reply.is_liked ? 'like1' : 'like2'}
                    size={20 * factorRatio}
                    color={colors.pianoteRed}
                  />
                </TouchableOpacity>
                {reply.like_count > 0 && (
                  <View
                    style={{
                      borderRadius: 40,
                      backgroundColor: colors.notificationColor,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: 9.5 * factorRatio,
                        color: colors.pianoteRed,
                        paddingHorizontal: 10
                      }}
                    >
                      {reply.like_count}{' '}
                      {reply.like_count === 1 ? 'LIKE' : 'LIKES'}
                    </Text>
                  </View>
                )}
              </View>
              {this.props.me.userId === reply.user_id && (
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
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
    if (!reply) return this.setState({ showMakeReply: false });
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState({ showMakeReply: false, isLoading: true, reply: '' });
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
                      width: '100%',
                      zIndex: 5
                    }}
                  >
                    <View
                      key={'commentHeader'}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 15,
                        marginTop: 10
                      }}
                    >
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

                      <TouchableOpacity onPress={this.props.close}>
                        <EntypoIcon
                          size={27.5 * factorRatio}
                          name={'cross'}
                          color={'#c2c2c2'}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      key={'originalReply'}
                      style={{
                        paddingTop: 5,
                        paddingHorizontal: 15,
                        marginBottom: 10 * factorRatio,
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
                      </View>
                      <View style={{ flex: 1, paddingLeft: 15 }}>
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
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10
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
                                <AntIcon
                                  name={comment.is_liked ? 'like1' : 'like2'}
                                  size={20 * factorRatio}
                                  color={colors.pianoteRed}
                                />
                              </TouchableOpacity>
                              {comment.like_count > 0 && (
                                <View
                                  style={{
                                    borderRadius: 40,
                                    backgroundColor: colors.notificationColor,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: 'OpenSans-Regular',
                                      fontSize: 9.5 * factorRatio,
                                      color: colors.pianoteRed,
                                      paddingHorizontal: 10
                                    }}
                                  >
                                    {comment.like_count}{' '}
                                    {comment.like_count === 1
                                      ? 'LIKE'
                                      : 'LIKES'}
                                  </Text>
                                </View>
                              )}
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                              <MaterialIcon
                                name={'comment-text-outline'}
                                size={20 * factorRatio}
                                color={colors.pianoteRed}
                                style={{ marginRight: 10 }}
                              />
                              {comment.replies.length > 0 && (
                                <View
                                  style={{
                                    borderRadius: 40,
                                    backgroundColor: colors.notificationColor,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: 'OpenSans-Regular',
                                      fontSize: 9.5 * factorRatio,
                                      color: colors.pianoteRed,
                                      paddingHorizontal: 10
                                    }}
                                  >
                                    {comment.replies.length}{' '}
                                    {comment.replies.length == 1
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
                                <AntIcon
                                  name={'delete'}
                                  size={20 * factorRatio}
                                  color={colors.pianoteRed}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                    {!this.state.showMakeReply && (
                      <View
                        key={'addComment'}
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          paddingLeft: 15,
                          borderTopWidth: 1,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.secondBackground,
                          borderTopColor: colors.secondBackground,
                          alignItems: 'center'
                        }}
                      >
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

                        <TouchableOpacity
                          key={'makeReply'}
                          onPress={() => this.setState({ showMakeReply: true })}
                          style={{ width: '80%', justifyContent: 'center' }}
                        >
                          <Text
                            style={{
                              textAlign: 'left',
                              fontFamily: 'OpenSans-Regular',
                              fontSize: 13 * factorRatio,
                              color: 'white',
                              paddingLeft: 15,
                              paddingVertical: 30 * factorRatio
                            }}
                          >
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
                  onPress={() =>
                    this.setState({ showMakeReply: false, reply: '' })
                  }
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
