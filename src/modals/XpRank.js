import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ProgressCircle from 'react-native-progress-circle';

const isTablet = DeviceInfo.isTablet();
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

export default class XpRank extends React.Component {
  nextRank = () => {
    return ranks.find(r => this.props.xp < r) || 100000000;
  };

  rankProgress = () => {
    return (this.props.xp / this.nextRank) * 100;
  };

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
                  percent={this.rankProgress()}
                  radius={
                    (DeviceInfo.isTablet() ? 0.2 : 0.27) *
                    Dimensions.get('window').width
                  }
                  borderWidth={5}
                  shadowColor={'pink'}
                  color={'red'}
                  bgColor={'white'}
                >
                  <View style={{ transform: [{ rotate: '45deg' }] }}>
                    <Text style={localStyles.XPtext}>
                      {Number(this.props.xp).toLocaleString()}
                    </Text>
                    <Text style={localStyles.rankText}>{this.props.rank}</Text>
                  </View>
                </ProgressCircle>
              </View>
            </View>
            <Text style={[styles.modalBodyText, localStyles.nextRank]}>
              Next rank: {this.nextRank()}
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
    fontSize: isTablet ? 18 : 14
  },
  ProgressCircleContainer: {
    transform: [{ rotate: '315deg' }]
  },
  XPtext: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: isTablet ? 34 : 26
  },
  rankText: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: isTablet ? 24 : 18
  },
  nextRank: {
    color: 'grey',
    paddingHorizontal: 40,
    marginVertical: 10,
    fontSize: isTablet ? 18 : 14
  }
});
