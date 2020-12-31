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
              style={[styles.modalHeaderText, {
                paddingHorizontal: 40,
                marginTop: 20 * factorRatio
              }]}
            >
              Profile image is too large.
            </Text>

            <Text
              style={[styles.modalBodyText, {
                paddingHorizontal: 40,
                marginTop: 20 * factorRatio
              }]}
            >
              Please try again.
            </Text>

            <TouchableOpacity
              onPress={() => {
                this.props.hideProfileImage();
              }}
              style={{
                paddingHorizontal: 20,
                marginVertical: 17.5 * factorRatio
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

export default withNavigation(ProfileImage);
