/**
 * NoConnection
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { withNavigation } from 'react-navigation';

class NoConnection extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        key={'container'}
        onPress={() => this.props.hideNoConnection()}
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent'
        }}
      >
        <View
          key={'content'}
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent'
          }}
        >
          <View
            key={'content'}
            style={{
              backgroundColor: 'white',
              borderRadius: 15 * factorRatio,
              margin: 20 * factorRatio
            }}
          >
            <Text
              style={[styles.modalHeaderText, {
                paddingHorizontal: 40,
                marginTop: 10 * factorRatio
              }]}
            >
              Sorry, our server {'\n'}is down right now.
            </Text>

            <Text
              style={[styles.modalBodyText, {
                paddingHorizontal: 40,
                marginTop: 10 * factorRatio
              }]}
            >
              Please try again later!
            </Text>

            <TouchableOpacity
              onPress={() => {
                this.props.hideNoConnection();
              }}
              style={{
                alignSelf: 'center',
                paddingHorizontal: 40,
                marginVertical: 10 * factorRatio
              }}
            >
              <Text
                style={[styles.modalButtonText, {
                  color: '#fb1b2f',
                  paddingHorizontal: 20,
                  margin: 10 * factorRatio
                }]}
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

export default withNavigation(NoConnection);
