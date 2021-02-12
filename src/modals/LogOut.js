/**
 * LogOut
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions
} from 'react-native';
import { withNavigation } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions, StackActions } from 'react-navigation';
import Intercom from 'react-native-intercom';
import { logOut } from '../services/UserDataAuth';

const windowDim = Dimensions.get('window');
const width = windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height = windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;
const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'LOGIN' })]
});

class LogOut extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      chosenInstructor: 2
    };
  }

  logOut = async () => {
    logOut();
    Intercom.logout();
    await AsyncStorage.clear();
    await AsyncStorage.setItem('loggedIn', 'false');
    await this.props.navigation.dispatch(resetAction);
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
    borderRadius: 15 * factor,
    margin: 20 * factor
  },
  title: {
    marginTop: 25 * factor,
    paddingHorizontal: 40
  },
  description: {
    paddingHorizontal: 40,
    marginVertical: 10 * factor,
    marginBottom: 10 * factor
  },
  logoutText: {
    backgroundColor: '#fb1b2f',
    borderRadius: 40,
    marginHorizontal: 40
  },
  logout: {
    color: 'white',
    paddingVertical: 12.5 * factor
  },
  cancelContainter: {
    paddingHorizontal: 40,
    marginVertical: 15 * factor
  },
  cancel: {
    color: 'grey',
    marginBottom: 10 * factor
  }
});

export default withNavigation(LogOut);
