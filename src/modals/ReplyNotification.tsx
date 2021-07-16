import React, { FunctionComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';

import Icon from '../assets/icons';
import {
  infoButtonSize,
  mainBackground,
  myListButtonSize,
  onTablet,
  pianoteRed
} from '../../AppStyle';
import INotification, {
  INotificationDisplayData,
  NotificationTypes
} from '../model/INotifications';
import { IAppState } from '../redux/Store';
import IUser from '../model/IUser';

let messageDict: Record<NotificationTypes, INotificationDisplayData> = {
  'lesson comment reply': {
    message: 'replied to your comment.',
    new: true,
    color: 'orange',
    type: 'comment reply notifications',
    field: 'notify_on_lesson_comment_reply'
  },
  'lesson comment liked': {
    message: 'liked your comment.',
    new: true,
    color: 'blue',
    type: 'comment like notifications',
    field: 'notify_on_lesson_comment_like'
  },
  'forum post liked': {
    message: 'liked your forum post.',
    new: true,
    color: 'blue',
    type: 'forum post like notifications',
    field: 'notify_on_forum_post_like'
  },
  'forum post reply': {
    message: 'replied to your forum post.',
    new: true,
    color: 'orange',
    type: 'forum post like notifications',
    field: 'notify_on_forum_post_reply'
  },
  'forum post in followed thread': {
    message: 'post in followed thread.',
    new: false,
    color: 'orange',
    type: 'forum post reply notifications',
    field: 'notify_on_forum_followed_thread_reply'
  }
};

interface IUserStateProps {
  user: IUser;
}

interface ReplyNotificationProps extends IUserStateProps {
  notificationStatus: boolean;
  hideReplyNotification: () => void;
  turnOfffNotifications: () => void;
  removeNotification: (id: number) => void;
  data: INotification;
}

const ReplyNotification: FunctionComponent<ReplyNotificationProps> = ({
  notificationStatus,
  hideReplyNotification,
  turnOfffNotifications,
  removeNotification,
  data: { type, sender, id }
}) => {
  return (
    <Modal
      transparent={true}
      visible={true}
      onRequestClose={hideReplyNotification}
      supportedOrientations={['portrait', 'landscape']}
    >
      <TouchableOpacity
        style={localStyles.modalContainer}
        onPress={hideReplyNotification}
      >
        <View style={localStyles.modalContent}>
          <>
            <View
              style={[localStyles.centerContent, localStyles.profileContainer]}
            >
              <View style={localStyles.profileContainer2}>
                {type === 'forum post in followed thread' ||
                type === 'lesson comment reply' ? (
                  <View
                    style={[
                      localStyles.centerContent,
                      localStyles.chatContainer
                    ]}
                  >
                    <Icon.Ionicons
                      size={infoButtonSize}
                      color={'white'}
                      name={'ios-chatbubble-sharp'}
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      localStyles.centerContent,
                      localStyles.likeContainer
                    ]}
                  >
                    <Icon.AntDesign
                      size={infoButtonSize}
                      color={'white'}
                      name={'like1'}
                    />
                  </View>
                )}
                <FastImage
                  style={localStyles.image}
                  source={{ uri: sender?.profile_image_url }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            </View>
            <Text style={localStyles.replyUser}>
              <Text style={localStyles.user}>{sender?.display_name}</Text>{' '}
              {messageDict[type]?.message}
            </Text>
          </>
          <>
            <View style={localStyles.removeContainer}>
              <TouchableOpacity
                style={localStyles.gContainer}
                onPress={() => removeNotification(id)}
              >
                <View style={localStyles.crossContainer}>
                  <Icon.Entypo
                    name={'cross'}
                    size={myListButtonSize * 1.2}
                    color={pianoteRed}
                  />
                  <Text style={localStyles.removeText}>
                    Remove this notification
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={localStyles.muteContainer}>
              <TouchableOpacity
                style={localStyles.gContainer}
                onPress={turnOfffNotifications}
              >
                <View style={localStyles.notificationContainer}>
                  <Icon.Ionicons
                    name={'ios-notifications-outline'}
                    size={myListButtonSize}
                    color={pianoteRed}
                  />
                  <Text style={localStyles.removeText}>
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
};

const mapStateToProps = (state: IAppState): IUserStateProps => ({
  user: state.userState.user
});

export default connect(mapStateToProps, {})(ReplyNotification);

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  modalContent: {
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: mainBackground
  },
  profileContainer: {
    flexDirection: 'row',
    paddingVertical: 30
  },
  profileContainer2: {
    height: onTablet ? 120 : 80,
    width: onTablet ? 120 : 80,
    borderRadius: 100,
    backgroundColor: '#445f73'
  },
  gContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
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
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  }
});
