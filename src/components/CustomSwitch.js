/**
 * CustomSwitch
 */
import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { withNavigation } from 'react-navigation';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontIcon from 'react-native-vector-icons/FontAwesome';

class CustomSwitch extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      leftMargin: new Animated.Value(this.props.isClicked ? 0.925 : 0.075),
      rightMargin: new Animated.Value(this.props.isClicked ? 0.075 : 0.925),
      clicked: this.props.isClicked
    };
  }

  click() {
    if (this.state.clicked == false) {
      setTimeout(() => this.setState({ clicked: true }), 200);
      Animated.parallel([
        Animated.timing(this.state.leftMargin, {
          toValue: 0.925,
          duration: 250
        }),
        Animated.timing(this.state.rightMargin, {
          toValue: 0.075,
          duration: 250
        })
      ]).start();
      this.props.clicked(true);
    } else {
      setTimeout(() => this.setState({ clicked: false }), 200);
      Animated.parallel([
        Animated.timing(this.state.leftMargin, {
          toValue: 0.075,
          duration: 250
        }),
        Animated.timing(this.state.rightMargin, {
          toValue: 0.925,
          duration: 250
        })
      ]).start();
      this.props.clicked(false);
    }
  }

  render = () => {
    return (
      <View
        style={[
          styles.centerContent,
          {
            borderRadius: 100,
            width: (onTablet ? 60 : 52.5),
            height: (onTablet ? 32.5 : 28),
            backgroundColor: this.state.clicked
              ? '#fb1b2f'
              : colors.secondBackground,
            flexDirection: 'row'
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => this.click()}
          style={[
            styles.centerContent,
            {
              height: '100%',
              width: '100%',
              justifyContent: 'center'
            }
          ]}
        >
          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row' }}>
            <Animated.View style={{ flex: this.state.leftMargin }} />
            <View
              style={[
                styles.centerContent,
                {
                  width: (onTablet ? 27.5 : 22.5),
                  height: (onTablet ? 27.5 : 22.5),
                  borderRadius: 100,
                  backgroundColor: 'white'
                }
              ]}
            >
              {this.state.clicked && (
                <FontIcon
                  name={'check'}
                  size={(onTablet ? 20 : 17.5)}
                  color={'#fb1b2f'}
                />
              )}
              {!this.state.clicked && (
                <EntypoIcon
                  name={'cross'}
                  size={(onTablet ? 25 : 22.5)}
                  color={colors.secondBackground}
                />
              )}
            </View>
            <Animated.View style={{ flex: this.state.rightMargin }} />
          </View>
          <View style={{ flex: 1 }} />
        </TouchableOpacity>
      </View>
    );
  };
}

export default withNavigation(CustomSwitch);
