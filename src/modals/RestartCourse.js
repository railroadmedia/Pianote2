import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const onTablet = global.onTablet;

export default class RestartCourse extends React.Component {
  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';
    for (i in word) string = string + word[i] + ' ';
    return string;
  };

  render = () => {
    const { type } = this.props;
    return (
      <Modal
        visible={this.props.isVisible}
        transparent={true}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        hasBackdrop={true}
      >
        <TouchableOpacity
          onPress={() => this.props.hideRestartCourse()}
          style={[localStyles.centerContent, { margin: 0, flex: 1 }]}
        >
          <View style={[localStyles.centerContent, localStyles.container]}>
            <View style={localStyles.container}>
              <Text
                style={[
                  localStyles.modalHeaderText,
                  { textTransform: 'capitalize' }
                ]}
              >
                Restart{' '}
                {type === 'method'
                  ? 'method'
                  : 'this ' + this.changeType(type).toLocaleLowerCase()}
                ?
              </Text>
              <Text
                style={[
                  localStyles.modalBodyText,
                  localStyles.descriptionText,
                  { textTransform: 'capitalize' }
                ]}
              >
                Take{' '}
                {type === 'method'
                  ? 'method '
                  : 'this ' + this.changeType(type).toLocaleLowerCase()}
                again as a refresher, or just to make sure you've got the
                concepts nailed! This will remove the XP you've earned.
              </Text>
              <TouchableOpacity
                style={[
                  localStyles.centerContent,
                  localStyles.restartContainer
                ]}
                onPress={() => this.props.onRestart()}
              >
                <Text
                  style={[localStyles.modalButtonText, localStyles.restartText]}
                >
                  RESTART {this.changeType(type).toUpperCase()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={localStyles.cancelContainer}
                onPress={() => this.props.hideRestartCourse()}
              >
                <Text
                  style={[localStyles.modalButtonText, localStyles.cancelText]}
                >
                  CANCEL
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
    borderRadius: 10,
    margin: 50,
    backgroundColor: 'white',
    elevation: 2,
    paddingTop: 10
  },
  descriptionText: {
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  restartContainer: {
    backgroundColor: '#fb1b2f',
    marginTop: 10,
    borderRadius: 40,
    paddingHorizontal: 20,
    height: onTablet ? 45 : 35,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  restartText: {
    color: 'white'
  },
  cancelContainer: {
    marginTop: 10,
    paddingHorizontal: 20
  },
  cancelText: {
    color: 'grey',
    marginBottom: 10
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  gContainer: {
    flex: 1,
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
