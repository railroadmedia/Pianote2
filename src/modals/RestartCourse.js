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
            <View style={{height: 10*factorVertical}}/>
            <Text
              style={{
                fontFamily: 'OpenSans-ExtraBold',
                fontSize: 18 * factorRatio,
                textAlign: 'center'
              }}
            >
              Restart{' '}
              {type == 'method' ? 'method' : 'this ' + this.changeType(type)}?
            </Text>
            <View style={{height: 10*factorVertical}}/>
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 16 * factorRatio,
                textAlign: 'center',
                paddingHorizontal: 20,
              }}
            >
              Take {type == 'method' ? 'method' : 'this ' + type} again as a
              refresher, or just to make sure you've got the concepts nailed!
              This will remove the XP you've earned.
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
                style={{
                  color: 'white',
                  fontFamily: 'RobotoCondensed-Bold',
                  fontSize: 14 * factorRatio,
                  textAlign: 'center',
                  padding: 15
                }}
              >
                RESTART {this.changeType(type).toUpperCase()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.hideRestartCourse()}
              style={{
                paddingHorizontal: 20,
                marginVertical: 10 * factorRatio
              }}
            >
              <Text
                style={{
                  fontSize: 14 * factorRatio,
                  fontFamily: 'RobotoCondensed-Bold',
                  color: 'grey',
                  textAlign: 'center'
                }}
              >
                CANCEL
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default withNavigation(RestartCourse);
