import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import commonService from './common.service';
import { updateUserDetails } from './UserActions';

export let notif = {};

export const updateFcmToken = () =>
  messaging()
    .getToken()
    .then(fcmToken => {
      if (fcmToken) updateUserDetails(null, null, null, fcmToken);
    });

export const showNotification = ({
  notification: { body, title },
  data,
  messageId
}) => {
  PushNotification.localNotification({
    channelId: 'pianote-app-channel',
    title,
    id: messageId,
    message: body,
    playSound: true,
    color: '#fb1b2f',
    bigPictureUrl: data.image,
    smallIcon: 'notifications_logo',
    userInfo: {
      commentId: data.commentId,
      mobile_app_url: data.mobile_app_url,
      type: data.type,
      uri: data.uri
    }
  });
};
export const localNotification = () => {
  messaging().onMessage(notification => {
    showNotification(notification);
  });
  messaging().setBackgroundMessageHandler(async notification => {
    showNotification(notification);
  });
};

export async function getnotifications(page) {
  return await commonService.tryCall(
    `${commonService.rootUrl}/api/railnotifications/notifications?limit=10&page=${page}`
  );
}

export async function removeNotification(id) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/railnotifications/notification/${id}`,
    'DELETE'
  );
}

export async function getNotificationSettings() {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/railnotifications/user-notification-settings`
  );
}

export async function changeNotificationSettings(body) {
  let x = await commonService.tryCall(
    `${commonService.rootUrl}/api/railnotifications/user-notification-settings`,
    'PATCH',
    body
  );
  console.log(x);
  return x;
}
