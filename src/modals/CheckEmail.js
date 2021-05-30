import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { navigate } from '../../AppNavigator';

const onTablet = global.onTablet;

export default class CheckEmail extends React.Component {
  render = () => {
    return (
      <Modal
        visible={this.props.isVisible}
        transparent={true}
        animation={'slideInUp'}
        animationInTiming={350}
        animationOutTiming={350}
        coverScreen={true}
        hasBackdrop={true}
        onBackButtonPress={() => this.props.hideCheckEmail()}
      >
        <TouchableOpacity
          style={[localStyles.centerContent, { margin: 0, flex: 1 }]}
          onPress={() => this.props.hideCheckEmail()}
        >
          <View style={[localStyles.container1, localStyles.centerContent]}>
            <View style={localStyles.container}>
              <Text style={[localStyles.modalHeaderText, localStyles.title]}>
                This email is already {'\n'} connected to an account.
              </Text>
              <Text style={[localStyles.modalBodyText, localStyles.title]}>
                Do you want to log in instead?
              </Text>
              <TouchableOpacity
                style={localStyles.loginContainer}
                onPress={() => {
                  navigate('LOGINCREDENTIALS');
                  this.props.hideCheckEmail();
                }}
              >
                <Text
                  style={[localStyles.modalButtonText, localStyles.loginText]}
                >
                  LOG IN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.hideCheckEmail()}
                style={localStyles.tryAgain}
              >
                <Text
                  style={[
                    localStyles.modalCancelButtonText,
                    localStyles.tryAgainText
                  ]}
                >
                  TRY AGAIN
                </Text>
              </TouchableOpacity>
            </View>
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
    margin: 20,
    paddingBottom: 5,
    paddingTop: 20,
    backgroundColor: 'white'
  },
  title: {
    paddingHorizontal: 40,
    marginBottom: 10
  },
  loginContainer: {
    borderRadius: 45,
    backgroundColor: '#fb1b2f',
    marginHorizontal: 40,
    marginVertical: 5,
    height: onTablet ? 45 : 35
  },
  loginText: {
    color: 'white',
    paddingVertical: 10
  },
  tryAgain: {
    paddingHorizontal: 40,
    marginVertical: 10
  },
  tryAgainText: {
    color: '#fb1b2f'
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  container1: {
    flex: 1,
    alignSelf: 'stretch'
  },
  modalHeaderText: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: onTablet ? 24 : 18
  },
  modalButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: onTablet ? 16 : 12
  },
  modalCancelButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: onTablet ? 16 : 12
  },
  modalBodyText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 16 : 12
  }
});
