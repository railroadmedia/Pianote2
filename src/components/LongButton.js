import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../assets/icons';

export default class StartIcon extends React.Component {
  sizing = type => {
    if (type === 'icon') {
      if (onTablet) {
        if (this.props.isMethod) {
          return 30;
        }
        return 25;
      }
      return 20;
    } else {
      if (onTablet) {
        if (this.props.isMethod) {
          return 17.5;
        }
        return 15;
      }
      return 12.5;
    }
  };

  whatIcon = () => {
    if (this.props.type === 'CONTINUE') {
      return (
        <Icon.Entypo
          name={'controller-play'}
          size={this.sizing('icon')}
          color={'white'}
        />
      );
    } else if (this.props.type === 'START') {
      return (
        <Icon.Entypo
          name={'controller-play'}
          size={this.sizing('icon')}
          color={'white'}
        />
      );
    } else if (this.props.type === 'RESET') {
      return (
        <Icon.MaterialCommunityIcons
          name={'replay'}
          size={this.sizing('icon')}
          color={'white'}
        />
      );
    } else if (this.props.type === 'MORE INFO') {
      return (
        <Icon.AntDesign
          name={'arrowright'}
          size={this.sizing('icon')}
          color={'white'}
        />
      );
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
            backgroundColor:
              this.props.type === 'MORE INFO' ? 'transparent' : '#fb1b2f',
            borderColor: this.props.type === 'MORE INFO' ? 'white' : '#fb1b2f',
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
          {this.whatIcon()}
          <Text
            style={[
              styles.buttonText,
              {
                marginLeft: '2.5%',
                fontSize: this.sizing('font')
              }
            ]}
          >
            {this.props.type}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
}
