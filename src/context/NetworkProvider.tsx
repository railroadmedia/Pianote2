import React from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { Alert } from 'react-native';

interface NetworkProps {}

export interface NetworkState {
  isConnected: boolean | null;
  showNoConnectionAlert: () => void;
}

export const NetworkContext = React.createContext<NetworkState>({
  isConnected: null,
  showNoConnectionAlert: () => {}
});

export default class NetworkProvider extends React.PureComponent<
  NetworkProps,
  NetworkState
> {
  showNoConnectionAlert: () => void;
  alertPresent: boolean = false;
  unsubscribe: any;

  constructor(props: NetworkProps) {
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

  componentDidMount = () => {
    this.unsubscribe = NetInfo.addEventListener(this.handleConnectivityChange);
  };

  componentWillUnmount = () => this.unsubscribe();

  handleConnectivityChange = (state: NetInfoState) => {
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
