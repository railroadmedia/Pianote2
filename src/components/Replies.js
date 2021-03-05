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
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NetworkContext } from '../context/NetworkProvider';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

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

  mapReplies = () => {
    return this.props.comment.replies.map((reply, index) => {
      return (
        <View
          key={index}
          style={{
            backgroundColor: colors.mainBackground,
            borderTopColor: colors.secondBackground,
            flex: 1,
            borderTopWidth: 0.25,
            flexDirection: 'row',
            paddingTop: 10 * factor,
            paddingBottom: 0 * factor,
            paddingHorizontal: 10 * factor
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingBottom: 10 * factor
            }}
          >
            <FastImage
              style={{
                height: (onTablet ? 30 : 40) * factor,
                width: (onTablet ? 30 : 40) * factor,
                borderRadius: 100,
                marginTop: 10 * factor
              }}
              source={{ uri: reply.user['fields.profile_picture_image_url'] }}
              resizeMode={FastImage.resizeMode.stretch}
            />
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: onTablet ? 15 : 10 * factor,
                marginTop: 5 * factor,
                fontWeight: 'bold',
                color: colors.pianoteGrey
              }}
            >
              {reply.user.display_name}
            </Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 10 * factor }}>
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: (onTablet ? 10 : 13) * factor,
                color: 'white',
                paddingTop: 10 * factor
              }}
            >
              {reply.comment}
            </Text>
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: (onTablet ? 9 : 10) * factor,
                color: colors.secondBackground,
                paddingTop: 5 * factor,
                paddingBottom: 10 * factor
              }}
            >
              {reply.user['display_name']} | {reply.user.rank} |{' '}
              {moment.utc(reply.created_on).local().fromNow()}
            </Text>
            <View
              style={{
                paddingBottom: 15 * factor,
                paddingTop: 5 * factor
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
                    <AntIcon
                      name={reply.is_liked ? 'like1' : 'like2'}
                      size={(onTablet ? 15 : 22.5) * factor}
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
                          fontSize: (onTablet ? 8 : 10) * factor,
                          color: colors.pianoteRed,
                          paddingHorizontal: 5 * factor
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
                    onPress={() => {
                      if (!this.context.isConnected)
                        return this.context.showNoConnectionAlert();
                      this.props.deleteReply(reply.id);
                    }}
                  >
                    <AntIcon
                      name={'delete'}
                      size={(onTablet ? 15 : 20) * factor}
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
                        <EntypoIcon
                          size={(onTablet ? 22.5 : 27.5) * factor}
                          name={'cross'}
                          color={'#c2c2c2'}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        backgroundColor: colors.mainBackground,
                        flex: 1,
                        flexDirection: 'row',
                        paddingTop: 10 * factor,
                        paddingHorizontal: 10 * factor
                      }}
                    >
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          paddingBottom: 10 * factor
                        }}
                      >
                        <FastImage
                          style={{
                            height: (onTablet ? 30 : 40) * factor,
                            width: (onTablet ? 30 : 40) * factor,
                            borderRadius: 100,
                            marginTop: 10 * factor
                          }}
                          source={{
                            uri: user['fields.profile_picture_image_url']
                          }}
                          resizeMode={FastImage.resizeMode.stretch}
                        />
                        <Text
                          style={{
                            fontFamily: 'OpenSans-Regular',
                            fontSize: onTablet ? 15 : 10 * factor,
                            marginTop: 5 * factor,
                            fontWeight: 'bold',
                            color: colors.pianoteGrey
                          }}
                        >
                          {this.changeXP(user.xp)}
                        </Text>
                      </View>

                      <View style={{ flex: 1, paddingLeft: 10 * factor }}>
                        <Text
                          style={{
                            fontFamily: 'OpenSans-Regular',
                            fontSize: (onTablet ? 10 : 13) * factor,
                            color: 'white',
                            paddingTop: 10 * factor
                          }}
                        >
                          {comment.comment}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'OpenSans-Regular',
                            fontSize: (onTablet ? 9 : 10) * factor,
                            color: colors.secondBackground,
                            paddingTop: 5 * factor,
                            paddingBottom: 10 * factor
                          }}
                        >
                          {user.display_name} | {user.rank} |{' '}
                          {moment.utc(comment.created_on).local().fromNow()}
                        </Text>
                        <View
                          style={{
                            paddingBottom: 15 * factor,
                            paddingTop: 5 * factor
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
                                  size={(onTablet ? 15 : 22.5) * factor}
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
                                      fontSize: (onTablet ? 8 : 10) * factor,
                                      color: colors.pianoteRed,
                                      paddingHorizontal: 5 * factor
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
                                size={(onTablet ? 15 : 22.5) * factor}
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
                                  size={(onTablet ? 12.5 : 20) * factor}
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
                        style={[
                          localStyles.profileImage,
                          { marginRight: 10 * factor }
                        ]}
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
                          marginBottom:
                            Platform.OS == 'android' ? 10 * factor : 0
                        }}
                      >
                        <IonIcon
                          name={'md-send'}
                          size={(onTablet ? 15 : 25) * factor}
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

