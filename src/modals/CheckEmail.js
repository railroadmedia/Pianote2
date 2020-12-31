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
            <View style={{height: 10 * factorRatio}}/>
            <Text
              style={[styles.modalHeaderText, {
                paddingHorizontal: 40,
              }]}
            >
              This email is already {'\n'} connected to an account.
            </Text>
            <View style={{height: 10 * factorRatio}}/>
            <Text
              style={[styles.modalBodyText, {
                paddingHorizontal: 40,
              }]}
            >
              Do you want to log in instead?
            </Text>
            <View style={{height: 15 * factorRatio}}/>
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
                style={[styles.modalButtonText, {
                  color: 'white',
                  paddingVertical: 10
                }]}
              >
                LOG IN
              </Text>
            </TouchableOpacity>
            <View style={{height: 5 * factorRatio}}/>
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
                style={[styles.modalCancelButtonText, {
                  color: '#fb1b2f',
                }]}
              >
                TRY AGAIN
              </Text>
            </TouchableOpacity>
            <View style={{height: 5 * factorRatio}}/>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default withNavigation(CheckEmail);
