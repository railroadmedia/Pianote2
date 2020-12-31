/**
 * DisplayName
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

import { withNavigation } from 'react-navigation';

class DisplayName extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.hideDisplayName()}
        key={'container'}
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
            style={{
              backgroundColor: 'white',
              borderRadius: 15 * factorRatio,
              margin: 20 * factorRatio,
            }}
          >
            <Text
              style={[styles.modalHeaderText, {
                paddingHorizontal: 40,
                marginTop: 10 * factorRatio
              }]}
            >
              This display name {'\n'} is already in use.
            </Text>

            <Text
              style={[styles.modalBodyText, {
                paddingHorizontal: 20,
                marginTop: 10 * factorRatio
              }]}
            >
              Please try again.
            </Text>

            <TouchableOpacity
              onPress={() => {
                this.props.hideDisplayName();
              }}
              style={{
                paddingHorizontal: 20,
                marginVertical: 20 * factorRatio
              }}
            >
              <Text
                style={[styles.modalButtonText, {
                  color: '#fb1b2f',
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

export default withNavigation(DisplayName);
