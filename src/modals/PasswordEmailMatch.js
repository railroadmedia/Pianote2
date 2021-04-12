/**
 * PasswordEmailMatch
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';

export default class PasswordEmailMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.hidePasswordEmailMatch()}
      >
        <View style={[styles.container, styles.centerContent]}>
          <View style={localStyles.container}>
            <Text
              numberOfLines={2}
              style={[
                styles.modalHeaderText,
                localStyles.errorMessage,
                { marginBottom: 5 }
              ]}
            >
              {this.props.errorMessage}
            </Text>
            <Text
              style={[
                styles.modalBodyText,
                localStyles.tryAgainText,
                { marginBottom: 25 }
              ]}
            >
              Please try again.
            </Text>
            <TouchableOpacity
              style={localStyles.tryAgainText}
              onPress={() => {
                this.props.hidePasswordEmailMatch();
              }}
            >
              <Text style={[styles.modalButtonText, localStyles.tryAgain]}>
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
    margin: 20
  },
  errorMessage: {
    paddingHorizontal: 40,
    marginTop: 15
  },
  tryAgainText: {
    paddingHorizontal: 40
  },
  tryAgain: {
    color: '#fb1b2f',
    marginBottom: 15
  }
});
