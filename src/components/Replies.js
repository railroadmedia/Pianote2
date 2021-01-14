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
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions
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
        <View key={index} style={localStyles.replyContainer}>
          <View style={{ alignItems: 'center' }}>
            <FastImage
              style={localStyles.profileImage}
              source={{
                uri: reply.user['fields.profile_picture_image_url']
              }}
              resizeMode={FastImage.resizeMode.stretch}
            />
            <Text
              style={[
                localStyles.replyName,
                {
                  fontWeight: Platform.OS == 'ios' ? '700' : 'bold'
                }
              ]}
            >
              {reply.user.display_name}
            </Text>
          </View>

          <View style={localStyles.commentContainer}>
            <Text style={localStyles.comment}>{reply.comment}</Text>
            <Text style={localStyles.displayNameText}>
              {reply.user['display_name']} | {reply.user.rank} |{' '}
              {moment.utc(reply.created_on).local().fromNow()}
            </Text>
            <View style={localStyles.likeContainer}>
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
                  <View style={localStyles.likeCountContainer}>
                    <Text style={localStyles.likeCount}>
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
                        <EntypoIcon
                          size={27.5 * factorRatio}
                          name={'cross'}
                          color={'#c2c2c2'}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={localStyles.originalReply}>
                      <View>
                        <View style={{ alignItems: 'center' }}>
                          <FastImage
                            style={localStyles.replierImage}
                            source={{
                              uri: user['fields.profile_picture_image_url']
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                          />
                          <Text style={localStyles.opXP}>
                            {this.changeXP(user.xp)}
                          </Text>
                        </View>
                      </View>
                      <View style={localStyles.commentContainer}>
                        <Text style={localStyles.commentText}>
                          {comment.comment}
                        </Text>
                        <Text style={localStyles.userStats}>
                          {user.display_name} | {user.rank} |{' '}
                          {moment.utc(comment.created_on).local().fromNow()}
                        </Text>
                        <View style={localStyles.iconContainer}>
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
                                <View style={localStyles.likeCountContainer}>
                                  <Text style={localStyles.likeCount}>
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
                                <View style={localStyles.likeCountContainer}>
                                  <Text style={localStyles.likeCount}>
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
                      <View style={localStyles.addComment}>
                        <FastImage
                          style={localStyles.profileImage}
                          source={{
                            uri:
                              me.profileImage ||
                              'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                          }}
                          resizeMode={FastImage.resizeMode.stretch}
                        />

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
                  <View>{this.mapReplies()}</View>
                </View>
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
                    <View style={localStyles.replierContainer}>
                      <FastImage
                        style={[localStyles.profileImage, { marginRight: 15 }]}
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

const localStyles = StyleSheet.create({
  replyContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    minHeight: (30 * Dimensions.get('window').height) / 812,
    flexDirection: 'row'
  },
  profileImage: {
    height: (40 * Dimensions.get('window').width) / 375,
    width: (40 * Dimensions.get('window').width) / 375,
    borderRadius: 100
  },
  replyName: {
    fontFamily: 'OpenSans-Regular',
    fontSize:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    marginTop:
      (2 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    color: 'grey'
  },
  commentContainer: {
    flex: 1,
    paddingLeft: 15,
    marginTop: 3
  },
  displayNameText: {
    marginTop:
      (7.5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    fontSize:
      (11 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    fontFamily: 'OpenSans-Regular',
    color: 'grey'
  },
  comment: {
    fontFamily: 'OpenSans-Regular',
    fontSize:
      (13 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    color: 'white'
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  likeCountContainer: {
    borderRadius: 40,
    backgroundColor: '#002038',
    alignItems: 'center',
    justifyContent: 'center'
  },
  likeCount: {
    fontFamily: 'OpenSans-Regular',
    fontSize:
      (9.5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    color: '#fb1b2f',
    paddingHorizontal: 10
  },
  componentContainer: {
    zIndex: 2,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#00101d'
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10
  },
  replyText: {
    fontSize:
      (18 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    marginBottom: (5 * Dimensions.get('window').height) / 812,
    textAlign: 'left',
    fontFamily: 'RobotoCondensed-Bold',
    color: '#445f73'
  },
  originalReply: {
    paddingTop: 5,
    paddingHorizontal: 15,
    marginBottom:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    minHeight: (30 * Dimensions.get('window').height) / 812,
    flexDirection: 'row'
  },
  replierImage: {
    height:
      (40 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    width:
      (40 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    borderRadius: 100
  },
  opXP: {
    fontFamily: 'OpenSans-Bold',
    fontSize:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    marginTop:
      (2 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    color: 'grey'
  },
  commentText: {
    fontFamily: 'OpenSans-Regular',
    fontSize:
      (13 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    color: 'white',
    marginBottom: 7
  },
  userStats: {
    fontFamily: 'OpenSans-Regular',
    fontSize:
      (11 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    color: '#445f73'
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  addComment: {
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#445f73',
    borderTopColor: '#445f73',
    alignItems: 'center'
  },
  makeReplyContainer: {
    width: '80%',
    justifyContent: 'center'
  },
  addReplyText: {
    textAlign: 'left',
    fontFamily: 'OpenSans-Regular',
    fontSize:
      (13 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    color: 'white',
    paddingLeft: 15,
    paddingVertical:
      (30 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  replierContainer: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth:
      (0.5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    backgroundColor: '#00101d',
    borderTopColor: '#445f73'
  },
  textInput: {
    width: '75%',
    fontSize:
      (14 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    color: '#445f73',
    fontFamily: 'OpenSans-Regular',
    paddingVertical: (10 * Dimensions.get('window').height) / 812,
    backgroundColor: '#00101d'
  }
});

export default withNavigation(Replies);
