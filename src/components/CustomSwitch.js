/**
 * CustomSwitch
 */
import React from 'react';
import { View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontIcon from 'react-native-vector-icons/FontAwesome';

const windowDim = Dimensions.get('window');
const width = windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height = windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

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
            width: (onTablet ? 40 : 52.5) * factor,
            height: (onTablet ? 18.5 : 28) * factor,
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
                  width: (onTablet ? 15 : 22.5) * factor,
                  height: (onTablet ? 15 : 22.5) * factor,
                  borderRadius: 100,
                  backgroundColor: 'white'
                }
              ]}
            >
              {this.state.clicked && (
                <FontIcon
                  name={'check'}
                  size={(onTablet ? 12.5 : 17.5) * factor}
                  color={'#fb1b2f'}
                />
              )}
              {!this.state.clicked && (
                <EntypoIcon
                  name={'cross'}
                  size={(onTablet ? 15 : 22.5) * factor}
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
