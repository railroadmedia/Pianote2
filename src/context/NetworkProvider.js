import React from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = React.createContext({
    isConnected: true,
});

export default class NetworkProvider extends React.PureComponent {
    state = {
        isConnected: null,
    };

    componentDidMount() {
        this.unsubscribe = NetInfo.addEventListener(
            this.handleConnectivityChange,
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleConnectivityChange = state => {
        this.setState({isConnected: state.isConnected});
    };

    render() {
        return this.state.isConnected === null ? (
            <></>
        ) : (
            <NetworkContext.Provider value={this.state}>
                {this.props.children}
            </NetworkContext.Provider>
        );
    }
}
