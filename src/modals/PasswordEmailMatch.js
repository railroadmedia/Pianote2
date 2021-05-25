import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

export default class PasswordEmailMatch extends React.Component {
  render = () => {
    return (
      <Modal
        visible={this.props.isVisible}
        transparent={true}
        style={styles.modalContainer}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={true}
        hasBackdrop={true}
        onBackButtonPress={() => this.props.hidePasswordEmailMatch()}
      >
        <TouchableOpacity
          style={[styles.centerContent, localStyles.modalContainer]}
          onPress={() => this.props.hidePasswordEmailMatch()}
        >
          <View style={localStyles.container}>
            <Text
              numberOfLines={2}
              style={[
                styles.modalHeaderText,
                localStyles.errorMessage,
                { marginBottom: 5 }
              ]}
            >
              {this.props.errorMessage}
            </Text>
            <Text
              style={[
                styles.modalBodyText,
                localStyles.tryAgainText,
                { marginBottom: 25 }
              ]}
            >
              Please try again.
            </Text>
            <TouchableOpacity
              style={localStyles.tryAgainText}
              onPress={() => {
                this.props.hidePasswordEmailMatch();
              }}
            >
              <Text style={[styles.modalButtonText, localStyles.tryAgain]}>
                TRY AGAIN
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
}

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 20
  },
  errorMessage: {
    paddingHorizontal: 40,
    marginTop: 15
  },
  tryAgainText: {
    paddingHorizontal: 40
  },
  tryAgain: {
    color: '#fb1b2f',
    marginBottom: 15
  }
});
