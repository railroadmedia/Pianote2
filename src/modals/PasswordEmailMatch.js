/**
 * PasswordEmailMatch
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { withNavigation } from 'react-navigation';

class PasswordEmailMatch extends React.Component {
  static navigationOptions = { header: null };
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
              style={[styles.modalHeaderText, localStyles.errorMessage]}
            >
              {this.props.errorMessage}
            </Text>
            <Text style={[styles.modalBodyText, localStyles.tryAgainText]}>Please try again.</Text>
            <TouchableOpacity
              style={localStyles.tryAgainText}
              onPress={() => {
                this.props.hidePasswordEmailMatch();
              }}
            >
              <Text style={[styles.modalButtonText, localStyles.tryAgain]}>TRY AGAIN</Text>
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
    borderRadius: 15 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    margin: 20 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2
  },
  errorMessage: {
    paddingHorizontal: 40,
    marginTop: 20 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    marginBottom: 10 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
  },
  tryAgainText: {
    paddingHorizontal: 40,
    marginVertical: 10 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2
  },
  tryAgain: {
    color: '#fb1b2f',
    marginBottom: 10 * Dimensions.get('window').height / 812,
  }
});

export default withNavigation(PasswordEmailMatch);
