import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import {updateUserDetails} from './UserActions';

export let notif = {};

export const updateFcmToken = () =>
    messaging()
        .getToken()
        .then(fcmToken => {
            if (fcmToken) updateUserDetails(null, null, null, fcmToken);
        });

export const showNotification = ({
    notification: {body, title},
    data,
    messageId,
}) => {
    PushNotification.localNotification({
        title,
        id: messageId,
        message: body,
        playSound: true,
        color: colors.pianoteRed,
        bigPictureUrl: data.image,
        smallIcon: 'ic_stat_name',
        channelId: 'pianote-app-chanel',
        userInfo: {
            commentId: data.commentId,
            mobile_app_url: data.mobile_app_url,
            type: data.type,
            uri: data.uri,
        },
    });
};
export const localNotification = () => {
    messaging().onMessage(notification => {
        showNotification(notification);
    });
    messaging().setBackgroundMessageHandler(notification => {
        showNotification(notification);
    });
};
