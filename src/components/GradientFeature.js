/*
 * GradientFeature
 */
import React from 'react';
import { View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';

const colorDict = {
  blue: ['rgba(0, 16, 29, 0)', 'rgba(0, 16, 29, 1)'],
  grey: ['transparent', 'rgba(23, 26, 26, 1)', 'rgba(23, 26, 26, 1)'],
  red: ['transparent', 'rgba(80, 15, 25, 0.4)', 'rgba(80, 15, 25, 0.98)'],
  black: ['transparent', 'rgba(20, 20, 20, 0.5)', 'rgba(15, 15, 15, 0.98)'],
  dark: ['rgba(23, 26, 26, 1)', 'rgba(23, 26, 26, 1)', 'rgba(23, 26, 26, 1)'],
  brown: ['rgba(65, 11, 17, 0)', 'rgba(65, 11, 17, 0.7)', 'rgba(65, 11, 17, 1)']
};

class GradientFeature extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    let {
      color,
      height,
      zIndex,
      opacity,
      elevation,
      borderRadius
    } = this.props;
    return (
      <View
        style={{
          height,
          left: 0,
          opacity,
          bottom: 0,
          width: '100%',
          position: 'absolute',
          zIndex: isNaN(zIndex) ? 2 : zIndex,
          elevation:
            Platform.OS === 'android' ? (isNaN(elevation) ? 2 : elevation) : 0
        }}
      >
        <LinearGradient
          colors={colorDict[color]}
          style={{
            borderRadius,
            width: '100%',
            height: '100%'
          }}
        />
      </View>
    );
  };
}

export default withNavigation(GradientFeature);
