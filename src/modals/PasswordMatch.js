import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';

export default class PasswordMatch extends React.Component {
  render = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.hidePasswordMatch()}
      >
        <View
          style={[
            styles.centerContent,
            localStyles.container,
            styles.container
          ]}
        >
          <Text style={[styles.modalHeaderText, localStyles.text]}>
            Your passwords do not {'\n'} match.
          </Text>
          <Text style={[styles.modalBodyText, localStyles.text]}>
            Please try again.
          </Text>
          <TouchableOpacity
            style={localStyles.tryAgainContainer}
            onPress={() => this.props.hidePasswordMatch()}
          >
            <Text style={[styles.modalButtonText, localStyles.tryAgainText]}>
              TRY AGAIN
            </Text>
          </TouchableOpacity>
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
  text: {
    paddingHorizontal: 40,
    marginTop: 10
  },
  tryAgainContainer: {
    paddingHorizontal: 40,
    marginVertical: 10
  },
  tryAgainText: {
    color: '#fb1b2f',
    marginBottom: 10
  }
});
