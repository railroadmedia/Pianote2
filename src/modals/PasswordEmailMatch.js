import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const onTablet = global.onTablet;

export default class PasswordEmailMatch extends React.Component {
  render = () => {
    return (
      <Modal
        visible={this.props.isVisible}
        transparent={true}
        style={{ margin: 0, flex: 1 }}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={true}
        hasBackdrop={true}
        onBackButtonPress={() => this.props.hidePasswordEmailMatch()}
      >
        <TouchableOpacity
          style={[localStyles.centerContent, { margin: 0, flex: 1 }]}
          onPress={() => this.props.hidePasswordEmailMatch()}
        >
          <View style={localStyles.container}>
            <Text
              numberOfLines={2}
              style={[
                localStyles.modalHeaderText,
                localStyles.errorMessage,
                { marginBottom: 5 }
              ]}
            >
              {this.props.errorMessage}
            </Text>
            <Text
              style={[
                localStyles.modalBodyText,
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
              <Text style={[localStyles.modalButtonText, localStyles.tryAgain]}>
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
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  modalHeaderText: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: onTablet ? 24 : 18
  },
  modalBodyText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 16 : 12
  },
  modalButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: onTablet ? 16 : 12
  }
});
