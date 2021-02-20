/**
 * PasswordMatch
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

class PasswordMatch extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.hidePasswordMatch()}
      >
        <View style={[styles.centerContent, styles.container]}>
          <View style={localStyles.container}>
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
              <Text style={[
                styles.modalButtonText, 
                localStyles.tryAgainText,
                {fontSize: (onTablet ? 9 : 14) * factor}
                ]}>
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
  text: {
    paddingHorizontal: 40,
    marginTop: 10 * factor
  },
  tryAgainContainer: {
    paddingHorizontal: 40,
    marginVertical: 10 * factor
  },
  tryAgainText: {
    color: '#fb1b2f',
    marginBottom: 7.5 * factor
  }
});

export default withNavigation(PasswordMatch);
