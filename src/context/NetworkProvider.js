import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export const NetworkContext = React.createContext({
  isConnected: true,
  showNoConnectionAlert: () => {}
});

export default class NetworkProvider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.showNoConnectionAlert = () => {
      return Alert.alert(
        'No internet or data connection.',
        `You can still access the lessons you have downloaded in your 'Downloads' area`,
        [{ text: 'OK', onPress: () => (this.alertPresent = false) }],
        { cancelable: false }
      );
    };

    this.state = {
      isConnected: null,
      showNoConnectionAlert: this.showNoConnectionAlert
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(this.handleConnectivityChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleConnectivityChange = state => {
    global.isConnected = state.isConnected;
    this.setState({ isConnected: state.isConnected });
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
