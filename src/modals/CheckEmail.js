/**
 * CheckEmail
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { withNavigation } from 'react-navigation';

class CheckEmail extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.hideCheckEmail()}
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
              This email is already {'\n'} connected to an account.
            </Text>

            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 16 * factorRatio,
                textAlign: 'center',
                paddingHorizontal: 40,
                marginVertical: 10 * factorRatio
              }}
            >
              Do you want to log in instead?
            </Text>

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('LOGINCREDENTIALS');
                this.props.hideCheckEmail();
              }}
              style={{
                borderRadius: 45 * factorRatio,
                backgroundColor: '#fb1b2f',
                marginHorizontal: 40
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 17 * factorRatio,
                  fontWeight: '700',
                  textAlign: 'center',
                  color: 'white',
                  paddingVertical: 10
                }}
              >
                LOG IN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.props.hideCheckEmail();
              }}
              style={{
                paddingHorizontal: 40,
                marginVertical: 10 * factorRatio
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 17 * factorRatio,
                  fontWeight: '700',
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

export default withNavigation(CheckEmail);
