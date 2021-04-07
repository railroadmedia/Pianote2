/**
 * ResetIcon
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ResetIcon extends React.Component {
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
            borderRadius: 500,
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
            RESET
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
}
