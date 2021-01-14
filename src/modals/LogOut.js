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
    Intercom.logout();
    await AsyncStorage.clear();
    await AsyncStorage.setItem('loggedIn', 'false');
    await this.props.navigation.dispatch(resetAction);
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
    borderRadius:
      (15 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    margin:
      (20 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  title: {
    marginTop:
      (25 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    paddingHorizontal: 40
  },
  description: {
    paddingHorizontal: 40,
    marginVertical:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    marginBottom:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  logoutText: {
    backgroundColor: '#fb1b2f',
    borderRadius: 40,
    marginHorizontal: 40
  },
  logout: {
    color: 'white',
    paddingVertical:
      (12.5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  cancelContainter: {
    paddingHorizontal: 40,
    marginVertical:
      (15 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  cancel: {
    color: 'grey',
    marginBottom:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  }
});

export default withNavigation(LogOut);
