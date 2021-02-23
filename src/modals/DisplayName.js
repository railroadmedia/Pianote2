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

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

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
              This display name is already {'\n'} in use.
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
    borderRadius: 15 * factor,
    margin: 20 * factor
  },
  displayText: {
    paddingHorizontal: 20 * factor,
    marginTop: 10 * factor
  },
  pleaseTryAgain: {
    paddingHorizontal: 20,
    marginVertical: 5 * factor
  },
  tryAgainContainer: {
    paddingHorizontal: 20,
    marginVertical: 20 * factor
  }
});

export default withNavigation(DisplayName);
