import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const colorDict = {
  blue: ['rgba(0, 16, 29, 0)', 'rgba(0, 16, 29, 1)'],
  grey: ['transparent', 'rgba(23, 26, 26, 1)', 'rgba(23, 26, 26, 1)'],
  red: ['transparent', 'rgba(80, 15, 25, 0.4)', 'rgba(80, 15, 25, 0.98)'],
  black: ['transparent', 'rgba(20, 20, 20, 0.5)', 'rgba(0, 0, 0, 1)'],
  dark: ['rgba(23, 26, 26, 1)', 'rgba(23, 26, 26, 1)', 'rgba(23, 26, 26, 1)'],
  brown: ['rgba(65, 11, 17, 0)', 'rgba(65, 11, 17, 0.7)', 'rgba(65, 11, 17, 1)']
};

export default class GradientFeature extends React.Component {
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
          elevation: !isiOS ? (isNaN(elevation) ? 2 : elevation) : 0
        }}
      >
        <LinearGradient
          colors={colorDict[color]}
          style={{
            borderRadius,
            flex: 1
          }}
        />
      </View>
    );
  };
}
