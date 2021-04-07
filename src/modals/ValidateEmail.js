/**
 * ValidateEmail
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';

export default class ValidateEmail extends React.Component {
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
    paddingBottom: 5,
    paddingTop: 20,
    backgroundColor: 'white'
  },
  title: {
    paddingHorizontal: 20,
    marginBottom: 10
  },
  loginContainer: {
    borderRadius: 45,
    backgroundColor: '#fb1b2f',
    marginHorizontal: 20,
    marginVertical: 5
  },
  loginText: {
    color: 'white',
    paddingVertical: 10
  },
  tryAgain: {
    paddingHorizontal: 20,
    marginVertical: 10
  },
  tryAgainText: {
    color: '#fb1b2f'
  }
});
