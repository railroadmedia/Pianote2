import React from 'react';
import AppNavigator from './AppNavigator';
import NetworkProvider from './src/context/NetworkProvider';
import firebase from 'react-native-firebase';
import {Linking} from 'react-native';

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
            .onNotificationOpened(notificationOpen => {
                // TODO: deep linking
            });
        firebase
            .notifications()
            .getInitialNotification()
            .then(notificationOpen => {
                if (notificationOpen) {
                    // TODO: deep linking
                }
            });
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
        if (this.removeNotificationOpenedListener)
            this.removeNotificationOpenedListener();
    }

    handleOpenURL = event => {
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
                return Actions.resetPassword({resetKey, email});
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
