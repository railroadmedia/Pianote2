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

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

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
    borderRadius: 15 * factor,
    margin: 20 * factor
  },
  title: {
    paddingHorizontal: 40,
    marginTop: 10 * factor
  },
  tryAgain: {
    paddingHorizontal: 40,
    marginTop: 5 * factor
  },
  tryAgainTextContainer: {
    paddingHorizontal: 20,
    marginVertical: 17.5 * factor
  },
  tryAgainText: {
    color: '#fb1b2f',
    marginTop: 10
  }
});

export default withNavigation(ProfileImage);
