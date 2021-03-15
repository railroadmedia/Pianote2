/**
 * RestartCourse
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import { withNavigation } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

class RestartCourse extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';

    for (let i = 0; i < word.length; i++) {
      if (word[i] !== 'and') {
        word[i] = word[i][0].toUpperCase() + word[i].substr(1);
      }
    }

    for (i in word) {
      string = string + word[i] + ' ';
    }

    return string;
  };

  render = () => {
    const { type } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.hideRestartCourse()}
        style={styles.container}
      >
        <View style={[styles.centerContent, styles.container]}>
          <View style={localStyles.container}>
            <Text style={styles.modalHeaderText}>
              Restart{' '}
              {type == 'method'
                ? 'method'
                : 'this ' + this.changeType(type).toLocaleLowerCase()}
              ?
            </Text>
            <Text style={[styles.modalBodyText, localStyles.descriptionText]}>
              Take{' '}
              {type == 'method'
                ? 'method '
                : 'this ' + this.changeType(type).toLocaleLowerCase()}
              again as a refresher, or just to make sure you've got the concepts
              nailed! This will remove the XP you've earned.
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
      </TouchableWithoutFeedback>
    );
  };
}

const localStyles = StyleSheet.create({
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
    height: DeviceInfo.isTablet() ? 45 : 35,
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

export default withNavigation(RestartCourse);
