/**
 * PasswordEmailMatch
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { withNavigation } from 'react-navigation';

class PasswordEmailMatch extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        key={'container'}
        onPress={() => this.props.hidePasswordEmailMatch()}
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
            <View style={{ height: 10 * factorVertical }} />
            <Text
              numberOfLines={2}
              style={[
                styles.modalHeaderText,
                {
                  paddingHorizontal: 40,
                  marginTop: 10 * factorRatio
                }
              ]}
            >
              {this.props.errorMessage}
            </Text>
            <View style={{ height: 10 * factorRatio }} />
            <Text
              style={[
                styles.modalBodyText,
                {
                  paddingHorizontal: 40,
                  marginTop: 10 * factorRatio
                }
              ]}
            >
              Please try again.
            </Text>
            <View style={{ height: 10 * factorRatio }} />
            <TouchableOpacity
              onPress={() => {
                this.props.hidePasswordEmailMatch();
              }}
              style={{
                paddingHorizontal: 40,
                marginVertical: 10 * factorRatio
              }}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  {
                    color: '#fb1b2f'
                  }
                ]}
              >
                TRY AGAIN
              </Text>
            </TouchableOpacity>
            <View style={{ height: 10 * factorVertical }} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default withNavigation(PasswordEmailMatch);
