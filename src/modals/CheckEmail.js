/**
 * CheckEmail
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { withNavigation } from 'react-navigation';

class CheckEmail extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        style={[styles.container, styles.centerContent]}
        onPress={() => this.props.hideCheckEmail()}
      >
        <View style={[styles.container, styles.centerContent]}>
          <View style={localStyles.container}>
            <Text style={[styles.modalHeaderText, localStyles.title]}>
              This email is already {'\n'} connected to an account.
            </Text>
            <Text style={[styles.modalBodyText, localStyles.title]}>
              Do you want to log in instead?
            </Text>
            <TouchableOpacity
              style={localStyles.loginContainer}
              onPress={() => {
                this.props.navigation.navigate('LOGINCREDENTIALS');
                this.props.hideCheckEmail();
              }}
            >
              <Text style={[styles.modalButtonText, localStyles.loginText]}>
                LOG IN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.hideCheckEmail()}
              style={localStyles.tryAgain}
            >
              <Text
                style={[styles.modalCancelButtonText, localStyles.tryAgainText]}
              >
                TRY AGAIN
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
    paddingBottom: 5,
    paddingTop: 20,
    backgroundColor: 'white'
  },
  title: {
    paddingHorizontal: 40,
    marginBottom: 10
  },
  loginContainer: {
    borderRadius: 45,
    backgroundColor: '#fb1b2f',
    marginHorizontal: 40,
    marginVertical: 5,
    height: DeviceInfo.isTablet() ? 45 : 35
  },
  loginText: {
    color: 'white',
    paddingVertical: 10
  },
  tryAgain: {
    paddingHorizontal: 40,
    marginVertical: 10
  },
  tryAgainText: {
    color: '#fb1b2f'
  }
});

export default withNavigation(CheckEmail);
