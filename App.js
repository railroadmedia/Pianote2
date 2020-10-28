import React from 'react';
import AppNavigator from './AppNavigator';
import NetworkProvider from './src/context/NetworkProvider';
import firebase from 'react-native-firebase';
import {Linking} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class App extends React.Component {
    componentDidMount() {
        Linking.getInitialURL()
            .then(ev => {
                if (ev) {
                    let event = {
                        url: ev,
                    };
                    this.handleOpenURL(event);
                }
            })
            .catch(() => {});
        Linking.addEventListener('url', this.handleOpenURL);
        this.removeNotificationOpenedListener = firebase
            .notifications()
            .onNotificationOpened(async notificationOpen => {
                console.log(notificationOpen);
                await AsyncStorage.multiSet([
                    [
                        'lessonUrl',
                        notificationOpen?.notification?._data?.content
                            .mobile_app_url,
                    ],
                    [
                        'commentId',
                        notificationOpen?.notification?._data?.commentId,
                    ],
                ]);
            });
        firebase
            .notifications()
            .getInitialNotification()
            .then(async notificationOpen => {
                console.log(notificationOpen);
                if (notificationOpen) {
                    await AsyncStorage.multiSet([
                        [
                            'lessonUrl',
                            notificationOpen?.notification?._data?.content
                                ?.mobile_app_url,
                        ],
                        [
                            'commentId',
                            notificationOpen?.notification?._data?.commentId,
                        ],
                    ]);
                }
            });
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
        if (this.removeNotificationOpenedListener)
            this.removeNotificationOpenedListener();
    }

    handleOpenURL = async event => {
        let {url} = event;

        if (url) {
            if (url.includes('pianote.com/reset-password')) {
                let resetKey = url.substring(
                    url.indexOf('token=') + 6,
                    url.indexOf('&email'),
                );
                let email = url.substring(
                    url.indexOf('email=') + 6,
                    url.length,
                );
                await AsyncStorage.multiSet([
                    ['resetKey', resetKey],
                    ['email', email],
                ]);
            }
        }
    };

    render() {
        return (
            <NetworkProvider>
                <AppNavigator />
            </NetworkProvider>
        );
    }
}
