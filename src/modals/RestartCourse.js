/**
 * RestartCourse
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import { withNavigation } from 'react-navigation';

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
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            key={'card'}
            style={{
              borderRadius: 10 * factorRatio,
              margin: 20 * factorRatio,
              backgroundColor: 'white',
              elevation: 2
            }}
          >
            <View style={{ height: 15 * factorRatio }} />
            <Text style={styles.modalHeaderText}>
              Restart{' '}
              {type == 'method' ? 'method' : 'this ' + this.changeType(type)}?
            </Text>
            <View style={{ height: 10 * factorVertical }} />
            <Text
              style={[
                styles.modalBodyText,
                {
                  textAlign: 'center',
                  paddingHorizontal: 20
                }
              ]}
            >
              Take{' '}
              {type == 'method' ? 'method' : 'this ' + this.changeType(type)}
              again as a refresher, or just to make sure you've got the concepts
              nailed! This will remove the XP you've earned.
            </Text>

            <TouchableOpacity
              onPress={() => this.props.onRestart()}
              style={{
                backgroundColor: '#fb1b2f',
                marginTop: 10 * factorRatio,
                borderRadius: 40 * factorRatio,
                paddingHorizontal: 20,
                alignSelf: 'center'
              }}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { color: 'white', padding: 12.5 * factorVertical }
                ]}
              >
                RESTART {this.changeType(type).toUpperCase()}
              </Text>
            </TouchableOpacity>
            <View style={{ height: 10 * factorVertical }} />
            <TouchableOpacity
              onPress={() => this.props.hideRestartCourse()}
              style={{
                paddingHorizontal: 20
              }}
            >
              <Text style={[styles.modalButtonText, { color: 'grey' }]}>
                CANCEL
              </Text>
            </TouchableOpacity>
            <View style={{ height: 10 * factorRatio }} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default withNavigation(RestartCourse);
