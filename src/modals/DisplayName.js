/**
 * DisplayName
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

class DisplayName extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.hideDisplayName()}
      >
        <View style={[styles.container, styles.centerContent]}>
          <View style={localStyles.titleContainer}>
            <Text style={[styles.modalHeaderText, localStyles.displayText]}>
              This display name {'\n'} is already in use.
            </Text>
            <Text style={[styles.modalBodyText, localStyles.pleaseTryAgain]}>
              Please try again.
            </Text>

            <TouchableOpacity
              style={localStyles.tryAgainContainer}
              onPress={() => {
                this.props.hideDisplayName();
              }}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  {
                    color: '#fb1b2f'
                  }
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
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  titleContainer: {
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
  displayText: {
    paddingHorizontal: 40,
    marginTop:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  pleaseTryAgain: {
    paddingHorizontal: 20,
    marginTop:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  tryAgainContainer: {
    paddingHorizontal: 20,
    marginVertical:
      (20 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  }
});

export default withNavigation(DisplayName);
