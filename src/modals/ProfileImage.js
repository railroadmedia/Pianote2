/**
 * ProfileImage
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { withNavigation } from 'react-navigation';

class ProfileImage extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.hideProfileImage()}
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
                alignSelf: 'center',
                paddingHorizontal: 40,
                marginTop: 10 * factorRatio
              }}
            >
              Profile Image is too large.
            </Text>

            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 18 * factorRatio,
                textAlign: 'center',
                paddingHorizontal: 40,
                marginTop: 10 * factorRatio
              }}
            >
              Please try again.
            </Text>

            <TouchableOpacity
              onPress={() => {
                this.props.hideProfileImage();
              }}
              style={{
                paddingHorizontal: 20,
                marginVertical: 20 * factorRatio
              }}
            >
              <Text
                style={{
                  fontSize: 20 * factorRatio,
                  fontWeight: 'bold',
                  color: '#fb1b2f',
                  textAlign: 'center',
                  alignSelf: 'center'
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

export default withNavigation(ProfileImage);
