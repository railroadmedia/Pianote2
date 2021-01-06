/**
 * LogOut
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
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
        onPress={() => this.props.hideLogOut()}
        key={'container'}
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent'
        }}
      >
        <View
          key={'content'}
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent'
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 15 * factorRatio,
              margin: 20 * factorRatio
            }}
          >
            <Text
              style={[
                styles.modalHeaderText,
                {
                  marginTop: 25 * factorRatio,
                  paddingHorizontal: 40
                }
              ]}
            >
              Log Out
            </Text>

            <Text
              style={[
                styles.modalBodyText,
                {
                  paddingHorizontal: 40,
                  marginVertical: 10 * factorRatio
                }
              ]}
            >
              Are you sure that you want to log out?
            </Text>
            <View style={{ height: 10 * factorRatio }} />
            <TouchableOpacity
              onPress={() => {
                this.logOut();
              }}
              style={[
                styles.centerContent,
                {
                  backgroundColor: colors.pianoteRed,
                  borderRadius: 40,
                  marginHorizontal: 40
                }
              ]}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { color: 'white', paddingVertical: 12.5 * factorRatio }
                ]}
              >
                LOG OUT
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.hideLogOut()}
              style={[
                styles.centerContent,
                { paddingHorizontal: 40, marginVertical: 15 * factorRatio }
              ]}
            >
              <Text style={[styles.modalCancelButtonText, { color: 'grey' }]}>
                CANCEL
              </Text>
            </TouchableOpacity>
            <View style={{ height: 10 * factorRatio }} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default withNavigation(LogOut);
