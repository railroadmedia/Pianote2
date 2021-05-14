import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import Chat from '../../src/assets/img/svgs/chat.svg';
import Icon from '../assets/icons';
import { connect } from 'react-redux';

const onTablet = global.onTablet;
const messageDict = {
  'lesson comment reply': {
    message: 'replied to your comment.',
    new: true,
    color: 'orange',
    type: 'comment reply notifications'
  },
  'lesson comment liked': {
    message: 'liked your comment.',
    new: true,
    color: 'blue',
    type: 'comment like notifications'
  },
  'forum post liked': {
    message: 'liked your forum post.',
    new: true,
    color: 'blue',
    type: 'forum post like notifications'
  },
  'forum post in followed thread': {
    message: 'post in followed thread.',
    new: false,
    color: 'orange',
    type: 'forum post reply notifications'
  },
  'new content releases': {
    message: '',
    new: false,
    color: 'red',
    type: 'new content release notifications'
  }
};

class ReplyNotification extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      notificationStatus,
      hideReplyNotification,
      turnOfffNotifications,
      removeNotification,
      data: { type, content, sender, id }
    } = this.props;

    return (
      <Modal
        transparent={true}
        visible={true}
        style={styles.modalContainer}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={true}
        hasBackdrop={true}
        onBackButtonPress={hideReplyNotification}
        onRequestClose={hideReplyNotification}
        supportedOrientations={['portrait', 'landscape']}
      >
        <TouchableOpacity
          style={localStyles.modalContainer}
          onPress={hideReplyNotification}
        >
          <View
            style={{
              width: '100%',
              justifyContent: 'space-between',
              backgroundColor: colors.mainBackground
            }}
          >
            <>
              <View
                style={[styles.centerContent, localStyles.profileContainer]}
              >
                <View style={localStyles.profileContainer2}>
                  {type === 'new content releases' ? (
                    <View
                      style={[styles.centerContent, localStyles.videoContainer]}
                    >
                      <Icon.FontAwesome
                        size={sizing.infoButtonSize}
                        color={'white'}
                        name={'video-camera'}
                      />
                    </View>
                  ) : type === 'forum post in followed thread' ||
                    type === 'lesson comment reply' ? (
                    <View
                      style={[styles.centerContent, localStyles.chatContainer]}
                    >
                      <Chat
                        height={sizing.infoButtonSize}
                        width={sizing.infoButtonSize}
                        fill={'white'}
                      />
                    </View>
                  ) : (
                    <View
                      style={[styles.centerContent, localStyles.likeContainer]}
                    >
                      <Icon.AntDesign
                        size={sizing.infoButtonSize}
                        color={'white'}
                        name={'like1'}
                      />
                    </View>
                  )}
                  <FastImage
                    style={localStyles.image}
                    source={{
                      uri:
                        type === 'new content releases'
                          ? content?.thumbnail_url
                          : sender?.profile_image_url
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              </View>
              <Text style={localStyles.replyUser}>
                <Text style={localStyles.user}>
                  {type == 'new content releases'
                    ? content?.display_name
                    : sender?.display_name}
                </Text>{' '}
                {messageDict[type]?.message}
              </Text>
            </>
            <>
              <View style={localStyles.removeContainer}>
                <TouchableOpacity
                  style={[styles.container, { justifyContent: 'center' }]}
                  onPress={() => removeNotification(id)}
                >
                  <View style={localStyles.crossContainer}>
                    <Icon.Entypo
                      name={'cross'}
                      size={sizing.myListButtonSize * 1.2}
                      color={colors.pianoteRed}
                    />
                    <Text
                      style={[
                        localStyles.removeText,
                        { fontSize: sizing.descriptionText }
                      ]}
                    >
                      Remove this notification
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={localStyles.muteContainer}>
                <TouchableOpacity
                  style={[styles.container, { justifyContent: 'center' }]}
                  onPress={turnOfffNotifications}
                >
                  <View style={localStyles.notificationContainer}>
                    <Icon.Ionicons
                      name={'ios-notifications-outline'}
                      size={sizing.myListButtonSize}
                      color={colors.pianoteRed}
                    />
                    <Text
                      style={[
                        localStyles.removeText,
                        { fontSize: sizing.descriptionText }
                      ]}
                    >
                      Turn {notificationStatus ? 'off' : 'on'}{' '}
                      {messageDict[type]?.type}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  user: state.userState.user
});

export default connect(mapStateToProps, null)(ReplyNotification);

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  profileContainer: {
    flexDirection: 'row',
    paddingVertical: 30
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#00101d'
  },
  profileContainer2: {
    height: onTablet ? 120 : 80,
    width: onTablet ? 120 : 80,
    borderRadius: 100,
    backgroundColor: '#445f73'
  },
  videoContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: onTablet ? 40 : 30,
    width: onTablet ? 40 : 30,
    backgroundColor: 'red',
    borderRadius: 100,
    zIndex: 5
  },
  chatContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: onTablet ? 40 : 30,
    width: onTablet ? 40 : 30,
    backgroundColor: 'orange',
    borderRadius: 100,
    zIndex: 5
  },
  likeContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: onTablet ? 40 : 30,
    width: onTablet ? 40 : 30,
    backgroundColor: 'blue',
    borderRadius: 100,
    zIndex: 5
  },
  image: {
    flex: 1,
    borderRadius: 100
  },
  replyUser: {
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 16 : 12,
    paddingBottom: 20,
    textAlign: 'center',
    color: '#445f73'
  },
  user: {
    fontFamily: 'OpenSans-Bold',
    fontSize: onTablet ? 16 : 12,
    textAlign: 'center'
  },
  removeText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 16 : 12,
    color: '#445f73',
    paddingLeft: 10
  },
  crossContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  removeContainer: {
    height: onTablet ? 70 : 50,
    width: '100%',
    borderTopWidth: 0.5,
    paddingLeft: 10,
    borderTopColor: '#445f73'
  },
  muteContainer: {
    height: onTablet ? 70 : 50,
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: '#445f73'
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  }
});
