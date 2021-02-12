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

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

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
    borderRadius: 15 * factor,
    margin: 20 * factor,
    paddingBottom: 5 * factor,
    paddingTop: 20 * factor,
    backgroundColor: 'white'
  },
  title: {
    paddingHorizontal: 40,
    marginBottom: 10 * factor
  },
  loginContainer: {
    borderRadius: 45 * factor,
    backgroundColor: '#fb1b2f',
    marginHorizontal: 40,
    marginVertical: 5 * factor
  },
  loginText: {
    color: 'white',
    paddingVertical: 10
  },
  tryAgain: {
    paddingHorizontal: 40,
    marginVertical: 10 * factor
  },
  tryAgainText: {
    color: '#fb1b2f'
  }
});

export default withNavigation(ValidateEmail);
