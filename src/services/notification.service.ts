import messaging from '@react-native-firebase/messaging';
import { isiOS } from '../../AppStyle';
import PushNotification from 'react-native-push-notification';
import commonService from './common.service';

export let notif = {};

export const updateFcmToken = () =>
  messaging()
    .getToken()
    .then(fcmToken => {
      if (fcmToken) {
        let url = `${
          commonService.rootUrl
        }/musora-api/profile/update?firebase_token_${
          isiOS ? 'ios' : 'android'
        }=${fcmToken}`;

        return commonService.tryCall({ url, method: 'POST' });
      }
    });

export const showNotification = ({
  notification: { body, title },
  data,
  messageId
}: {
  messageId: number;
  data: any;
  notification: any;
  body: string;
  title: string;
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
      uri: data.uri,
      threadTitle: data.threadTitle
    }
  });
};

export const localNotification = () => {
  messaging().onMessage((notification: any) => {
    showNotification(notification);
  });
  messaging().setBackgroundMessageHandler(async (notification: any) => {
    showNotification(notification);
  });
};

export async function getnotifications(page: number) {
  return await commonService.tryCall({
    url: `${commonService.rootUrl}/api/railnotifications/notifications?limit=10&page=${page}`
  });
}

export async function removeNotification(id: number) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/api/railnotifications/notification/${id}`,
    method: 'DELETE'
  });
}

export async function getNotificationSettings() {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/api/railnotifications/user-notification-settings`
  });
}

export async function changeNotificationSettings(body: any) {
  let response = await commonService.tryCall({
    url: `${commonService.rootUrl}/usora/api/profile/update`,
    method: 'POST',
    body
  });
  return response;
}