const localStyles = StyleSheet.create({
  replyContainer: {
    paddingHorizontal: (10 * Dimensions.get('window').width) / 375,
    minHeight: (30 * Dimensions.get('window').height) / 812,
    flexDirection: 'row'
  },
  profileImage: {
    height: (DeviceInfo.isTablet() ? 30 : 40) * factor,
    width: (DeviceInfo.isTablet() ? 30 : 40) * factor,
    paddingVertical: (10 * Dimensions.get('window').height) / 812,
    borderRadius: 100
  },
  replyName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 10 * factor,
    marginTop: 2 * factor,
    color: 'grey'
  },
  commentContainer: {
    flex: 1,
    paddingLeft: (10 * Dimensions.get('window').width) / 375,
    marginTop: 3
  },
  displayNameText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: (DeviceInfo.isTablet() ? 9 : 10) * factor,
    color: '#445f73',
    paddingVertical: (5 * Dimensions.get('window').height) / 812
  },
  comment: {
    paddingTop: (10 * Dimensions.get('window').height) / 812,
    fontSize: (DeviceInfo.isTablet() ? 10 : 13) * factor,
    fontFamily: 'OpenSans-Regular',
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
    fontSize: (DeviceInfo.isTablet() ? 9 : 10) * factor,
    color: '#fb1b2f',
    paddingHorizontal: (7.5 * Dimensions.get('window').width) / 375
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
    paddingHorizontal: 10 * factor,
    marginTop: 10
  },
  replyText: {
    fontSize: (DeviceInfo.isTablet() ? 12 : 18) * factor,
    marginVertical: (5 * Dimensions.get('window').height) / 812,
    textAlign: 'left',
    fontFamily: 'RobotoCondensed-Bold',
    color: '#445f73'
  },
  originalReply: {
    paddingTop: 5,
    paddingHorizontal: (10 * Dimensions.get('window').width) / 375,
    marginBottom: 10 * factor,
    minHeight: (30 * Dimensions.get('window').height) / 812,
    flexDirection: 'row'
  },
  replierImage: {
    height:
      ((DeviceInfo.isTablet() ? 30 : 40) * Dimensions.get('window').width) /
      375,
    width:
      ((DeviceInfo.isTablet() ? 30 : 40) * Dimensions.get('window').width) /
      375,
    paddingVertical: (10 * Dimensions.get('window').height) / 812,
    borderRadius: 100
  },
  opXP: {
    fontFamily: 'OpenSans-Bold',
    fontSize: DeviceInfo.isTablet()
      ? 15
      : (10 *
          (Dimensions.get('window').height / 812 +
            Dimensions.get('window').width / 375)) /
        2,
    marginTop: 5 * factor,
    color: 'grey'
  },
  commentText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13 * factor,
    color: 'white',
    marginBottom: 7
  },
  userStats: {
    fontFamily: 'OpenSans-Regular',
    fontSize: (DeviceInfo.isTablet() ? 9 : 10) * factor,
    color: '#445f73',
    paddingTop: (5 * Dimensions.get('window').height) / 812,
    paddingBottom: (10 * Dimensions.get('window').height) / 812
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  addComment: {
    width: '100%',
    flexDirection: 'row',
    paddingLeft: (10 * Dimensions.get('window').width) / 375,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#445f73',
    borderTopColor: '#445f73',
    alignItems: 'center'
  },
  makeReplyContainer: {
    width: '80%',
    paddingVertical: (5 * Dimensions.get('window').height) / 812,
    justifyContent: 'center'
  },
  addReplyText: {
    textAlign: 'left',
    fontFamily: 'OpenSans-Regular',
    fontSize: (DeviceInfo.isTablet() ? 10 : 13) * factor,
    color: 'white',
    paddingLeft: (10 * Dimensions.get('window').width) / 375,
    paddingVertical: (25 * Dimensions.get('window').height) / 812
  },
  replierContainer: {
    padding: (10 * Dimensions.get('window').width) / 375,
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 0.5,
    backgroundColor: '#00101d',
    borderTopColor: '#445f73'
  },
  textInput: {
    flex: 1,
    fontSize: (DeviceInfo.isTablet() ? 10 : 14) * factor,
    color: '#445f73',
    fontFamily: 'OpenSans-Regular',
    paddingVertical: (10 * Dimensions.get('window').height) / 812,
    backgroundColor: '#00101d'
  }
});

export default withNavigation(Replies);
