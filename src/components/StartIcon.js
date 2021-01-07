/**
 * StartIcon
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/Entypo';

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
            borderRadius: fullWidth * 0.1,
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
            size={25 * factorRatio}
            color={'white'}
          />
          <View style={{ flex: 0.025 }} />
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

export default withNavigation(StartIcon);
