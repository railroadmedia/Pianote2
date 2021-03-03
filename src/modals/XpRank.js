/**
 * XpRank
 */
import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
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

  componentDidMount() {
    for (i in ranks) {
      if (this.state.XP >= ranks[i] && this.state.XP < ranks[Number(i) + 1]) {
        this.setState({
          nextRank: ranks[Number(i) + 1],
          rankProgress: (this.state.XP / ranks[Number(i) + 1]) * 100
        });
      }
    }
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.hideXpRank()}
      >
        <View style={[styles.container, styles.centerContent]}>
          <View style={localStyles.container}>
            <Text style={[styles.modalHeaderText, localStyles.title]}>
              Your XP Rank
            </Text>
            <Text style={[styles.modalBodyText, localStyles.description]}>
              You earn XP by completing lessons,{'\n'}
              commenting on videos and more!
            </Text>
            <View style={localStyles.description}>
              <View
                style={[
                  styles.centerContent,
                  localStyles.ProgressCircleContainer
                ]}
              >
                <ProgressCircle
                  percent={this.state.rankProgress}
                  radius={(DeviceInfo.isTablet() ? 0.2 : 0.27) * Dimensions.get('window').width}
                  borderWidth={5}
                  shadowColor={'pink'}
                  color={'red'}
                  bgColor={'white'}
                >
                  <View style={{ transform: [{ rotate: '45deg' }] }}>
                    <Text style={localStyles.XPtext}>
                      {Number(this.state.XP).toLocaleString()}
                    </Text>
                    <Text style={localStyles.rankText}>{this.state.rank}</Text>
                  </View>
                </ProgressCircle>
              </View>
            </View>
            <Text style={[styles.modalBodyText, localStyles.nextRank]}>
              Next rank: {this.state.nextRank}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

const localStyles = StyleSheet.create({
  container: {
    borderRadius: 15,
    backgroundColor: 'white',
    elevation: 10
  },
  title: {
    paddingHorizontal: 30,
    marginTop: 15
  },
  description: {
    paddingHorizontal: 20,
    marginVertical: 10,
    fontSize: DeviceInfo.isTablet() ? 18 : 14
  },
  ProgressCircleContainer: {
    transform: [{ rotate: '315deg' }]
  },
  XPtext: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: DeviceInfo.isTablet() ? 34 : 26
  },
  rankText: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: DeviceInfo.isTablet() ? 24 : 18
  },
  nextRank: {
    color: 'grey',
    paddingHorizontal: 40,
    marginVertical: 10,
    fontSize: DeviceInfo.isTablet() ? 18 : 14
  }
});

export default withNavigation(XpRank);
