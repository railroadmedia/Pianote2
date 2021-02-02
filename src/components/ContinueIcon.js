/**
 * ContinueIcon
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/Entypo';

class ContinueIcon extends React.Component {
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
            borderRadius: fullWidth * 0.1,
            flex: 1,
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
            size={(onTablet) ? 17.5 * factorRatio : 25 * factorRatio}
            color={'white'}
          />
          <View style={{ flex: 0.025 }} />
          <Text style={styles.buttonText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

export default withNavigation(ContinueIcon);
