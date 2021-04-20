import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

export default class StartIcon extends React.Component {
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

  whatIcon = () => {
    if (this.props.type == 'CONTINUE') {
      return (
        <EntypoIcon
          name={'controller-play'}
          size={this.sizing('icon')}
          color={'white'}
        />
      );
    } else if (this.props.type == 'START') {
      return (
        <EntypoIcon
          name={'controller-play'}
          size={this.sizing('icon')}
          color={'white'}
        />
      );
    } else if (this.props.type == 'RESET') {
      return (
        <MaterialIcon
          name={'replay'}
          size={this.sizing('icon')}
          color={'white'}
        />
      );
    } else if (this.props.type == 'MORE INFO') {
      return (
        <AntIcon
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
              this.props.type == 'MORE INFO' ? 'transparent' : '#fb1b2f',
            borderColor: this.props.type == 'MORE INFO' ? 'white' : '#fb1b2f',
            borderWidth: 2,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => this.props.pressed()}
          style={[
            styles.centerContent,
            {
              flex: 1,
              flexDirection: 'row',
            },
          ]}
        >
          {this.whatIcon()}
          <View style={{flex: 0.025}} />
          <Text
            style={[
              styles.buttonText,
              {
                fontSize: this.sizing('font'),
              },
            ]}
          >
            {this.props.type}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
}
