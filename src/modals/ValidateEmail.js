/**
 * ValidateEmail
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

class ValidateEmail extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        style={[styles.container, styles.centerContent]}
        onPress={() => this.props.hideValidateEmail()}
      >
        <View style={[styles.container, styles.centerContent]}>
          <View style={localStyles.container}>
            <Text style={[styles.modalHeaderText, localStyles.title]}>
              The email must be a valid {'\n'}email address.
            </Text>
            <TouchableOpacity
              onPress={() => this.props.hideValidateEmail()}
              style={localStyles.tryAgain}
            >
              <Text
                style={[
                  styles.modalCancelButtonText,
                  localStyles.tryAgainText,
                  { fontSize: 17.5 * factorRatio }
                ]}
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
    borderRadius:
      (15 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    margin:
      (20 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    paddingBottom:
      (5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    paddingTop:
      (20 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    backgroundColor: 'white'
  },
  title: {
    paddingHorizontal: 40,
    marginBottom:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  loginContainer: {
    borderRadius:
      (45 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    backgroundColor: '#fb1b2f',
    marginHorizontal: 40,
    marginVertical:
      (5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  loginText: {
    color: 'white',
    paddingVertical: 10
  },
  tryAgain: {
    paddingHorizontal: 40,
    marginVertical:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  tryAgainText: {
    color: '#fb1b2f'
  }
});

export default withNavigation(ValidateEmail);
