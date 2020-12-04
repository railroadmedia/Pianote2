/**
 * XpRank
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { withNavigation } from 'react-navigation';
import ProgressCircle from 'react-native-progress-circle';

const ranks = [
  0,
  100,
  250,
  500,
  1000,
  2500,
  10000,
  25000,
  100000,
  250000,
  500000,
  1000000,
  1500000,
  2000000,
  2500000,
  3000000,
  4000000,
  5000000,
  7500000,
  100000000
];

class XpRank extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      rankProgress: null,
      XP: this.props.xp,
      rank: this.props.rank,
      nextRank: null
    };
  }

  UNSAFE_componentWillMount = () => {
    for (i in ranks) {
      if (this.state.XP >= ranks[i] && this.state.XP < ranks[Number(i) + 1]) {
        this.setState({
          nextRank: ranks[Number(i) + 1],
          rankProgress: (this.state.XP / ranks[Number(i) + 1]) * 100
        });
      }
    }
  };

  render = () => {
    return (
      <TouchableWithoutFeedback
        key={'container'}
        onPress={() => this.props.hideXpRank()}
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent'
        }}
      >
        <View
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent'
          }}
        >
          <View
            key={'content'}
            style={{
              borderRadius: 15 * factorRatio,
              backgroundColor: 'white',
              elevation: 10
            }}
          >
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 20 * factorRatio,
                fontWeight: 'bold',
                textAlign: 'center',
                paddingHorizontal: 40,
                marginTop: 10 * factorRatio
              }}
            >
              Your XP Rank
            </Text>

            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 16 * factorRatio,
                fontWeight: '300',
                textAlign: 'center',
                paddingHorizontal: 40,
                marginTop: 10 * factorRatio
              }}
            >
              You earn XP by completing lessons,{'\n'}
              commenting on videos and more!
            </Text>

            <View
              key={'circle'}
              style={{
                alignSelf: 'center',
                marginVertical: 10 * factorRatio,
                paddingHorizontal: 40
              }}
            >
              <View
                style={{
                  transform: [{ rotate: '315deg' }]
                }}
              >
                <ProgressCircle
                  percent={this.state.rankProgress}
                  radius={fullWidth * 0.27}
                  borderWidth={4 * factorRatio}
                  shadowColor={'pink'}
                  color={'red'}
                  bgColor={'white'}
                >
                  <View
                    style={{
                      transform: [{ rotate: '45deg' }]
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: 34 * factorRatio
                      }}
                    >
                      {Number(this.state.XP).toLocaleString()}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: 24 * factorRatio
                      }}
                    >
                      {this.state.rank}
                    </Text>
                  </View>
                </ProgressCircle>
              </View>
            </View>
            <View key={'nextRank'}>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 16 * factorRatio,
                  color: 'grey',
                  textAlign: 'center',
                  paddingHorizontal: 40,
                  marginVertical: 10 * factorRatio
                }}
              >
                Next rank: {this.state.nextRank}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default withNavigation(XpRank);
