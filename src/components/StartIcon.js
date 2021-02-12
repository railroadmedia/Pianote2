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
            size={onTablet ? 17.5 * factor : 25 * factor}
            color={'white'}
          />
          <View style={{ flex: 0.025 }} />
          <Text
            style={[
              styles.buttonText,
              {
                fontSize:
                  this.props.isMethod && onTablet ? 16 * factor : 14 * factor
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
