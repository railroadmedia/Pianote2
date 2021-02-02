/**
 * ResetIcon
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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
            borderRadius: fullWidth * 0.1,
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
            size={(onTablet ? 21.5 : 25) * factorRatio}
            color={'white'}
          />
          <View style={{ flex: 0.075 }} />
          <Text style={styles.buttonText}>RESET</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

export default withNavigation(ResetIcon);
