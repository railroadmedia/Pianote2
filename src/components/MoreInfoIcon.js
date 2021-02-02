/**
 * StartIcon
 */
import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/AntDesign';

class MoreInfoIcon extends React.Component {
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
          <Icon name={'arrowright'} size={(onTablet ? 17.5 : 23) * factorRatio} color={'white'} />
          <View style={{ flex: 0.075 }} />
          <Text style={styles.buttonText}>MORE INFO</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

export default withNavigation(MoreInfoIcon);
