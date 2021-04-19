import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import Intercom from 'react-native-intercom';
import {logOut} from '../services/UserDataAuth';
import {reset} from '../../AppNavigator';

export default class LogOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  logOut = async () => {
    logOut();
    Intercom.logout();
    await AsyncStorage.clear();
    await AsyncStorage.setItem('loggedIn', 'false');
    reset('LOGIN');
    this.props.onLogout?.();
  };

  render = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.hideLogOut()}
      >
        <View style={[styles.centerContent, styles.container]}>
          <View style={localStyles.container}>
            <Text style={[styles.modalHeaderText, localStyles.title]}>
              Log Out
            </Text>
            <Text style={[styles.modalBodyText, localStyles.description]}>
              Are you sure that you want to log out?
            </Text>
            <View style={{height: 5}} />
            <TouchableOpacity
              style={[styles.centerContent, localStyles.logoutText]}
              onPress={() => this.logOut()}
            >
              <Text style={[styles.modalButtonText, localStyles.logout]}>
                LOG OUT
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.centerContent, localStyles.cancelContainter]}
              onPress={() => this.props.hideLogOut()}
            >
              <Text style={[styles.modalCancelButtonText, localStyles.cancel]}>
                CANCEL
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 20,
  },
  title: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  description: {
    paddingHorizontal: 30,
    marginTop: 10,
    fontSize: DeviceInfo.isTablet() ? 18 : 14,
  },
  logoutText: {
    backgroundColor: '#fb1b2f',
    borderRadius: 40,
    marginVertical: 15,
    marginHorizontal: 30,
    fontFamily: 'OpenSans-Bold',
    height: DeviceInfo.isTablet() ? 40 : 30,
    textAlign: 'center',
  },
  logout: {
    color: 'white',
    fontSize: DeviceInfo.isTablet() ? 18 : 14,
  },
  cancelContainter: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  cancel: {
    color: 'grey',
    fontSize: DeviceInfo.isTablet() ? 16 : 12,
  },
});
