/**
 * Loading
 */
import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import { withNavigation } from 'react-navigation';

class Loading extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
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
          style={[
            styles.centerContent,
            {
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent'
            }
          ]}
        >
          <View
            key={'content'}
            style={{
              backgroundColor: 'white',
              borderRadius: 15 * factorRatio,
              margin: 20 * factorRatio,
              height: 200,
              width: '80%'
            }}
          >
            <View style={{ flex: 1 }} />
            <ActivityIndicator
              size={'large'}
              color={colors.pianoteRed}
              animating={true}
              style={{ marginTop: 10, marginBottom: 10 }}
            />
            <View style={{ flex: 1 }} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default withNavigation(Loading);
