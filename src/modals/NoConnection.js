import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

export default class NoConnection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.hideNoConnection()}
      >
        <View style={[styles.container, styles.centerContent]}>
          <View style={localStyles.container}>
            <Text style={[styles.modalHeaderText, localStyles.sorryText]}>
              Sorry, our server {'\n'}is down right now.
            </Text>
            <Text style={[styles.modalBodyText, localStyles.sorryText]}>
              Please try again later!
            </Text>
            <TouchableOpacity
              style={localStyles.tryAgainContainer}
              onPress={() => this.props.hideNoConnection()}
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
    margin: 20,
  },
  sorryText: {
    paddingHorizontal: 40,
    marginTop: 10,
  },
  tryAgainContainer: {
    alignSelf: 'center',
    paddingHorizontal: 40,
    marginVertical: 10,
  },
  tryAgain: {
    color: '#fb1b2f',
    paddingHorizontal: 20,
    margin: 10,
  },
});
