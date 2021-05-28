import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal
} from 'react-native';
import ProgressCircle from 'react-native-progress-circle';

const isTablet = global.onTablet;
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
    return (this.props.xp / this.nextRank()) * 100;
  };

  render = () => {
    return (
      <Modal
        transparent={true}
        visible={true}
        style={{ margin: 0, flex: 1 }}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={true}
        hasBackdrop={true}
        onBackButtonPress={() => this.props.hideXpRank()}
      >
        <TouchableOpacity
          style={[styles.centerContent, { margin: 0, flex: 1 }]}
          activeOpacity={1}
          onPress={() => this.props.hideXpRank()}
        >
          <View style={[localStyles.container, styles.centerContent]}>
            <Text style={[styles.modalHeaderText, localStyles.title]}>
              Your XP Rank
            </Text>
            <Text style={[styles.modalBodyText, localStyles.description]}>
              You earn XP by completing lessons,{'\n'}
              commenting on videos and more!
            </Text>
            <ProgressCircle
              percent={this.rankProgress()}
              radius={(onTablet ? 0.2 : 0.27) * Dimensions.get('window').width}
              borderWidth={5}
              shadowColor={'pink'}
              color={'red'}
              bgColor={'white'}
            >
              <Text style={localStyles.XPtext}>
                {Number(this.props.xp).toLocaleString()}
              </Text>
              <Text style={localStyles.rankText}>{this.props.rank}</Text>
            </ProgressCircle>
            <Text style={[styles.modalBodyText, localStyles.nextRank]}>
              Next rank: {this.nextRank()}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
}

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  container: {
    borderRadius: 15,
    backgroundColor: 'white',
    marginHorizontal: '10%',
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
