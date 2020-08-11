import React from 'react';
import AppNavigator from './AppNavigator';
import NetworkProvider from './src/context/NetworkProvider';

export default class App extends React.Component {
    render() {
        return (
            <NetworkProvider>
                <AppNavigator />
            </NetworkProvider>
        );
    }
}
