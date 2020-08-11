import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import {Text} from 'react-native';
export const NetworkContext = React.createContext({isConnected: true});

export default class NetworkProvider extends React.PureComponent {
    state = {
        isConnected: true,
    };

    componentDidMount() {
        this.unsubscribe = NetInfo.addEventListener(
            this.handleConnectivityChange,
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleConnectivityChange = (state) => {
        this.setState({isConnected: state.isConnected});
    };

    render() {
        return (
            <NetworkContext.Provider value={this.state}>
                {this.props.children}
            </NetworkContext.Provider>
        );
    }
}
