/**
 * ResetIcon
 */
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const windowDim = Dimensions.get('window');
const width = windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height = windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

class ResetIcon extends React.Component {
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
            borderRadius: width * 0.1,
            flex: 1,
            backgroundColor: '#fb1b2f'
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            this.props.pressed();
          }}
          style={[
            styles.centerContent,
            {
              flex: 1,
              flexDirection: 'row'
            }
          ]}
        >
          <MaterialIcon
            name={'replay'}
            size={(onTablet ? 21.5 : 25) * factor}
            color={'white'}
          />
          <View style={{ flex: 0.075 }} />
          <Text
            style={[
              styles.buttonText,
              {
                fontSize:
                  this.props.isMethod && onTablet
                    ? 16 * factor
                    : 14 * factor
              }
            ]}
          >
            RESET
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
}

export default withNavigation(ResetIcon);
