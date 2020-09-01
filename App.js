import React from 'react';
import AppNavigator from './AppNavigator';
import NetworkProvider from './src/context/NetworkProvider';
import firebase from 'react-native-firebase';

export default class App extends React.Component {
    componentDidMount() {
        this.removeNotificationOpenedListener = firebase
            .notifications()
            .onNotificationOpened((notificationOpen) => {
                // TODO: deep linking
            });
        firebase
            .notifications()
            .getInitialNotification()
            .then((notificationOpen) => {
                if (notificationOpen) {
                    // TODO: deep linking
                }
            });
    }

    componentWillUnmount() {
        if (this.removeNotificationOpenedListener)
            this.removeNotificationOpenedListener();
    }
    render() {
        return (
            <NetworkProvider>
                <AppNavigator />
            </NetworkProvider>
        );
    }
}
