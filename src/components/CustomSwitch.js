import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { withNavigation } from 'react-navigation';
import FontIcon from 'react-native-vector-icons/FontAwesome';

let maxTranslateX;
export default class CustomSwitch extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    let on = this.props.isClicked;
    if (!maxTranslateX) maxTranslateX = onTablet ? 60 - 32.5 : 52.5 - 28;
    this.state = { on };
    this.slider = new Animated.Value(on ? maxTranslateX : 0);
  }

  click = () => {
    this.setState(({ on }) => {
      Animated.timing(this.slider, {
        toValue: on ? 0 : maxTranslateX,
        duration: 100,
        useNativeDriver: true
      }).start();
      this.props.onClick(!on);
      return { on: !on };
    });
  };

  render() {
    let { on } = this.state;
    return (
      <TouchableOpacity
        onPress={this.click}
        activeOpacity={1}
        style={{
          padding: 3,
          borderRadius: 100,
          width: onTablet ? 60 : 52.5,
          height: onTablet ? 32.5 : 28,
          backgroundColor: on ? '#fb1b2f' : colors.secondBackground,
          flexDirection: 'row'
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            aspectRatio: 1,
            borderRadius: 100,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ translateX: this.slider }]
          }}
        >
          <FontIcon
            name={on ? 'check' : 'times'}
            size={onTablet ? 20 : 17.5}
            color={on ? '#fb1b2f' : colors.secondBackground}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  }
}
