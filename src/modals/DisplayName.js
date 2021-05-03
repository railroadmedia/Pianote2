import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';

export default class DisplayName extends React.Component {
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
    borderRadius: 15,
    margin: 20
  },
  displayText: {
    paddingHorizontal: 20,
    marginTop: 10
  },
  pleaseTryAgain: {
    paddingHorizontal: 20,
    marginVertical: 5
  },
  tryAgainContainer: {
    paddingHorizontal: 20,
    marginVertical: 20
  }
});
