import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';

export default class ProfileImage extends React.Component {
  render = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.hideProfileImage()}
      >
        <View style={[styles.container, styles.centerContent]}>
          <View style={localStyles.container}>
            <Text style={[styles.modalHeaderText, localStyles.title]}>
              Profile image is too large.
            </Text>
            <Text style={[styles.modalBodyText, localStyles.tryAgain]}>
              Please try again.
            </Text>

            <TouchableOpacity
              style={localStyles.tryAgainTextContainer}
              onPress={() => {
                this.props.hideProfileImage();
              }}
            >
              <Text style={[styles.modalButtonText, localStyles.tryAgainText]}>
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
  title: {
    paddingHorizontal: 40,
    marginTop: 10
  },
  tryAgain: {
    paddingHorizontal: 40,
    marginTop: 5
  },
  tryAgainTextContainer: {
    paddingHorizontal: 20,
    marginVertical: 15
  },
  tryAgainText: {
    color: '#fb1b2f',
    marginTop: 10
  }
});
