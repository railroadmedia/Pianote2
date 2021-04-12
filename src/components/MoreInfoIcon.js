/**
 * StartIcon
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

export default class MoreInfoIcon extends React.Component {
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
          return 22.5;
        }
      } else {
        return 17.5;
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
            borderRadius: 500,
            backgroundColor: 'transparent',
            borderColor: 'white',
            borderWidth: 2
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
            name={'arrowright'}
            size={this.sizing('icon')}
            color={'white'}
          />
          <View style={{ flex: 0.075 }} />
          <Text
            style={[
              styles.buttonText,
              {
                fontSize: this.sizing('font')
              }
            ]}
          >
            MORE INFO
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
}
