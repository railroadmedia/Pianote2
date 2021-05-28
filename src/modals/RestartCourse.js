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
          style={[styles.centerContent, { margin: 0, flex: 1 }]}
        >
          <View style={[styles.centerContent, styles.container]}>
            <View style={localStyles.container}>
              <Text
                style={[
                  styles.modalHeaderText,
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
                  styles.modalBodyText,
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
                style={[styles.centerContent, localStyles.restartContainer]}
                onPress={() => this.props.onRestart()}
              >
                <Text style={[styles.modalButtonText, localStyles.restartText]}>
                  RESTART {this.changeType(type).toUpperCase()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={localStyles.cancelContainer}
                onPress={() => this.props.hideRestartCourse()}
              >
                <Text style={[styles.modalButtonText, localStyles.cancelText]}>
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
  }
});
