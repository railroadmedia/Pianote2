/**
 * PasswordMatch
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { withNavigation } from 'react-navigation';

class PasswordMatch extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        key={'container'}
        onPress={() => this.props.hidePasswordMatch()}
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
              style={{
                fontSize: 22 * factorRatio,
                fontWeight: 'bold',
                textAlign: 'center',
                paddingHorizontal: 40,
                marginTop: 10 * factorRatio
              }}
            >
              Your passwords do {'\n'} not match.
            </Text>

            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 16 * factorRatio,
                textAlign: 'center',
                paddingHorizontal: 40,
                marginTop: 10 * factorRatio
              }}
            >
              Please try again.
            </Text>

            <TouchableOpacity
              onPress={() => {
                this.props.hidePasswordMatch();
              }}
              style={{
                paddingHorizontal: 40,
                marginVertical: 10 * factorRatio
              }}
            >
              <Text
                style={{
                  fontSize: 17 * factorRatio,
                  fontWeight: 'bold',
                  color: '#fb1b2f',
                  textAlign: 'center'
                }}
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

export default withNavigation(PasswordMatch);
