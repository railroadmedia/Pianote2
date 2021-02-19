/**
 * StartIcon
 */
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/Entypo';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

class StartIcon extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  sizing = type => {
    if (type == 'icon') {
      if (onTablet) {
        if (this.props.isMethod) {
          return 30;
        } else {
          return 25;
        }
      } else {
        return 20;
      }
    } else {
      if (onTablet) {
        if (this.props.isMethod) {
          return 17.5;
        } else {
          return 15;
        }
      } else {
        return 12.5;
      }
    }
  };

  render = () => {
    return (
      <View
        style={[
          styles.centerContent,
          {
            flex: 1,
            borderRadius: width * 0.1,
            backgroundColor: '#fb1b2f'
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => this.props.pressed()}
          style={[
            styles.centerContent,
            {
              flex: 1,
              flexDirection: 'row'
            }
          ]}
        >
          <Icon
            name={'controller-play'}
            size={this.sizing('icon')}
            color={'white'}
          />
          <View style={{ flex: 0.025 }} />
          <Text
            style={[
              styles.buttonText,
              {
                fontSize: this.sizing('font')
              }
            ]}
          >
            START
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
}

export default withNavigation(StartIcon);
