/**
 * ProfileImage
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

class ProfileImage extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

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
    paddingHorizontal: 40,
    marginTop:
      (20 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  tryAgain: {
    paddingHorizontal: 40,
    marginTop:
      (20 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  tryAgainTextContainer: {
    paddingHorizontal: 20,
    marginVertical:
      (17.5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  tryAgainText: {
    color: '#fb1b2f',
    marginBottom: 5
  }
});

export default withNavigation(ProfileImage);
