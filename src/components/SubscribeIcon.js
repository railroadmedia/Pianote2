/**
 * SubscribeIcon
 */
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import Subscribe from 'Pianote2/src/assets/img/svgs/subscribe.svg';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

class SubscribeIcon extends React.Component {
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
            width: this.props.buttonWidth,
            height: this.props.buttonHeight,
            backgroundColor: '#fb1b2f',
            flexDirection: 'row',
            elevation: 5
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
          <View style={{ flex: 1 }} />
          <Subscribe height={18 * factor} width={18 * factor} fill={'white'} />
          <View style={{ flex: 0.2 }} />
          <Text style={styles.buttonText}>SUBSCRIBE</Text>
          <View style={{ flex: 1 }} />
        </TouchableOpacity>
      </View>
    );
  };
}

export default withNavigation(SubscribeIcon);
